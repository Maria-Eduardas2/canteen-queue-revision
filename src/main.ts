import prompts from "prompts";
import chalk from "chalk";
import { menuAutenticacao, menuProdutos, menuPedidos } from "./menu";
import { obterUsuarioLogado, fazerLogout } from "./auth";

async function menuPrincipal() {
  let executando = true;

  console.log(chalk.bold.cyan("\n╔════════════════════════════════════╗"));
  console.log(chalk.bold.cyan("║   BEM-VINDO À FILA DE CANTINA   ║"));
  console.log(chalk.bold.cyan("╚════════════════════════════════════╝\n"));

  while (executando) {
    const usuario = obterUsuarioLogado();
    const { opcao } = await prompts({
      type: "select",
      name: "opcao",
      message: chalk.bold(`Olá, ${usuario?.nome}! O que deseja fazer?`),
      choices: [
        { title: "Gerenciar Produtos", value: "produtos" },
        { title: "Gerenciar Pedidos", value: "pedidos" },
        { title: "Logout", value: "logout" },
        { title: "Sair", value: "sair" },
      ],
    });

    switch (opcao) {
      case "produtos":
        await menuProdutos();
        break;
      case "pedidos":
        await menuPedidos();
        break;
      case "logout":
        fazerLogout();
        executando = false;
        break;
      case "sair":
        console.log(chalk.green.bold("\n✓ Até logo!\n"));
        executando = false;
        process.exit(0);
    }
  }
}

async function iniciar() {
  await menuAutenticacao();
  await menuPrincipal();
}

iniciar();
