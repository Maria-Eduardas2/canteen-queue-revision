import { db } from "./db";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  ativo: number;
}

const pedidoAtual: {
    itens:{
        id: number;
        nome: string;
        preco: number;
        qtd: number
    } [];
} = { itens: [] };

export function calcularTotal() {
  return pedidoAtual.itens.reduce((t, i) => t + i.preco * i.qtd, 0);
}

export function adicionarItem(id: number, qtd: number) {
  const produto = db
    .query("SELECT * FROM produtos WHERE id = ? AND ativo = 1")
    .get(id) as Produto | undefined;

  if (!produto) throw new Error("Produto não encontrado ou inativo");
  if (qtd <= 0) throw new Error("Quantidade deve ser > 0");

  const existente = pedidoAtual.itens.find((i) => i.id === id);
  if (existente) existente.qtd += qtd;
  else
    pedidoAtual.itens.push({
      id,
      nome: produto.nome,
      preco: produto.preco,
      qtd,
    });
}

export function limparPedido() {
  pedidoAtual.itens = [];
}