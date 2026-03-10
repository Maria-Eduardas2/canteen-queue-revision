type Pagina =
  | "listar"
  | "criar"
  | "editar"
  | "inativar"
  | "addItem"
  | "verPedido"
  | "limparPedido";

function toggleMenu(id: string): void {
  const menu = document.getElementById(id) as HTMLElement;

  if (!menu) return;

  menu.style.display =
    menu.style.display === "none" ? "block" : "none";
}

function abrirPagina(pagina: Pagina): void {
  const area = document.getElementById("conteudo") as HTMLElement;

  if (!area) return;

  if (pagina === "listar") {
    area.innerHTML = `
      <h2>Listar Produtos</h2>

      <select id="filtro">
        <option value="ativos">Ativos</option>
        <option value="todos">Todos</option>
      </select>

      <input id="busca" placeholder="Buscar produto">

      <button id="buscar">Buscar</button>

      <div id="listaProdutos"></div>
    `;
  }

  if (pagina === "criar") {
    area.innerHTML = `
      <h2>Criar Produto</h2>

      <input id="nome" placeholder="Nome">

      <input id="preco" placeholder="Preço">

      <button id="salvar">Salvar</button>
    `;
  }

  if (pagina === "editar") {
    area.innerHTML = `
      <h2>Editar Produto</h2>

      <p>Clique em um produto para editar</p>

      <div id="listaProdutos"></div>
    `;
  }

  if (pagina === "inativar") {
    area.innerHTML = `
      <h2>Inativar Produto</h2>

      <p>Clique em um produto para inativar</p>

      <div id="listaProdutos"></div>
    `;
  }

  if (pagina === "addItem") {
    area.innerHTML = `
      <h2>Adicionar Item</h2>

      <p>Clique em um produto para adicionar ao pedido</p>

      <div id="listaProdutos"></div>
    `;
  }

  if (pagina === "verPedido") {
    area.innerHTML = `
      <h2>Pedido Atual</h2>

      <div id="itensPedido"></div>
    `;
  }

  if (pagina === "limparPedido") {
    area.innerHTML = `
      <h2>Limpar Pedido</h2>

      <p>Tem certeza que deseja limpar?</p>

      <button id="limpar">Limpar Pedido</button>
    `;

    const botao = document.getElementById("limpar");

    botao?.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja limpar o pedido?")) {
        console.log("Pedido limpo");
      }
    });
       console.log("script");
  }
}