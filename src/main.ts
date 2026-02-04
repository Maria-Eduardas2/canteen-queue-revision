import { prompt } from "./input.ts";
import { cadastrar, loginUser } from "./auth";

async function menu() {
  console.log("\n1 - Cadastrar");
  console.log("2 - Login");
  console.log("0 - Sair");

  const op = await prompt("Escolha: ");

  if (op === "1") {
    const nome = await prompt("Nome: ");
    const login = await prompt("Login: ");
    const senha = await prompt("Senha: ");

    await cadastrar(nome, login, senha);
  }

  if (op === "2") {
    const login = await prompt("Login: ");
    const senha = await prompt("Senha: ");

    await loginUser(login, senha);
  }

  if (op !== "0") await menu();
}

menu();
