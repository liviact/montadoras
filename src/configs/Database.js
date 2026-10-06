import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

console.log('NODE_ENV:', process.env.NODE_ENV);

// Configuração do dotenv para carregar variáveis de ambiente
dotenv.config({
    path: process.env.NODE_ENV == 'test'
        ? '.env.test'
        : '.env',
    override: true
});

// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;

    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        });
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }

    getPool() {
        return this.#pool;
    }
}

export const connection = Database.getInstance().getPool();