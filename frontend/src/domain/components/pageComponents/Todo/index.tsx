import React, { useState } from "react";
import "./style.css";
import { ReactComponent as EditIcon } from "../../../../assets/icons/pencil.svg";
import { ReactComponent as DeleteIcon } from "../../../../assets/icons/trash.svg";
import { ReactComponent as PinIcon } from "../../../../assets/icons/push-pin.svg";
import { ReactComponent as CompleteIcon } from "../../../../assets/icons/check.svg";
import {
  PriorityLevel,
  todoDataSource,
} from "../../../../core/dataSource/remoteDataSource/todo";

export type Todo = {
  title: string;
  description?: string;
  date: Date;
  priorityLevel: PriorityLevel;
  completed: boolean;
  pinned: boolean;
  id: number;
  onOperationSuccess?: () => void;
};

function TodoComponent({
  title,
  description,
  priorityLevel,
  date,
  completed,
  pinned,
  id,
  onOperationSuccess,
}: Todo) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);
  const [newDescription, setNewDescription] = useState<string>(
    description || ""
  );
  const [newPriorityLevel, setNewPriorityLevel] =
    useState<PriorityLevel>(priorityLevel);
  const [isPinned, setIsPinned] = useState<boolean>(pinned);
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (
      newTitle === title &&
      newDescription === description &&
      newPriorityLevel === priorityLevel &&
      isPinned === pinned &&
      isCompleted === completed
    ) {
      return;
    }
    const data = {
      title: newTitle,
      description: newDescription,
      pinned: isPinned,
      completed: isCompleted,
      priorityLevel: newPriorityLevel,
    };
    try {
      await todoDataSource.update(data, id);
      if (typeof onOperationSuccess === "function") {
        onOperationSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await todoDataSource.delete(id);
      if (typeof onOperationSuccess === "function") {
        onOperationSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
  };
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewDescription(event.target.value);
  };

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewPriorityLevel(event.target.value as PriorityLevel);
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
              <>
                <input
                  type="text"
                  value={newTitle}
                  onChange={handleTitleChange}
                />
                <select
                  id="priority-level"
                  onChange={handlePriorityChange}
                  value={newPriorityLevel}
                >
                  <option value="TOP">Top</option>
                  <option value="MEDIUM" selected>
                    Medium
                  </option>
                  <option value="LOW">Low</option>
                </select>
              </>
            ) : (
              <>
                <div className="text-display-title">{title}</div>
                <div className="text-display-priority">{priorityLevel}</div>
              </>
            )}
          </div>
          <div className="row2">
            {isEditing ? (
              <textarea
                value={newDescription}
                onChange={handleDescriptionChange}
              />
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
