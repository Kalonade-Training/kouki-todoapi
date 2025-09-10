import { TodoEntity } from '../domain/entities/Todo';
import { ITodoRepository } from '../domain/repositories/ITodoRepository';
import {
  OptionalString1000ValueObject,
  String50ValueObject,
  TodoId,
  TodoIdSchema,
} from '../domain/value_objects';

// --- データ転送オブジェクト（DTO）---
// サービスが受け取るデータの型を定義します。
// これにより、UI層とドメイン層を疎結合に保ちます。

/**
 * Todo作成用の入力データ
 */
export type CreateTodoInputDTO = {
  title: string;
  body?: string | null;
  deadline?: Date | null;
};

/**
 * Todo更新用の入力データ
 */
export type UpdateTodoInputDTO = {
  id: string; // 更新対象のID
  title: string;
  body?: string | null;
  deadline?: Date | null;
};

/**
 * アプリケーションサービス
 *
 * UI層からのリクエストを受け取り、ドメインオブジェクト（エンティティや値オブジェクト）
 * とリポジトリを協調させてユースケースを実現します。
 */
export class TodoApplicationService {
  /**
   * コンストラクタでリポジトリのインターフェース（設計図）を受け取ります。
   * これを「依存性の注入（Dependency Injection）」と呼びます。
   * これにより、このサービスは具体的なデータベースの実装を知る必要がなくなります。
   * @param todoRepository - ITodoRepositoryインターフェースを実装したクラスのインスタンス
   */
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * 【ユースケース】新しいTodoを作成する
   * @param input - Todo作成用のデータ
   * @returns 作成されたTodoのID
   */
  async createTodo(input: CreateTodoInputDTO): Promise<TodoId> {
    const title = String50ValueObject.create(input.title);
    const body = OptionalString1000ValueObject.create(input.body ?? null);

    const todo = TodoEntity.create({
      title,
      body,
      deadline: input.deadline ?? null,
      todoTemplateId: null,
    });

    await this.todoRepository.save(todo);
    return todo.id;
  }

  /**
   * 【ユースケース】Todoを更新する
   * @param input - Todo更新用のデータ
   */
  async updateTodo(input: UpdateTodoInputDTO): Promise<void> {
    const todoId = TodoIdSchema.parse(input.id);
    const todo = await this.todoRepository.findById(todoId);
    const newTitle = String50ValueObject.create(input.title);
    const newBody = OptionalString1000ValueObject.create(input.body ?? null);

    todo.updateFormValues({
      title: newTitle,
      body: newBody,
      deadline: input.deadline ?? null,
    });

    await this.todoRepository.save(todo);
  }

  /**
   * 【ユースケース】Todoを完了にする
   * @param id - 完了にしたいTodoのID
   */
  async completeTodo(id: string): Promise<void> {
    const todoId = TodoIdSchema.parse(id);
    const todo = await this.todoRepository.findById(todoId);

    if (!todo) {
      throw new Error('指定されたTodoが見つかりませんでした。');
    }

    todo.complete();

    await this.todoRepository.save(todo);
  }

  /**
   * 【ユースケース】IDでTodoを検索する
   * @param id - 検索したいTodoのID
   * @returns 見つかったTodoエンティティ、またはnull
   */
  async findById(id: string): Promise<TodoEntity> {
    const todoId = TodoIdSchema.parse(id);
    return this.todoRepository.findById(todoId);
  }

  /**
   * 【ユースケース】すべてのTodoを取得する
   * @returns Todoエンティティの配列
   */
  async listAllTodos(): Promise<TodoEntity[]> {
    return this.todoRepository.findAll();
  }

  /**
   * 【ユースケース】Todoを削除する
   * @param id - 削除したいTodoのID
   */
  async deleteTodo(id: string): Promise<void> {
    const todoId = TodoIdSchema.parse(id);

    const existingTodo = await this.todoRepository.findById(todoId);
    await this.todoRepository.delete(todoId);
  }

  /**
   * 【ユースケース】Todoを複製する
   * @param id - 複製元のTodoのID
   * @returns 複製された新しいTodoのID
   */
  async duplicateTodo(id: string): Promise<TodoId> {
    const originalTodoId = TodoIdSchema.parse(id);
    const originalTodo = await this.todoRepository.findById(originalTodoId);

    if (!originalTodo) {
      throw new Error('複製元のTodoが見つかりませんでした。');
    }

    const duplicatedTodo = originalTodo.duplicate();

    await this.todoRepository.save(duplicatedTodo);

    return duplicatedTodo.id;
  }
}

