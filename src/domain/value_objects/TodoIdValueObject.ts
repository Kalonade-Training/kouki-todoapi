import { z } from 'zod';

/**
 * Zodスキーマ定義
 * - 文字列であることを保証します。より厳密にするならz.string().uuid()なども使えます。
 */
export const TodoIdSchema = z.string();

// ZodスキーマからTypeScriptの型を推論
export type TodoId = z.infer<typeof TodoIdSchema>;

/**
 * Todoの一意なIDを生成します。
 * @returns {TodoId}
 */
export function createTodoId(): TodoId {
  // Web Crypto APIを使って安全なUUIDを生成
  return crypto.randomUUID();
}
