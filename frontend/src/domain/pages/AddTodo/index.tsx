import React, { useState } from "react";

// Assuming PriorityLevel is defined elsewhere and imported
// If not, define it as follows for the purpose of this example
type PriorityLevel = "TOP" | "MEDIUM" | "LOW";

function AddTodo() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>("MEDIUM");
  const [completed, setCompleted] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement the logic to add the todo here
    console.log({ title, description, date, priorityLevel, completed, pinned });
    // Reset form fields if necessary
  };

  return (
    <div className="add-todo">
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
            onChange={(e) => setPriorityLevel(e.target.value as PriorityLevel)}
          >
            <option value="TOP">Top</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            Pinned
          </label>
        </div>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default AddTodo;
