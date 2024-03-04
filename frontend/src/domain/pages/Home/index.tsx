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
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };
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

    const priorityMapping = {
      TOP: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    Object.keys(groupedByDate).forEach((date) => {
      groupedByDate[date].sort((a: TodoItem, b: TodoItem) => {
        return (
          priorityMapping[a.priorityLevel] - priorityMapping[b.priorityLevel]
        );
      });
    });

    const sortedGroupedTodos = Object.keys(groupedByDate)
      .sort()
      .reduce((acc: any, date) => {
        acc[date] = groupedByDate[date];
        return acc;
      }, {});

    setGroupedTodos(sortedGroupedTodos);
  };

  useEffect(() => {
    getTodos();
  }, [refreshTrigger]);
  return (
    <div className="home">
      <Nav />
      <div className="todo-section">
        <div className="todos-filters">
          <div className="todo-filter-search"></div>
          <div className="todo-filter-select"></div>
        </div>
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
                  onOperationSuccess={triggerRefresh}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
