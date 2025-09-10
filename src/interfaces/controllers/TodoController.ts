// src/interface/controllers/todo.controller.ts
import { Request, Response } from 'express';
import { TodoApplicationService } from '../../usecases/TodoUsecase';
import { NotFoundError } from '../error';

export class TodoController {
  constructor(private readonly todoAppService: TodoApplicationService) {}

  /**
   * Todo作成
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, body, deadline } = req.body;
      const id = await this.todoAppService.createTodo({
        title,
        body,
        deadline: deadline ? new Date(deadline) : null,
      });
      res.status(201).json({ id });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Todo更新
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id, title, body, deadline } = req.body;
      await this.todoAppService.updateTodo({
        id,
        title,
        body,
        deadline: deadline ? new Date(deadline) : null,
      });
      res.status(200).json({ message: 'Todo updated successfully' });
    } catch (err: any) {
      if(err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
      }else{
      res.status(400).json({ error: err.message });
    }
  }
}

  /**
   * Todo完了
   */
  async complete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.todoAppService.completeTodo(id);
      res.status(200).json({ message: 'Todo completed successfully' });
    } catch (err: any) {
      if(err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
      }else{
      res.status(404).json({ error: err.message });
    }
  }
}

  /**
   * Todo取得（単体）
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoAppService.findById(id);
      res.status(200).json(todo);
    } catch (err: any) {
      if(err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
      }else{
        res.status(400).json({ error: err.message });
      }
    }
  }

  /**
   * Todo一覧取得
   */
  async listAll(req: Request, res: Response): Promise<void> {
    try {
      const todos = await this.todoAppService.listAllTodos();
      res.status(200).json(todos);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Todo削除
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.todoAppService.deleteTodo(id);
      res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err: any) {
      if(err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
      }else{
      res.status(404).json({ error: err.message });
    }
  }
}

  /**
   * Todo複製
   */
  async duplicate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const newId = await this.todoAppService.duplicateTodo(id);
      res.status(201).json({ id: newId });
    } catch (err: any) {
      if(err instanceof NotFoundError){
        res.status(404).json({ error: err.message });
      }else{
      res.status(404).json({ error: err.message });
    }
  }
}
}
