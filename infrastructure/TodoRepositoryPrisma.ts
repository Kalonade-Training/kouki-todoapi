import { PrismaClient } from '@prisma/client';
import { TodoRepository } from '../domain/repositories/TodoRepository';
import { Todo } from '../domain/entities/Todo';

const prisma = new PrismaClient();

export class TodoRepositoryPrisma implements TodoRepository {
    async findAll(query: any): Promise<Todo[]> {
        // Prismaのwhere条件をここで組み立てる
        return prisma.todo.findMany({ where: query, orderBy: { created_at: 'desc' } });
    }
    async findById(id: string): Promise<Todo | null> {
        return prisma.todo.findUnique({ where: { id } });
    }
    async create(todo: Omit<Todo, 'id' | 'created_at'>): Promise<void> {
        await prisma.todo.create({ data: todo });
    }
    async update(id: string, todo: Partial<Todo>): Promise<void> {
        await prisma.todo.update({ where: { id }, data: todo });
    }
    async delete(id: string): Promise<void> {
        await prisma.todo.delete({ where: { id } });
    }
    async duplicate(id: string): Promise<void> {
        const original = await prisma.todo.findUnique({ where: { id } });
        if (original) {
            await prisma.todo.create({
                data: {
                    title: `${original.title}のコピー`,
                    body: original.body,
                    completed: false,
                    due_date: null,
                }
            });
        }
    }
}