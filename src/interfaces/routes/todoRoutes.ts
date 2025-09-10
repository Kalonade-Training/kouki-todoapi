// src/interface/routes/todo.routes.ts
import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { TodoApplicationService } from '../../usecases/TodoUsecase';
import { TodoRepositoryImpl } from '../../infrastructure/TodoRepositoryPrisma';

const router = Router();
const todoAppService = new TodoApplicationService(new TodoRepositoryImpl());
const controller = new TodoController(todoAppService);

router.post('/', (req, res) => controller.create(req, res));
router.put('/', (req, res) => controller.update(req, res));
router.put('/:id/complete', (req, res) => controller.complete(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.get('/', (req, res) => controller.listAll(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
router.post('/:id/duplicate', (req, res) => controller.duplicate(req, res));

export default router;
