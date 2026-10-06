import { Router } from 'express';
import clienteController from '../controllers/clienteController.js';

const clienteRoutes = Router();

clienteRoutes.post('/', clienteController.criar);
clienteRoutes.put('/', clienteController.atualizar);
clienteRoutes.delete('/:id', clienteController.deletar);
clienteRoutes.get('/:id', clienteController.selecionarPorId);
clienteRoutes.get('/', clienteController.selecionar);

export default clienteRoutes;