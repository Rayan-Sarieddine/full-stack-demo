import React, { useState } from "react";
import "./style.css";
import Footer from "../../components/common/Footer";
import Nav from "../../components/common/Nav";
import { todoDataSource } from "../../../core/dataSource/remoteDataSource/todo";
import CheckMark from "../../components/common/CheckMark";
import { useNavigate } from "react-router-dom";

type PriorityLevel = "TOP" | "MEDIUM" | "LOW";

function AddTodo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("MEDIUM");
  const [completed, setCompleted] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let data = {
      title,
      description,
      date: new Date(date),
      priorityLevel,
      completed,
      pinned,
    };

    try {
      await todoDataSource.create(data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-todo">
      <Nav />

      {!success ? (
        <>
          <form className="add-todo_main" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="priorityLevel">Priority Level</label>
              <select
                id="priorityLevel"
                value={priorityLevel}
                onChange={(e) =>
                  setPriorityLevel(e.target.value as PriorityLevel)
                }
              >
                <option value="TOP">Top</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="add-todo_checkboxes">
              <div className="add-todo_checkbox">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <label className="checkbox-label">Completed</label>
              </div>
              <div className="add-todo_checkbox">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
                <label className="checkbox-label">Pinned</label>
              </div>
            </div>
            <button type="submit" className="btn">
              Add Todo
            </button>
          </form>
          <Footer />
        </>
      ) : (
        <CheckMark message="TODO Added" />
      )}
    </div>
  );
}

export default AddTodo;
