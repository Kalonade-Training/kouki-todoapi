/**
 * リソースが見つからなかった場合にスローされる、アプリケーション固有のエラー。
 * これにより、アプリケーションサービスはHTTPステータスコードを知ることなく、
 * 「見つからなかった」という事象を表現できます。
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
