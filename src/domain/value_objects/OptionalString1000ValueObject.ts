import { z } from 'zod';

/**
 * Zodスキーマ定義
 * - 1000文字以下の文字列、またはnull/undefinedであることを保証します。
 */
export const OptionalString1000Schema = z
  .string()
  .max(1000, { message: '1000文字以内で入力してください。' })
  .nullish(); // nullとundefinedを許容

/**
 * 1000文字制限のオプショナルな文字列を表す値オブジェクト
 *
 * @class OptionalString1000ValueObject
 */
export class OptionalString1000ValueObject {
  /**
   * 実際の文字列の値 (nullやundefinedの可能性あり)
   * @private
   * @readonly
   */
  public readonly value: string | null | undefined;

  /**
   * privateなコンストラクタ。
   * @param {string | null | undefined} value
   */
  private constructor(value: string | null | undefined) {
    this.value = value;
  }

  /**
   * インスタンスを生成するためのファクトリメソッド。
   *
   * @static
   * @param {string | null | undefined} value - 検証する文字列
   * @returns {OptionalString1000ValueObject}
   * @throws {Error} バリデーションに失敗した場合
   */
  public static create(value: string | null | undefined): OptionalString1000ValueObject {
    const parsed = OptionalString1000Schema.safeParse(value);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((issue) => issue.message).join('\n'));
    }
    return new OptionalString1000ValueObject(parsed.data);
  }

  /**
   * 値が等しいかどうかを判定します。
   * @param {OptionalString1000ValueObject} other - 比較対象
   * @returns {boolean}
   */
  public equals(other: OptionalString1000ValueObject): boolean {
    return this.value === other.value;
  }
}
