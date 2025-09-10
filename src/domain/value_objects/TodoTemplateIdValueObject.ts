import { z } from 'zod';

/**
 * Zodスキーマ定義
 * - TodoIdと同様に、文字列であることを保証します。
 * - 型エイリアスを使って、TodoIdとTodoTemplateIdが誤って代入されるのを防ぎます。
 */
export const TodoTemplateIdSchema = z.string();

// ZodスキーマからTypeScriptの型を推論
export type TodoTemplateId = z.infer<typeof TodoTemplateIdSchema>;

/**
 * Todoテンプレートの一意なIDを生成します。
 * TodoIdとロジックは同じですが、ドメインの概念として区別するために別の関数として定義します。
 * @returns {TodoTemplateId}
 */
export function createTodoTemplateId(): TodoTemplateId {
  return crypto.randomUUID();
}
