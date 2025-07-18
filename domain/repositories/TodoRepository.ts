import { Todo } from '../entities/Todo';

export interface TodoRepository {
    findAll(query: any): Promise<Todo[]>;
    findById(id: string): Promise<Todo | null>;
    create(todo: Omit<Todo, 'id' | 'created_at'>): Promise<void>;
    update(id: string, todo: Partial<Todo>): Promise<void>;
    delete(id: string): Promise<void>;
    duplicate(id: string): Promise<void>;
}