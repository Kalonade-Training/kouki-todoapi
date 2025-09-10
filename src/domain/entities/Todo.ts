import { format } from 'data-fns';
import { z } from 'zod';

import {
  OptionalString1000Schema,
  OptionalString1000ValueObject,
  String50Schema,
  String50ValueObject,
  TodoId,
  TodoIdSchema,
  TodoTemplateId,
  TodoTemplateIdSchema,
  createTodoId, // 新しいIDを生成するためにインポート
} from '../value_objects';
import {
  TodoStatusValue,
  TodoStatusValueObject,
} from '../value_objects/TodoStatusValueObject';
import { dateTimeFormatJa, yearMonthFormatDayJa } from '../../utils/helper';

const TodoEntitySchema = z.object({
  id: TodoIdSchema,
  todoTemplateId: TodoTemplateIdSchema.nullable(),
  title: String50Schema,
  body: OptionalString1000Schema,
  deadline: z.date().nullable(),
  completedAt: z.date().nullable(),
  // isOverdueは動的に計算するため、スキーマからは削除しても良い
  isCompleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type TodoEntityProps = z.infer<typeof TodoEntitySchema>;

export class TodoEntity {
  private readonly _id: TodoId;
  private readonly _todoTemplateId: TodoTemplateId | null;
  private _title: String50ValueObject;
  private _body: OptionalString1000ValueObject;
  private _deadline: Date | null;
  private _completedAt: Date | null;
  private _isCompleted: boolean; // readonlyを外して変更可能にする
  private readonly _createdAt: Date;
  private _updatedAt: Date; // readonlyを外して変更可能にする

  private constructor(props: TodoEntityProps) {
    this._id = props.id;
    this._todoTemplateId = props.todoTemplateId;
    this._title = props.title;
    this._body = props.body;
    this._deadline = props.deadline;
    this._completedAt = props.completedAt;
    this._isCompleted = props.isCompleted;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): TodoId {
    return this._id;
  }
  get todoTemplateId(): TodoTemplateId | null {
    return this._todoTemplateId;
  }
  get title(): String50ValueObject {
    return this._title;
  }
  get body(): OptionalString1000ValueObject {
    return this._body;
  }
  get deadline(): Date | null {
    return this._deadline;
  }
  get completedAt(): Date | null {
    return this._completedAt;
  }
  get isCompleted(): boolean {
    return this._isCompleted;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --- 派生データ（動的に計算されるプロパティ） ---

  get isOverdue(): boolean {
    // 未完了 かつ 期限が設定されていて、その期限が現在時刻より前か
    return !this._isCompleted && this._deadline != null && this._deadline < new Date();
  }

  get todoStatusValue(): TodoStatusValue {
    if (this.isCompleted) {
      return 'COMPLETED';
    } else if (this.isOverdue) {
      return 'OVERDUE';
    } else {
      return 'NOT_COMPLETED';
    }
  }

  todoStatusVO(): TodoStatusValueObject {
    return TodoStatusValueObject.create(this.todoStatusValue);
  }

  get todoStatusLabel(): string {
    return this.todoStatusVO().label;
  }

  get formatDeadlineDate(): string {
    return this._deadline ? format(this._deadline, yearMonthFormatDayJa) : '';
  }

  // --- 振る舞い（状態を変更するメソッド） ---

  /**
   * Todoを完了状態にします。
   * 冪等性（何度呼んでも同じ結果になること）を担保します。
   */
  public complete(): void {
    if (this._isCompleted) return; // すでに完了なら何もしない
    this._isCompleted = true;
    this._completedAt = new Date();
    this.touch(); // 更新日時を更新
  }

  /**
   * Todoを未完了状態に戻します。
   */
  public reopen(): void {
    if (!this._isCompleted) return; // すでに未完了なら何もしない
    this._isCompleted = false;
    this._completedAt = null;
    this.touch();
  }

  /**
   * フォームからの入力でエンティティを更新します。
   */
  public updateFormValues(
    props: Pick<TodoEntity, 'title' | 'body' | 'deadline'>,
  ): void {
    this._title = props.title;
    this._body = props.body;
    this._deadline = props.deadline;
    this.touch();
  }

  /**
   * 自分自身の複製を、新しいIDで作成します。
   * @returns 新しいTodoエンティティのインスタンス
   */
  public duplicate(): TodoEntity {
    return new TodoEntity({
      id: createTodoId(), // ★ 新しいIDを採番
      todoTemplateId: this._todoTemplateId,
      title: this._title,
      body: this._body,
      deadline: this._deadline,
      completedAt: null, // 複製時は未完了
      isCompleted: false, // 複製時は未完了
      createdAt: new Date(), // 作成日は今日
      updatedAt: new Date(), // 更新日も今日
    });
  }

  /**
   * 更新日時を現在時刻に更新します。
   */
  private touch(): void {
    this._updatedAt = new Date();
  }

  // --- ファクトリメソッド（エンティティを生成するためのメソッド） ---

  /**
   * データベースのレコードなどからエンティティを再構築します。
   */
  public static reconstruct(props: TodoEntityProps): TodoEntity {
    return new TodoEntity(props);
  }

  /**
   * 新しいTodoエンティティをメモリ上に作成します。
   */
  public static create(
    props: Omit<TodoEntityProps, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'isCompleted'>,
  ): TodoEntity {
    return new TodoEntity({
      id: createTodoId(),
      ...props,
      completedAt: null,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
