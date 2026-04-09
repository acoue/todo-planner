// src/usePlanner.js
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1);
  return d;
}

export function getWeekEnd(date = new Date()) {
  const d = getWeekStart(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function usePlanner() {
  const [todos, setTodos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setTodos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const now       = new Date();
  const weekStart = getWeekStart();
  const weekEnd   = getWeekEnd();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // ── Jalons (isMilestone: true) avec dueDate dans la semaine
  const milestonesThisWeek = todos.filter((t) => {
    if (!t.isMilestone || !t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= weekStart && d <= weekEnd;
  });

  // ── Tâches longues (startDate + dueDate, pas jalon) actives cette semaine
  const longTasksThisWeek = todos.filter((t) => {
    if (t.isMilestone || t.done) return false;
    if (!t.startDate || !t.dueDate) return false;
    const start = new Date(t.startDate);
    const end   = new Date(t.dueDate);
    return start <= weekEnd && end >= weekStart;
  });

  // ── Tâches ponctuelles actives (pas jalon, pas de dates, pas done) groupées par projet
  const byProject = todos
    .filter((t) => !t.done && !t.isMilestone && !t.startDate)
    .reduce((acc, t) => {
      const p = t.project || "Sans projet";
      if (!acc[p]) acc[p] = [];
      acc[p].push(t);
      return acc;
    }, {});

  // ── Gantt : tâches longues par projet pour le mois
  const ganttTasksRaw = todos.filter((t) => !t.isMilestone && t.startDate && t.dueDate);
  const ganttProjects = Object.entries(
    ganttTasksRaw.reduce((acc, t) => {
      const p = t.project || "Sans projet";
      if (!acc[p]) acc[p] = [];
      acc[p].push(t);
      return acc;
    }, {})
  ).map(([name, tasks]) => ({ name, tasks }));

  // ── Jalons sur le Gantt (tous, pas juste cette semaine)
  const ganttMilestones = todos.filter((t) => t.isMilestone && t.dueDate);

  return {
    loading,
    todos,
    byProject,
    milestonesThisWeek,
    longTasksThisWeek,
    ganttProjects,
    ganttMilestones,
    monthStart,
    monthEnd,
    weekStart,
    weekEnd,
  };
}