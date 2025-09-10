import { PrismaClient } from '@prisma/client';
import { ITodoRepository } from '../domain/repositories/ITodoRepository';
import { TodoEntity } from '../domain/entities/Todo';
import {
  TodoId,
  String50ValueObject,
  OptionalString1000ValueObject,
  TodoIdSchema, 
  TodoTemplateIdSchema, 
} from '../domain/value_objects';
import { NotFoundError} from '../interfaces/error';

const prisma = new PrismaClient();

// `ITodoRepository`インターフェースの具体的な実装クラス
export class TodoRepositoryImpl implements ITodoRepository {
  /**
   * TodoをDBに保存（新規 or 更新）
   */
  async save(todo: TodoEntity): Promise<void> {
    await prisma.todo.upsert({
      where: { id: todo.id },
      update: {
        todoTemplateId: todo.todoTemplateId ?? null,
        title: todo.title.value, 
        body: todo.body.value ?? null, 
        deadline: todo.deadline,
        completedAt: todo.completedAt,
        isCompleted: todo.isCompleted,
        updatedAt: new Date(),
      },
      create: {
        id: todo.id,
        todoTemplateId: todo.todoTemplateId ?? null,
        title: todo.title.value,
        body: todo.body.value ?? null,
        deadline: todo.deadline,
        completedAt: todo.completedAt,
        isCompleted: todo.isCompleted,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      },
    });
  }

  /**
   * IDでTodoを検索
   */
  async findById(id: TodoId): Promise<TodoEntity> {
    const record = await prisma.todo.findUnique({
      where: { id: id },
    });

    if (!record) {
      // ★ nullを返す代わりに、カスタムエラーをスロー
      throw new NotFoundError(`ID: ${id} のTodoが見つかりませんでした。`);
    }


    // データベースのレコードからドメインエンティティを再構築
    return TodoEntity.reconstruct({
      id: TodoIdSchema.parse(record.id), 
      todoTemplateId: record.todoTemplateId
        ? TodoTemplateIdSchema.parse(record.todoTemplateId) 
        : null,
      title: String50ValueObject.create(record.title),
      body: OptionalString1000ValueObject.create(record.body ?? null),
      deadline: record.deadline,
      completedAt: record.completedAt,
      isCompleted: record.isCompleted,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  /**
   * 全件取得
   */
  async findAll(): Promise<TodoEntity[]> {
    const records = await prisma.todo.findMany();
    return records.map((record) =>
      TodoEntity.reconstruct({
        // ★ 修正: `new` の代わりに `parse` を使用
        id: TodoIdSchema.parse(record.id),
        // ★ 修正: `new` の代わりに `parse` を使用
        todoTemplateId: record.todoTemplateId
          ? TodoTemplateIdSchema.parse(record.todoTemplateId)
          : null,
        title: String50ValueObject.create(record.title),
        body: OptionalString1000ValueObject.create(record.body ?? null),
        deadline: record.deadline,
        completedAt: record.completedAt,
        isCompleted: record.isCompleted,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }),
    );
  }

  /**
   * 削除
   */
  async delete(id: TodoId): Promise<void> {
    await prisma.todo.delete({
      where: { id: id },
    });
  }
}

