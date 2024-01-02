import express, { Application } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { v4 as uuid } from 'uuid';
import pug from 'pug';
import { Todo } from './types/todo.interface';

const app: Application = express();
const todos: Todo[] = [];

const getFilteredTodos = (status: unknown) => {
  console.log(status);
  if (status === 'all') return todos;
  else if (status === 'active')
    return todos.filter((todo) => !todo.isCompleted);
  else return todos.filter((todo) => todo.isCompleted);
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index', {
    todos: getFilteredTodos(req.query.filter),
    filter: req.query.filter,
  });
});

app.post('/todos', (req, res) => {
  const _newTodo: Todo = {
    id: uuid(),
    name: req.body.name,
    isCompleted: false,
  };
  todos.push(_newTodo);

  const todoItemMarkup = pug.compileFile(
    path.join(__dirname, 'views/includes/todo-item.pug')
  )({ todo: _newTodo });

  res.send(todoItemMarkup);
});
app.listen(3012, () => {
  console.log('HTMX Server Running on PORT:3012');
});
