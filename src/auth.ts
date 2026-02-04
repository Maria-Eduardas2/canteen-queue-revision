import bcrypt from "bcryptjs";
// import { db } from "./db";
import { Database } from "bun:sqlite";

export async function cadastrar(nome: string, login: string, senha: string) {
  const hash = await bcrypt.hash(senha, 10);

  // db.run(
  //       'INSERT INTO usuarios (nome, login, senha_hash) VALUES (?, ?, ?)',
  //       [nome, login, hash]
  //   );

  console.log("Usuário cadastrado");
}

export async function loginUser(login: string, senha: string) {
  // const user = await db.run(
  //     'SELECT * FROM usuarios WHERE login = ? AND ativo = 1',
  //     [login]
  // );
  // if (!user) {
  //   console.log("Usuário não encontrado.");
  //   return null;
  // }
  // const ok = await bcrypt.compare(senha, user.senha_hash);
  //     if (!ok) {
  //         console.log("Senha incorreta.");
  //         return null;
  //     }
  //     console.log('Bem vindo, ${user.nome}' (${user.perfil}));
  //     return user;
}
