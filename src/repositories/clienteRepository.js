import { connection } from '../configs/Database.js';

const clienteRepository = {
    criar: async (cliente) => {
        const sql = `
            INSERT INTO clientes
                (Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.cep,
            cliente.logradouro,
            cliente.bairro,
            cliente.cidade,
            cliente.uf,
            cliente.numero,
            cliente.complemento
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (cliente) => {
        const sql = `
            UPDATE clientes
            SET Nome = ?, CPF = ?, CEP = ?, Logradouro = ?, Bairro = ?, Cidade = ?, UF = ?, Numero = ?, Complemento = ?
            WHERE Id = ?;
        `;
        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.cep,
            cliente.logradouro,
            cliente.bairro,
            cliente.cidade,
            cliente.uf,
            cliente.numero,
            cliente.complemento,
            cliente.id
        ];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar: async (id) => {
        const sql = 'DELETE FROM clientes WHERE Id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },
    selecionarPorId: async (id) => {
        const sql = 'SELECT * FROM clientes WHERE Id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows[0] || null;
    },
    selecionar: async () => {
        const sql = 'SELECT * FROM clientes ORDER BY Nome;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
};

export default clienteRepository;