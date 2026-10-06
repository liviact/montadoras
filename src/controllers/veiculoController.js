import { Veiculo } from "../models/Veiculo.js";
import veiculoRepository from "../repositories/veiculoRepository.js";

const veiculoController = {
    criar: async (req, res) => {
        try {
            const { idMontadora, idCliente, modelo, placa, ano, cor, valor } = req.body;
            const veiculo = Veiculo.criar({ idMontadora, idCliente, modelo, placa, ano, cor, valor });
            const resultado = await veiculoRepository.criar(veiculo);
            res.status(201).json({
                message: "Veículo criado com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao criar veículo",
                error: error.message
            });
        }
    },
    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { idMontadora, idCliente, modelo, placa, ano, cor, valor } = req.body;
            const veiculo = Veiculo.editar({ idMontadora, idCliente, modelo, placa, ano, cor, valor }, id);
            const resultado = await veiculoRepository.editar(veiculo);
            res.status(200).json({
                message: "Veículo atualizado com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao atualizar veículo",
                error: error.message
            });
        }
    },
    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await veiculoRepository.deletar(id);
            res.status(200).json({
                message: "Veículo deletado com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao deletar veículo",
                error: error.message
            });
        }
    },
    selecionarPorId: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = await veiculoRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({
                    message: 'Veículo não encontrado',
                    data: {}
                });
            }

            res.status(200).json({
                message: 'Veículo selecionado com sucesso',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao selecionar veículo',
                error: error.message
            });
        }
    },
    selecionar: async (req, res) => {
        try {
            const resultado = await veiculoRepository.selecionar();
            res.status(200).json({
                message: "Veículos selecionados com sucesso",
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao selecionar veículos",
                error: error.message
            });
        }
    }
};

export default veiculoController;