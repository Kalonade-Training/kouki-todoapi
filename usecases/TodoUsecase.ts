import { TodoRepository } from '../domain/repositories/TodoRepository';
import { Todo } from '../domain/entities/Todo';

export class TodoUseCase {
    constructor(private todoRepo: TodoRepository) {}

    async getTodos(query: any): Promise<Todo[]> {
        return this.todoRepo.findAll(query);
    }
    async getTodo(id: string): Promise<Todo | null> {
        return this.todoRepo.findById(id);
    }
    async createTodo(data: Omit<Todo, 'id' | 'created_at'>): Promise<void> {
        await this.todoRepo.create(data);
    }
    async updateTodo(id: string, data: Partial<Todo>): Promise<void> {
        await this.todoRepo.update(id, data);
    }
    async deleteTodo(id: string): Promise<void> {
        await this.todoRepo.delete(id);
    }
    async duplicateTodo(id: string): Promise<void> {
        await this.todoRepo.duplicate(id);
    }
}