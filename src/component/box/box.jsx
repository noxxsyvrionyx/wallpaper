import React, { useState, useEffect } from "react";
import "./Box.css";

const defaultHabits = [
  { id: 1, name: "Morning Run", doneDates: [], nonRemovable: false },
  { id: 2, name: "Drink Water", doneDates: [], nonRemovable: false },
  { id: 3, name: "Read Book", doneDates: [], nonRemovable: false },
];

const Box = () => {
  // Load habits from localStorage or use default
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : defaultHabits;
  });

  const [newHabit, setNewHabit] = useState("");
  const [isNonNeg, setIsNonNeg] = useState(false);
  const [timeline, setTimeline] = useState("week");

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const getTimelineLabels = () => {
    const today = new Date();
    if (timeline === "week") {
      const labels = [];
      const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        labels.push(dayNames[d.getDay()]);
      }
      return labels;
    }
    if (timeline === "month") {
      const labels = [];
      const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) labels.push(i);
      return labels;
    }
    if (timeline === "year") {
      return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    }
  };

  const toggleHabitDone = (habitId) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const doneDates = h.doneDates.includes(todayStr)
            ? h.doneDates.filter(d => d !== todayStr)
            : [...h.doneDates, todayStr];
          return { ...h, doneDates };
        }
        return h;
      })
    );
  };

  const toggleNonNeg = (habitId) => {
    setHabits(prev =>
      prev.map(h => h.id === habitId ? { ...h, nonRemovable: !h.nonRemovable } : h)
    );
  };

  const removeHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(prev => [
      ...prev,
      { id: Date.now(), name: newHabit, doneDates: [], nonRemovable: isNonNeg }
    ]);
    setNewHabit("");
    setIsNonNeg(false);
  };

  const labels = getTimelineLabels();

  return (
    <div className="box-container">
      {/* Habit Box */}
      <div className="habit-box">
        <h2>Habits</h2>
        <ul>
          {habits.map(habit => (
            <li key={habit.id} className={habit.doneDates.includes(new Date().toISOString().split("T")[0]) ? "done" : ""}>
              <span onClick={() => toggleHabitDone(habit.id)}>{habit.name}</span>

              <button className="remove-btn" onClick={() => removeHabit(habit.id)}>✕</button>

              <span className="non-neg" onClick={() => toggleNonNeg(habit.id)}>
                {habit.nonRemovable ? "★" : "☆"}
              </span>
            </li>
          ))}
        </ul>

        <div className="add-habit">
          <input
            type="text"
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            placeholder="New habit..."
          />
          <label>
            <input
              type="checkbox"
              checked={isNonNeg}
              onChange={e => setIsNonNeg(e.target.checked)}
            /> Non-negotiable
          </label>
          <button onClick={addHabit}>Add</button>
        </div>
      </div>

      {/* Chart Box */}
      <div className="chart-box">
        <h2>Timeline</h2>
        <div className="timeline-selector">
          <button className={timeline==="week"?"active":""} onClick={()=>setTimeline("week")}>Week</button>
          <button className={timeline==="month"?"active":""} onClick={()=>setTimeline("month")}>Month</button>
          <button className={timeline==="year"?"active":""} onClick={()=>setTimeline("year")}>Year</button>
        </div>
        <div className="chart">
          {habits.map(habit => (
            <div key={habit.id} className="chart-row">
              <span className="habit-name">{habit.name}</span>
              {labels.map(label => {
                let dateStr = "";
                if (timeline === "week") {
                  const today = new Date();
                  const dayIndex = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(label);
                  const d = new Date();
                  d.setDate(today.getDate() - (6 - dayIndex));
                  dateStr = d.toISOString().split("T")[0];
                } else if (timeline === "month") {
                  const d = new Date();
                  d.setDate(label);
                  dateStr = d.toISOString().split("T")[0];
                } else if (timeline === "year") {
                  const d = new Date();
                  d.setMonth(labels.indexOf(label));
                  d.setDate(1);
                  dateStr = d.toISOString().split("T")[0];
                }
                const done = habit.doneDates.includes(dateStr);
                return <span key={label} className={`chart-cell ${done?"done":""}`}></span>
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Box;
