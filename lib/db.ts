// lib/db.ts
import Database from 'better-sqlite3';

import path from 'path';


const dbPath = path.join(process.cwd(), 'data', 'dev.db');
const db = new Database(dbPath);


// criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS Reserva (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quarto TEXT NOT NULL,
    checkin TEXT NOT NULL,
    checkout TEXT NOT NULL,
    camas INTEGER NOT NULL DEFAULT 1,
    nomeHospede TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

export default db;
