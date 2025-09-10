import { TodoEntity } from '../entities/Todo';
import { TodoId } from '../value_objects';

/**
 * Todoリポジトリのインターフェース（契約）
 *
 * このインターフェースは、ドメイン層に属し、
 * Todoエンティティの永続化に関する操作を定義します。
 * 実際の実装はインフラストラクチャ層が担当します。
 */
export interface ITodoRepository {
  /**
   * 指定されたIDのTodoエンティティを検索します。
   *
   * @param {TodoId} id - 検索するTodoのID
   * @returns {Promise<TodoEntity>} - 見つかったTodoエンティティ、またはnull
   */
  findById(id: TodoId): Promise<TodoEntity>;

  /**
   * すべてのTodoエンティティを検索します。
   *
   * @returns {Promise<TodoEntity[]>} - Todoエンティティの配列
   */
  findAll(): Promise<TodoEntity[]>;

  /**
   * 新規作成または既存のTodoエンティティを保存（更新）します。
   *
   * @param {TodoEntity} todo - 保存するTodoエンティティ
   * @returns {Promise<void>}
   */
  save(todo: TodoEntity): Promise<void>;

  /**
   * 指定されたIDのTodoエンティティを削除します。
   *
   * @param {TodoId} id - 削除するTodoのID
   * @returns {Promise<void>}
   */
  delete(id: TodoId): Promise<void>;
}
