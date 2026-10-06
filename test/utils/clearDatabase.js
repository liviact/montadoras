import { connection } from "../../src/configs/Database.js";

export async function clearDatabase() {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    await connection.query('DELETE FROM veiculos');
    await connection.query('DELETE FROM clientes');
    await connection.query('DELETE FROM montadoras');

   await connection.query('SET FOREIGN_KEY_CHECKS = 1');  

}