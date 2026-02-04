import prompts from "prompts";
import chalk from "chalk";
import { db } from "./db";

export async function menu() {
  const { choice } = await prompts({
    type: "select",
    name: "choice",
    message: "Escolha uma opção:",
    choices: [
      { title: "Cadastrar", value: "cadastrar" },
      { title: "Entrar", value: "login" },
      { title: "Sair", value: "sair" },
    ],
  });

  switch (choice) {
    case "cadastrar":
      await cadastrar();
      break;
    case "login":
      await loginUser();
      break;
    case "sair":
      console.log(chalk.green("Até logo!"));
      break;
    default:
      console.log(chalk.red("Opção inválida"));
      break;
  }
}

export async function cadastrar() {
  const { name, email } = await prompts([
    {
      type: "text",
      name: "name",
      message: "Digite seu nome:",
    },
    {
      type: "text",
      name: "email",
      message: "Digite seu email:",
    },
  ]);

  db.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)").run(name, email);

  console.log(chalk.green(`Usuário ${name} cadastrado com sucesso!`));
}

export async function loginUser() {
  const { email } = await prompts({
    type: "text",
    name: "email",
    message: "Digite seu email:",
  });

  const user = db
    .query("SELECT * FROM usuarios WHERE email = ? AND ativo = 1")
    .get(email);

  if (!user) {
    console.log(chalk.red("Usuário não encontrado"));
    return;
  }

  console.log(chalk.green(`Usuário ${user.nome} logado com sucesso!`));
}

menu();
