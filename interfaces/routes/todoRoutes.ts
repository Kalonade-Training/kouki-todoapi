import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';

export function todoRoutes(controller: TodoController): Router {
    const router = Router();
    router.get('/', controller.list.bind(controller));
    router.post('/', controller.create.bind(controller));
    router.get('/:id', controller.show.bind(controller));
    router.patch('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.post('/:id/duplicate', controller.duplicate.bind(controller));
    return router;
}