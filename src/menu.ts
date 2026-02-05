import prompts from "prompts";
import chalk from "chalk";
import { cadastrar, loginUser, fazerLogout } from "./auth";
import {
  listarProdutos,
  criarProduto,
  editarProduto,
  inativarProduto,
} from "./produtos";
import {
  calcularTotal,
  adicionarItem,
  limparPedido,
  obterItensPedido,
} from "./pedidos";

export async function menuAutenticacao() {
  let autenticado = false;

  while (!autenticado) {
    const { opcao } = await prompts({
      type: "select",
      name: "opcao",
      message: chalk.cyan("=== BEM-VINDO À FILA DE CANTINA ==="),
      choices: [
        { title: "Cadastrar", value: "cadastrar" },
        { title: "Login", value: "login" },
        { title: "Sair", value: "sair" },
      ],
    });

    try {
      switch (opcao) {
        case "cadastrar":
          await telaCadastro();
          break;
        case "login":
          autenticado = await telaLogin();
          break;
        case "sair":
          console.log(chalk.green.bold("\n✓ Até logo!\n"));
          process.exit(0);
      }
    } catch (erro) {
      console.log(chalk.red(`Erro: ${(erro as Error).message}`));
    }
  }
}

async function telaCadastro() {
  const { nome, email, senha, confirmarSenha } = await prompts([
    {
      type: "text",
      name: "nome",
      message: "Nome completo:",
      validate: (val) => val.trim().length > 0 || "Nome não pode ser vazio",
    },
    {
      type: "text",
      name: "email",
      message: "Email:",
      validate: (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Email inválido",
    },
    {
      type: "password",
      name: "senha",
      message: "Senha:",
      validate: (val) => val.length >= 6 || "Senha deve ter no mínimo 6 caracteres",
    },
    {
      type: "password",
      name: "confirmarSenha",
      message: "Confirmar senha:",
    },
  ]);

  if (senha !== confirmarSenha) {
    throw new Error("As senhas não conferem");
  }

  await cadastrar(nome, email, senha);
}

async function telaLogin(): Promise<boolean> {
  const { email, senha } = await prompts([
    {
      type: "text",
      name: "email",
      message: "Email:",
    },
    {
      type: "password",
      name: "senha",
      message: "Senha:",
    },
  ]);

  const usuario = await loginUser(email, senha);
  return !!usuario;
}

export async function menuProdutos() {
  let continuando = true;

  while (continuando) {
    const { opcao } = await prompts({
      type: "select",
      name: "opcao",
      message: chalk.cyan("=== MENU DE PRODUTOS ==="),
      choices: [
        { title: "Listar produtos", value: "listar" },
        { title: "Criar produto", value: "criar" },
        { title: "Editar produto", value: "editar" },
        { title: "Inativar produto", value: "inativar" },
        { title: "Voltar", value: "voltar" },
      ],
    });

    try {
      switch (opcao) {
        case "listar":
          await listar();
          break;
        case "criar":
          await criar();
          break;
        case "editar":
          await editar();
          break;
        case "inativar":
          await inativar();
          break;
        case "voltar":
          continuando = false;
          break;
      }
    } catch (erro) {
      console.log(chalk.red(`Erro: ${(erro as Error).message}`));
    }
  }
}

async function listar() {
  const { filtro } = await prompts({
    type: "select",
    name: "filtro",
    message: "Mostrar:",
    choices: [
      { title: "Apenas ativos", value: "ativos" },
      { title: "Todos", value: "todos" },
    ],
  });

  const { busca } = await prompts({
    type: "text",
    name: "busca",
    message: "Buscar por nome (deixe em branco para mostrar todos):",
  });

  const produtos = listarProdutos(filtro, busca);
  if (produtos.length === 0) {
    console.log(chalk.yellow("Nenhum produto encontrado"));
    return;
  }

  console.log(chalk.green("\n--- PRODUTOS ---"));
  console.table(produtos);
}

async function criar() {
  const { nome, preco } = await prompts([
    {
      type: "text",
      name: "nome",
      message: "Nome do produto:",
      validate: (val) => val.trim().length > 0 || "Nome não pode ser vazio",
    },
    {
      type: "number",
      name: "preco",
      message: "Preço do produto:",
      validate: (val) => val > 0 || "Preço deve ser maior que 0",
    },
  ]);

  criarProduto(nome, preco);
  console.log(chalk.green(`✓ Produto "${nome}" criado com sucesso!`));
}

async function editar() {
  const produtos = listarProdutos("todos");
  if (produtos.length === 0) {
    console.log(chalk.yellow("Nenhum produto disponível"));
    return;
  }

  const { id } = await prompts({
    type: "select",
    name: "id",
    message: "Selecione o produto:",
    choices: produtos.map((p) => ({
      title: `[${p.id}] ${p.nome} - R$ ${p.preco.toFixed(2)} ${p.ativo ? "" : "(inativo)"}`,
      value: p.id,
    })),
  });

  const { nome, preco } = await prompts([
    {
      type: "text",
      name: "nome",
      message: "Novo nome:",
    },
    {
      type: "number",
      name: "preco",
      message: "Novo preço:",
    },
  ]);

  editarProduto(id, nome, preco);
  console.log(chalk.green(`✓ Produto atualizado com sucesso!`));
}

async function inativar() {
  const produtos = listarProdutos("ativos");
  if (produtos.length === 0) {
    console.log(chalk.yellow("Nenhum produto ativo disponível"));
    return;
  }

  const { id } = await prompts({
    type: "select",
    name: "id",
    message: "Selecione o produto a inativar:",
    choices: produtos.map((p) => ({
      title: `[${p.id}] ${p.nome} - R$ ${p.preco.toFixed(2)}`,
      value: p.id,
    })),
  });

  inativarProduto(id);
  console.log(chalk.green(`✓ Produto inativado com sucesso!`));
}

export async function menuPedidos() {
  let continuando = true;

  while (continuando) {
    const itens = obterItensPedido();
    const total = calcularTotal();

    const { opcao } = await prompts({
      type: "select",
      name: "opcao",
      message: chalk.cyan(
        `=== MENU DE PEDIDOS === (${itens.length} itens) - Total: R$ ${total.toFixed(2)}`
      ),
      choices: [
        { title: "Adicionar item", value: "adicionar" },
        { title: "Visualizar pedido", value: "visualizar" },
        { title: "Limpar pedido", value: "limpar" },
        { title: "Voltar", value: "voltar" },
      ],
    });

    try {
      switch (opcao) {
        case "adicionar":
          await adicionarItemMenu();
          break;
        case "visualizar":
          await visualizarPedido();
          break;
        case "limpar":
          const { confirmar } = await prompts({
            type: "confirm",
            name: "confirmar",
            message: "Tem certeza que deseja limpar o pedido?",
            initial: false,
          });
          if (confirmar) {
            limparPedido();
            console.log(chalk.green("✓ Pedido limpo!"));
          }
          break;
        case "voltar":
          continuando = false;
          break;
      }
    } catch (erro) {
      console.log(chalk.red(`Erro: ${(erro as Error).message}`));
    }
  }
}

async function adicionarItemMenu() {
  const produtos = listarProdutos("ativos");
  if (produtos.length === 0) {
    console.log(chalk.yellow("Nenhum produto ativo disponível"));
    return;
  }

  const { id } = await prompts({
    type: "select",
    name: "id",
    message: "Selecione o produto:",
    choices: produtos.map((p) => ({
      title: `[${p.id}] ${p.nome} - R$ ${p.preco.toFixed(2)}`,
      value: p.id,
    })),
  });

  const { qtd } = await prompts({
    type: "number",
    name: "qtd",
    message: "Quantidade:",
    validate: (val) => val > 0 || "Quantidade deve ser maior que 0",
  });

  adicionarItem(id, qtd);
  console.log(chalk.green(`✓ Item adicionado ao pedido!`));
}

async function visualizarPedido() {
  const itens = obterItensPedido();

  if (itens.length === 0) {
    console.log(chalk.yellow("Pedido vazio"));
    return;
  }

  console.log(chalk.green("\n--- PEDIDO ATUAL ---"));
  const tabelaPedido = itens.map((item) => ({
    ID: item.id,
    Produto: item.nome,
    "Preço Unit.": `R$ ${item.preco.toFixed(2)}`,
    Qtd: item.qtd,
    Subtotal: `R$ ${(item.preco * item.qtd).toFixed(2)}`,
  }));
  console.table(tabelaPedido);
  console.log(chalk.bold(`Total: R$ ${calcularTotal().toFixed(2)}`));
}
