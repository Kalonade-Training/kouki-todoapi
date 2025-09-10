import { z } from 'zod';

/**
 * Zodスキーマ定義
 * - Todoが取りうる状態をenumで定義し、バリデーションを行います。
 */
export const TodoStatusValueSchema = z.enum([
  'NOT_COMPLETED',
  'COMPLETED',
  'OVERDUE',
]);

// ZodスキーマからTypeScriptの型を推論
export type TodoStatusValue = z.infer<typeof TodoStatusValueSchema>;

/**
 * Todoの状態を表す値オブジェクト
 *
 * @class TodoStatusValueObject
 */
export class TodoStatusValueObject {
  public readonly value: TodoStatusValue;

  private constructor(value: TodoStatusValue) {
    this.value = value;
  }

  /**
   * インスタンスを生成するためのファクトリメソッド。
   * @static
   * @param {TodoStatusValue} value
   * @returns {TodoStatusValueObject}
   */
  public static create(value: TodoStatusValue): TodoStatusValueObject {
    // enumで型が保証されているため、ここではバリデーションは不要
    return new TodoStatusValueObject(value);
  }

  /**
   * 画面表示用のラベルを取得します。
   * @readonly
   * @type {string}
   */
  get label(): string {
    switch (this.value) {
      case 'NOT_COMPLETED':
        return '未完了';
      case 'COMPLETED':
        return '完了';
      case 'OVERDUE':
        return '期限切れ';
      default:
        // 型システムにより、このパスには到達しないはず
        throw new Error('不明なステータスです。');
    }
  }

  /**
   * 画面表示用の色（Tailwind CSSの色など）を取得します。
   * @readonly
   * @type {string}
   */
  get color(): string {
    switch (this.value) {
      case 'NOT_COMPLETED':
        return 'blue'; // 例: text-blue-600
      case 'COMPLETED':
        return 'green'; // 例: text-green-600
      case 'OVERDUE':
        return 'red'; // 例: text-red-600
      default:
        return 'gray';
    }
  }

  /**
   * 値が等しいかどうかを判定します。
   * @param {TodoStatusValueObject} other
   * @returns {boolean}
   */
  public equals(other: TodoStatusValueObject): boolean {
    return this.value === other.value;
  }
}

