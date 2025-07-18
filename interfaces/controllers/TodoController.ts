import { Request, Response } from 'express';
import { TodoUseCase } from '../../usecases/TodoUsecase';

export class TodoController {
    constructor(private todoUseCase: TodoUseCase) {}

    async list(req: Request, res: Response) {
        const todos = await this.todoUseCase.getTodos(req.query);
        //res.render('index', { todos, query: req.query });
    }
    async show(req: Request, res: Response) {
        const todo = await this.todoUseCase.getTodo(req.params.id);
        //res.render('show', { todo });
    }
    async create(req: Request, res: Response) {
        await this.todoUseCase.createTodo(req.body);
        //res.redirect('/todos');
    }
    async update(req: Request, res: Response) {
        await this.todoUseCase.updateTodo(req.params.id, req.body);
        //res.redirect('/todos');
    }
    async delete(req: Request, res: Response) {
        await this.todoUseCase.deleteTodo(req.params.id);
        //res.redirect('/todos');
    }
    async duplicate(req: Request, res: Response) {
        await this.todoUseCase.duplicateTodo(req.params.id);
        //res.redirect('/todos');
    }

}