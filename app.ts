import express, { Express } from 'express';
import  router  from './interfaces/routes/todoRoutes';

const app: Express = express();
const port = process.env.PORT || 3000;

// JSONリクエストボディを解析するためのミドルウェア
app.use(express.json());

// /api/todos というパスでTodoルーターをマウント
app.use('/api/todos', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
