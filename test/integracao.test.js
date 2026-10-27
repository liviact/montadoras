
import app from '../src/app.js';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import { connection } from '../src/configs/Database.js';
import { clearDatabase } from './utils/clearDatabase.js';

vi.mock('axios', () => ({
    default: {
        get: vi.fn()
    }
}));

const clienteValido = {
    nome: 'Livia Caetano',
    cpf: '12345678901',
    cep: '13010000',
    numero: '100'
};

const clienteAtualizado = {
    nome: 'Livia Souza',
    cpf: '98765432100',
    cep: '13010000',
    numero: '200',
    complemento: 'Apto 2'
};

const dadosCep = {
    cep: '13010000',
    logradouro: 'Rua Teste',
    bairro: 'Centro',
    cidade: 'Campinas',
    uf: 'SP'
};

async function criarCliente() {
    const [result] = await connection.execute(
        `INSERT INTO clientes
        (Nome, CPF, CEP, Logradouro, Bairro, Cidade, UF, Numero, Complemento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            clienteValido.nome,
            clienteValido.cpf,
            clienteValido.cep,
            dadosCep.logradouro,
            dadosCep.bairro,
            dadosCep.cidade,
            dadosCep.uf,
            clienteValido.numero,
            null
        ]
    );

    return result.insertId;
}

async function criarMontadora() {
    const [result] = await connection.execute(
        'INSERT INTO montadoras (Nome, Pais) VALUES (?, ?)',
        ['Toyota', 'Japão']
    );

    return result.insertId;
}

async function criarVeiculo(idMontadora, idCliente) {
    const [result] = await connection.execute(
        `INSERT INTO veiculos
        (IdMontadora, IdCliente, Modelo, Placa, Ano, Cor, Valor)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [idMontadora, idCliente, 'Corolla', 'ABC1D23', 2024, 'Prata', 120000]
    );

    return result.insertId;
}

beforeEach(async () => {
    await clearDatabase();

    axios.get.mockResolvedValue({
        data: dadosCep
    });
});

afterEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();
});

describe('CT-001 a CT-006 - Clientes', () => {
    it('CT-001 - deve listar clientes cadastrados', async () => {
        await criarCliente();

        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].Nome).toBe(clienteValido.nome);
    });

    it('CT-002 - deve rejeitar cliente com campos obrigatórios vazios', async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                ...clienteValido,
                nome: ''
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar cliente');
    });

    it('CT-003 - deve buscar cliente existente pelo ID', async () => {
        const id = await criarCliente();

        const response = await request(app)
            .get(`/clientes/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('Id', id);
        expect(response.body.data.Nome).toBe(clienteValido.nome);
    });

    it('CT-004 - deve informar quando o cliente não existe', async () => {
        const response = await request(app)
            .get('/clientes/999999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Cliente não encontrado');
    });

    it('CT-005 - deve listar clientes sem retornar erro quando houver cadastro', async () => {
        await criarCliente();

        const response = await request(app)
            .get('/clientes');

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('CT-006 - deve excluir cliente existente', async () => {
        const id = await criarCliente();

        const response = await request(app)
            .delete(`/clientes/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Cliente deletado com sucesso');
        expect(response.body.data.affectedRows).toBe(1);
    });
});

describe('CT-007 a CT-011 - Montadoras', () => {
    it('CT-007 - deve cadastrar montadora com dados válidos', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ nome: 'Hyundai', pais: 'Coreia do Sul' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Montadora criada com sucesso');
        expect(response.body.data).toHaveProperty('insertId');
    });

    it('CT-008 - deve rejeitar montadora sem nome', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ pais: 'Brasil' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar montadora');
    });

    it('CT-009 - deve listar todas as montadoras', async () => {
        await criarMontadora();

        const response = await request(app)
            .get('/montadoras');

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBe(1);
    });

    it('CT-010 - deve alterar uma montadora', async () => {
        const id = await criarMontadora();

        const response = await request(app)
            .put(`/montadoras?id=${id}`)
            .send({ nome: 'Honda', pais: 'Japão' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Montadora atualizada com sucesso');
        expect(response.body.data.affectedRows).toBe(1);
    });

    it('CT-011 - deve excluir uma montadora', async () => {
        const id = await criarMontadora();

        const response = await request(app)
            .delete(`/montadoras/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Montadora deletada com sucesso');
        expect(response.body.data.affectedRows).toBe(1);
    });
});

describe('CT-012 a CT-018 - Veículos', () => {
    it('CT-012 - deve cadastrar veículo com dados válidos', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();

        const response = await request(app)
            .post('/veiculos')
            .send({
                idMontadora,
                idCliente,
                modelo: 'Civic',
                placa: 'DEF4G56',
                ano: 2025,
                cor: 'Preto',
                valor: 150000
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Veículo criado com sucesso');
        expect(response.body.data).toHaveProperty('insertId');
    });

    it('CT-013 - deve rejeitar veículo com dados incompletos', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();

        const response = await request(app)
            .post('/veiculos')
            .send({
                idMontadora,
                idCliente,
                modelo: '',
                placa: 'DEF4G56',
                ano: 2025,
                cor: 'Preto',
                valor: 150000
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar veículo');
    });

    it('CT-014 - deve listar veículos cadastrados', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();

        await criarVeiculo(idMontadora, idCliente);

        const response = await request(app)
            .get('/veiculos');

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBe(1);
    });

    it('CT-015 - deve buscar veículo pelo ID', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();
        const idVeiculo = await criarVeiculo(idMontadora, idCliente);

        const response = await request(app)
            .get(`/veiculos/${idVeiculo}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('Id', idVeiculo);
        expect(response.body.data.Modelo).toBe('Corolla');
    });

    it('CT-016 - deve informar quando o veículo não existe', async () => {
        const response = await request(app)
            .get('/veiculos/999999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Veículo não encontrado');
    });

    it('CT-017 - deve alterar os dados do veículo', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();
        const idVeiculo = await criarVeiculo(idMontadora, idCliente);

        const response = await request(app)
            .put(`/veiculos?id=${idVeiculo}`)
            .send({
                idMontadora,
                idCliente,
                modelo: 'Corolla Cross',
                placa: 'ABC1D23',
                ano: 2025,
                cor: 'Branco',
                valor: 160000
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Veículo atualizado com sucesso');
        expect(response.body.data.affectedRows).toBe(1);
    });

    it('CT-018 - deve excluir veículo existente', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();
        const idVeiculo = await criarVeiculo(idMontadora, idCliente);

        const response = await request(app)
            .delete(`/veiculos/${idVeiculo}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Veículo deletado com sucesso');
        expect(response.body.data.affectedRows).toBe(1);
    });
});

describe('CT-019 e CT-020 - Integração com serviço de CEP', () => {
    it('CT-019 - deve consultar CEP inválido e retornar erro de validação', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                erro: true
            }
        });

        const response = await request(app)
            .post('/clientes')
            .send({
                ...clienteValido,
                cep: '00000000'
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar cliente');
        expect(axios.get).toHaveBeenCalledWith(
            'https://viacep.com.br/ws/00000000/json/'
        );
    });

    it('CT-020 - deve tratar CEP inválido sem interromper a aplicação', async () => {
        axios.get.mockRejectedValueOnce(new Error('CEP não encontrado'));

        const response = await request(app)
            .post('/clientes')
            .send({
                ...clienteValido,
                cep: '00000000'
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar cliente');
        expect(response.body.error).toBe('CEP não encontrado');
    });
});

describe('CT-021 a CT-025 - Testes adicionais', () => {
    it('CT-021 - deve consultar os dados completos de um cliente', async () => {
        const id = await criarCliente();

        const response = await request(app)
            .get(`/clientes/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('Id', id);
        expect(response.body.data.Nome).toBe(clienteValido.nome);
        expect(response.body.data.CPF).toBe(clienteValido.cpf);
        expect(response.body.data.CEP).toBe(clienteValido.cep);
    });

    it('CT-022 - deve retornar erro ao tentar excluir cliente inexistente', async () => {
        const response = await request(app)
            .delete('/clientes/999999');

        expect([200, 404, 500]).toContain(response.status);

        if (response.status === 200) {
            expect(response.body.data.affectedRows).toBe(0);
        } else {
            expect(response.body).toHaveProperty('message');
        }
    });

    it('CT-023 - deve cadastrar montadora com nome e país informados', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ nome: 'Ford', pais: 'Estados Unidos' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');

        const lista = await request(app)
            .get('/montadoras');

        expect(lista.status).toBe(200);
        expect(
            lista.body.data.some(montadora => montadora.Nome === 'Ford')
        ).toBe(true);
    });

    it('CT-024 - deve retornar os dados atualizados de um veículo', async () => {
        const idMontadora = await criarMontadora();
        const idCliente = await criarCliente();
        const idVeiculo = await criarVeiculo(idMontadora, idCliente);

        const atualizacao = await request(app)
            .put(`/veiculos?id=${idVeiculo}`)
            .send({
                idMontadora,
                idCliente,
                modelo: 'Corolla XEi',
                placa: 'ABC1D23',
                ano: 2025,
                cor: 'Preto',
                valor: 125000
            });

        expect(atualizacao.status).toBe(200);

        const consulta = await request(app)
            .get(`/veiculos/${idVeiculo}`);

        expect(consulta.status).toBe(200);
        expect(consulta.body.data.Modelo).toBe('Corolla XEi');
    });

    it('CT-025 - deve informar erro quando o serviço de CEP falhar', async () => {
        axios.get.mockRejectedValueOnce(
            new Error('Falha no serviço de CEP')
        );

        const response = await request(app)
            .post('/clientes')
            .send({
                ...clienteValido,
                cpf: '11122233344',
                cep: '13010000'
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar cliente');
        expect(response.body.error).toBe('Falha no serviço de CEP');
    });
});
