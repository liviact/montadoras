import { Cliente } from "../models/Cliente.js";
import clienteRepository from "../repositories/clienteRepository.js";
import { consultarCep } from "../utils/consultarCep.js";
import { limparNumero } from "../utils/limparNumero.js";

const clienteController = {
    criar: async (req, res) => {
        try {
            const { nome, cpf, cep, numero, complemento } = req.body;
            const dadosCep = await consultarCep(cep);
            const cliente = Cliente.criar({
                nome,
                cpf: limparNumero(cpf),
                cep: dadosCep.cep,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                numero,
                complemento
            });
            const resultado = await clienteRepository.criar(cliente);
            res.status(201).json({
                message: 'Cliente criado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao criar cliente',
                error: error.message
            });
        }
    },
    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { nome, cpf, cep, numero, complemento } = req.body;
            const dadosCep = await consultarCep(cep);
            const cliente = Cliente.editar({
                nome,
                cpf: limparNumero(cpf),
                cep: dadosCep.cep,
                logradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                numero,
                complemento
            }, id);
            const resultado = await clienteRepository.editar(cliente);
            res.status(200).json({
                message: 'Cliente atualizado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao atualizar cliente',
                error: error.message
            });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await clienteRepository.deletar(id);
            res.status(200).json({
                message: 'Cliente deletado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao deletar cliente',
                error: error.message
            });
        }
    },
    selecionarPorId: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await clienteRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({
                    message: 'Cliente não encontrado',
                    data: {}
                });
            }

            res.status(200).json({
                message: 'Cliente selecionado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao selecionar cliente',
                error: error.message
            });
        }
    },
    selecionar: async (req, res) => {
        try {
            const resultado = await clienteRepository.selecionar();
            res.status(200).json({
                message: 'Clientes selecionados com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao selecionar clientes',
                error: error.message
            });
        }
    }
};

export default clienteController;