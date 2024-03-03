import React, { useEffect, useState } from "react";
import "./style.css";
import Nav from "../../components/common/Nav";
import Footer from "../../components/common/Footer";
import Stacks from "../../components/pageComponents/Stacks";
import { useDispatch, useSelector } from "react-redux";
import {
  TodoItem,
  todoDataSource,
} from "../../../core/dataSource/remoteDataSource/todo";
import { saveTodos } from "../../../core/dataSource/localDataSource/Todo";
import TodoComponent from "../../components/pageComponents/Todo";

function Home() {
  const dispatch = useDispatch();
  const [groupedTodos, setGroupedTodos] = useState({});

  const formatDate = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];

    return date === today ? "Today" : date === tomorrow ? "Tomorrow" : date;
  };

  const getTodos = async () => {
    const response = await todoDataSource.getTodos();
    dispatch(saveTodos(response));
    const groupedByDate: any = {};
    response.forEach((todo: TodoItem) => {
      const dateKey = todo.date.split("T")[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [todo];
      } else {
        groupedByDate[dateKey].push(todo);
      }
    });

    setGroupedTodos(groupedByDate);
  };
  useEffect(() => {
    getTodos();
  }, []);
  return (
    <div className="home">
      <Nav />
      <div className="todos">
        {Object.entries(groupedTodos).map(([date, todos]: any) => (
          <div className="todo-item" key={date}>
            <h2>{formatDate(date)}</h2>
            {todos.map((todo: any) => (
              <TodoComponent
                key={todo.id}
                id={todo.id}
                title={todo.title}
                description={todo.description}
                pinned={todo.pinned}
                completed={todo.completed}
                date={new Date(todo.date)}
                priorityLevel={todo.priorityLevel}
              />
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
