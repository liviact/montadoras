import {connection} from '../../src/configs/Database.js'

export class ClienteFactory {
    static async create(nome, CPF, CEP, logradouro, bairro, cidade, UF, numero, complemento
    ) {
        const [result] = await connection.execute(
            'INSERT INTO clientes (nome, CPF, CEP, logradouro, bairro, cidade, UF, numero, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
            [nome, CPF, CEP, logradouro, bairro, cidade, UF, numero, complemento]
        );

        return {
            id: result.insertId,
            nome,
            CPF, 
            CEP,
            logradouro,
            bairro,
            cidade,
            UF,
            numero,
            complemento
        };
    }
}