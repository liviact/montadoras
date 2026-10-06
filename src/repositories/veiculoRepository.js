import { connection } from '../configs/Database.js';

const veiculoRepository = {
    criar: async (veiculo) => {
        const sql = 'INSERT INTO veiculos (IdMontadora, IdCliente, Modelo, Placa, Ano, Cor, Valor) VALUES (?, ?, ?, ?, ?, ?, ?);';
        const values = [veiculo.idMontadora, veiculo.idCliente, veiculo.modelo, veiculo.placa, veiculo.ano, veiculo.cor, veiculo.valor];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar: async (veiculo) => {
        const sql = 'UPDATE veiculos SET IdMontadora = ?, IdCliente = ?, Modelo = ?, Placa = ?, Ano = ?, Cor = ?, Valor = ? WHERE Id = ?;';
        const values = [veiculo.idMontadora, veiculo.idCliente, veiculo.modelo, veiculo.placa, veiculo.ano, veiculo.cor, veiculo.valor, veiculo.id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar: async (id) => {
        const sql = 'DELETE FROM veiculos WHERE Id = ?;';
        const [rows] = await connection.execute(sql, [id]);
        return rows;
    },
    selecionarPorId: async (id) => {
        const sql = `
            SELECT
                v.Id,
                v.IdMontadora,
                v.IdCliente,
                m.Nome AS Montadora,
                c.Nome AS Cliente,
                v.Modelo,
                v.Placa,
                v.Ano,
                v.Cor,
                v.Valor,
                v.DataCad
            FROM veiculos v
            INNER JOIN montadoras m ON m.Id = v.IdMontadora
            INNER JOIN clientes c ON c.Id = v.IdCliente
            WHERE v.Id = ?;
        `;
        const [rows] = await connection.execute(sql, [id]);
        return rows[0] || null;
    },
    selecionar: async () => {
        const sql = `
            SELECT
                v.Id,
                v.IdMontadora,
                v.IdCliente,
                m.Nome AS Montadora,
                c.Nome AS Cliente,
                v.Modelo,
                v.Placa,
                v.Ano,
                v.Cor,
                v.Valor,
                v.DataCad
            FROM veiculos v
            INNER JOIN montadoras m ON m.Id = v.IdMontadora
            INNER JOIN clientes c ON c.Id = v.IdCliente
            ORDER BY v.Modelo;
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    }
};

export default veiculoRepository;