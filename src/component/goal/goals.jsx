import { useState } from "react";
import "./goals.css";

export default function Goals() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [goals, setGoals] = useState([
    { text: "Build a standout portfolio", done: false },
    { text: "Ship 3 real-world projects", done: false },
    { text: "Stay consistent with fitness", done: false },
  ]);

  const addGoal = () => {
    if (!input.trim()) return;
    setGoals([...goals, { text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleGoal = (i) => {
    setGoals(goals.map((g, idx) =>
      idx === i ? { ...g, done: !g.done } : g
    ));
  };

  const removeGoal = (i) => {
    setGoals(goals.filter((_, idx) => idx !== i));
  };

  return (
    <section className="goals-root">
      <button className="goals-toggle" onClick={() => setOpen(!open)}>
        <span className="goals-title">Achieve Before 2027</span>
        <span className="goals-arrow">{open ? "▲" : "▼"}</span>
      </button>

      <div className={`goals-panel ${open ? "open" : ""}`}>
        <ul className="goals-list">
          {goals.map((goal, i) => (
            <li key={i} className={goal.done ? "done" : ""}>
              <span className="goal-text" onClick={() => toggleGoal(i)}>
                {goal.text}
              </span>
              <button className="goal-remove" onClick={() => removeGoal(i)}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="goals-add">
          <input
            placeholder="Add a new goal…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
          />
          <button onClick={addGoal}>Add</button>
        </div>
      </div>
    </section>
  );
}
