import React, { useState } from "react";
import "./style.css";
import { ReactComponent as EditIcon } from "../../../../assets/icons/pencil.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/trash.svg";
import { ReactComponent as PinIcon } from "../../../../assets/icons/push-pin.svg";
import { ReactComponent as CompleteIcon } from "../../../../assets/icons/check.svg";
import { PriorityLevel } from "../../../../core/dataSource/remoteDataSource/todo";

export type Todo = {
  title: string;
  description?: string;
  date: Date;
  priorityLevel: PriorityLevel;
  completed: boolean;
  pinned: boolean;
};

function TodoComponent({
  title,
  description,
  priorityLevel,
  date,
  completed,
  pinned,
}: Todo) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPinned, setIsPinned] = useState(pinned);
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsEditing(false);
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="todo">
      <div className="todo-top">
        {isEditing && (
          <>
            <button className="todo-top_save" onClick={handleSave}>
              Save
            </button>
            <button className="todo-top_delete" onClick={handleDelete}>
              <DeleteIcon />
            </button>
            <button
              className={`todo-top_pin ${isPinned ? "pinned" : ""}`}
              onClick={handlePin}
            >
              <PinIcon />
            </button>
            <button
              className={`todo-top_complete ${isCompleted ? "completed" : ""}`}
              onClick={handleComplete}
            >
              <CompleteIcon />
            </button>
          </>
        )}
        <button className="edit-button" onClick={handleEdit}>
          <EditIcon />
        </button>
      </div>
      <div className={`todo-main ${isCompleted ? "todo-completed" : ""}`}>
        <div className="rows">
          <div className="row1">
            {isEditing ? (
              <input type="text" defaultValue={title} />
            ) : (
              <div className="text-display-title">{title}</div>
            )}
          </div>
          <div className="row2">
            {isEditing ? (
              <textarea defaultValue={description} />
            ) : (
              <div className="text-display-description">{description}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoComponent;
