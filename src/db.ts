import { Database } from "bun:sqlite";
export const db = new Database("main.sqlite");

db.run("PRAGMA foreign_keys = ON;");

db.run(`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

console.table(db.query("SELECT * FROM usuarios").all());

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    perfil TEXT NOT NULL DEFAULT 'ATENDENTE',
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (perfil IN ('ADMIN', 'ATENDENTE'))
  );
`);
db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS pedido_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    qtd INTEGER NOT NULL,
    preco_unit REAL NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );
  `);

console.log("dbs created");
console.log(
  db
    .query(
      `SELECT id, nome, preco
FROM produtos
WHERE nome LIKE '%co%';`,
    )
    .all(),
);

// console.log(
//   db
//     .query(
//       `INSERT INTO produtos (nome, preco) VALUES
// ('Coxinha', 7.50),
// ('Pão de queijo', 5.00),
// ('Suco', 6.00),
// ('Refrigerante', 6.50),
// ('Bolo', 8.00);
// `,
//     )
//     .run(),
// );
