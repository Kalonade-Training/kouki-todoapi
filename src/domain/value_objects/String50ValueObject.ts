import { z } from 'zod';

/**
 * Zodスキーマ定義
 * - 50文字以下の文字列であることを保証します。
 */
export const String50Schema = z.string().max(50, { message: '50文字以内で入力してください。' });

/**
 * 50文字制限の文字列を表す値オブジェクト
 *
 * @class String50ValueObject
 */
export class String50ValueObject {
  /**
   * 実際の文字列の値
   * @private
   * @readonly
   */
  public readonly value: string;

  /**
   * privateなコンストラクタ。
   * インスタンスの生成は必ず `create` ファクトリメソッド経由で行います。
   * @param {string} value - 50文字以下の文字列
   */
  private constructor(value: string) {
    this.value = value;
  }

  /**
   * インスタンスを生成するためのファクトリメソッド。
   * Zodスキーマによるバリデーションを行い、成功した場合のみインスタンスを返します。
   *
   * @static
   * @param {string} value - 検証する文字列
   * @returns {String50ValueObject}
   * @throws {Error} バリデーションに失敗した場合
   */
  public static create(value: string): String50ValueObject {
    const parsed = String50Schema.safeParse(value);
    if (!parsed.success) {
      // エラーメッセージを連結してスローする
      throw new Error(parsed.error.issues.map((issue) => issue.message).join('\n'));
    }
    return new String50ValueObject(parsed.data);
  }

  /**
   * 値が等しいかどうかを判定します。
   * @param {String50ValueObject} other - 比較対象の値オブジェクト
   * @returns {boolean}
   */
  public equals(other: String50ValueObject): boolean {
    return this.value === other.value;
  }
}
