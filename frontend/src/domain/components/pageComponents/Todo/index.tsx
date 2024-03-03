import React from "react";
import "./style.css";

export type PriorityLevel = "TOP" | "MEDIUM" | "AVERAGE";

export type Todo = {
  title: string;
  description?: string;
  date: Date;
  priorityLevel: PriorityLevel;
  completed: boolean;
  pinned: boolean;
};

function Todo({
  title,
  description,
  priorityLevel,
  date,
  completed,
  pinned,
}: Todo) {
  return (
    <div className="todo">
      <div className="todo-top">
        <button>save</button>
        <button>delete</button>
      </div>
      <div className="todo-main">
        <div className="rows">
          <div className="row1">
            <input type="text" placeholder={title} />
            <div className="row1-buttons">
              <button>edit</button>
            </div>
          </div>
          <div className="row2">
            <input type="text" placeholder={description} />
            <div className="row2-buttons">
              <button>pin</button>
              <button>complete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
