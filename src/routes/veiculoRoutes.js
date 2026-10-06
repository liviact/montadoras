import { Router } from 'express';
import veiculoController from '../controllers/veiculoController.js';

const veiculoRoutes = Router();

veiculoRoutes.post('/', veiculoController.criar);
veiculoRoutes.put('/', veiculoController.atualizar);
veiculoRoutes.delete('/:id', veiculoController.deletar);
veiculoRoutes.get('/:id', veiculoController.selecionarPorId);
veiculoRoutes.get('/', veiculoController.selecionar);

export default veiculoRoutes;