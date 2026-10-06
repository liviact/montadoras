import { Router } from 'express';
import montadoraController from '../controllers/montadoraController.js';

const montadoraRoutes = Router();

montadoraRoutes.post('/', montadoraController.criar);
montadoraRoutes.put('/', montadoraController.atualizar);
montadoraRoutes.delete('/:id', montadoraController.deletar);
montadoraRoutes.get('/', montadoraController.selecionar);

export default montadoraRoutes;