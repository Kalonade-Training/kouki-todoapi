import express from 'express';
import methodOverride from 'method-override';
import path from 'path';
import { TodoRepositoryPrisma } from './infrastructure/TodoRepositoryPrisma';
import { TodoUseCase } from './usecases/TodoUsecase';
import { TodoController } from './interfaces/controllers/TodoController';
import { todoRoutes } from './interfaces/routes/todoRoutes';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

const todoRepo = new TodoRepositoryPrisma();
const todoUseCase = new TodoUseCase(todoRepo);
const todoController = new TodoController(todoUseCase);

app.use('/todos', todoRoutes(todoController));

app.listen(port, () => {
    console.log(`ToDoアプリがポート${port}で起動しました`);
});