import { connection } from '../configs/Database.js';

const montadoraRepository = {
    criar: async (montadora) => {
        const sql = 'INSERT INTO montadoras (Nome, Pais) VALUES (?, ?);';
        const values = [montadora.nome, montadora.pais];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (montadora) => {
        const sql = 'UPDATE montadoras SET Nome = ?, Pais = ? WHERE Id = ?;';
        const values = [montadora.nome, montadora.pais, montadora.id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar: async (id) => {
        const sql = 'DELETE FROM montadoras WHERE Id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },
    selecionar: async () => {
        const sql = 'SELECT * FROM montadoras ORDER BY Nome;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
};

export default montadoraRepository;