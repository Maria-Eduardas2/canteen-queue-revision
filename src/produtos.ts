import { validarProduto } from "./validarProduto.ts";
import { db } from "./db.ts";

//listar produtos
export function listarProdutos(filtro: "ativos" | "todos" = "ativos", busca: string = "") {
    const termo = `%${busca}%`;
    const sql =
      filtro === "todos"
        ? "SELECT * FROM produtos WHERE nome LIKE ? ORDER BY id DESC"
        : "SELECT * FROM produtos WHERE ativo = 1 AND nome LIKE ? ORDER BY id DESC";
    return db.query(sql).all(termo);
}
 
//criar produto
export function criarProduto(nome: string, preco: number){
  const erros = validarProduto({nome, preco});
  if (erros.length) throw new Error(erros.join(", "));
  db.query("INSERT INTO produtos (nome, preco) VALUES (?, ?)").run(nome, preco);
}

//editar produto
export function editarProduto(id: number, nome:string, preco: number) {
  const erros = validarProduto({nome, preco});
  if (erros.length) throw new Error(erros.join(", "));
  db.query("UPDATE produtos SET nome = ?, preco = ? WHERE id = ?").run(nome, preco, id);
}

//inativar produto
export function inativarProduto(id: number) {
  db.query("UPDATE produtos SET ativo = 0 WHERE id = ?").run(id);
}