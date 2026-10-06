import { Router } from "express";
import clienteRoutes from "./clienteRoutes.js";
import montadoraRoutes from "./montadoraRoutes.js";
import veiculoRoutes from "./veiculoRoutes.js";

const routes = Router();

routes.use("/montadoras", montadoraRoutes);
routes.use("/clientes", clienteRoutes);
routes.use("/veiculos", veiculoRoutes);

export default routes;