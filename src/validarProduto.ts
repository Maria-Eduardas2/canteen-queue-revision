export function validarProduto(produto: { nome: string; preco: number }) {
    const erros: string[] = [];
    if (!produto.nome || produto.nome.trim() === "") erros.push("Nome não pode ser vazio");
    if (!produto.preco || Number(produto.preco) <= 0) erros.push("Preço deve ser > 0");
    return erros;
  }