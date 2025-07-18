export interface Todo {
    id: string;
    title: string;
    body?: string | null;
    due_date?: Date | null;
    completed: boolean;
    created_at: Date | null;
}