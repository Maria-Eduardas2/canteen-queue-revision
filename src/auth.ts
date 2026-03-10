import bcrypt from "bcryptjs";
import { db } from "./db";
import chalk from "chalk";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  perfil: string;
  ativo: number;
  criado_em: string;
}

let usuarioLogado: Usuario | null = null;

export async function cadastrar(
  nome: string,
  email: string,
  senha: string
): Promise<boolean> {
  try {
    // Verificar se email já existe
    const usuarioExistente = db
      .query("SELECT * FROM usuarios WHERE email = ?")
      .get(email) as Usuario | undefined;

    if (usuarioExistente) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir no banco de dados
    db.query(
      "INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo) VALUES (?, ?, ?, ?, ?)"
    ).run(nome, email, senhaHash, "ATENDENTE", 1);

    console.log(chalk.green(`✓ Usuário "${nome}" cadastrado com sucesso!`));
    return true;
  } catch (erro) {
    throw new Error((erro as Error).message);
  }
}

export async function loginUser(
  email: string,
  senha: string
): Promise<Usuario | null> {
  try {
    // Buscar usuário
    const usuario = db
      .query("SELECT * FROM usuarios WHERE email = ? AND ativo = 1")
      .get(email) as Usuario | undefined;

    if (!usuario) {
      throw new Error("Usuário não encontrado ou inativo");
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      throw new Error("Senha incorreta");
    }

    usuarioLogado = usuario;
    console.log(
      chalk.green(`✓ Bem-vindo, ${usuario.nome}! (${usuario.perfil})`)
    );
    return usuario;
  } catch (erro) {
    throw new Error((erro as Error).message);
  }
}

export function obterUsuarioLogado(): Usuario | null {
  return usuarioLogado;
}

export function fazerLogout(): void {
  usuarioLogado = null;
  console.log(chalk.yellow("✓ Logout realizado"));
}
