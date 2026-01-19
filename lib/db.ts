import Database from 'better-sqlite3';

const db = new Database('data/dev.db');

// criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS Reserva (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quarto TEXT NOT NULL,
    checkin TEXT NOT NULL,
    checkout TEXT NOT NULL,
    nomeHospede TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

export default db;
