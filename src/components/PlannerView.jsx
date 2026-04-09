// components/PlannerView.jsx
import React, { useState } from "react";
import { usePlanner, getISOWeek } from "../usePlanner";
import { projectColor } from "../utils/projectColor";


const PRIORITY_COLORS = {
  Haute:  "#E24B4A",
  Normal: "#a8a29e",
  Basse:  "#1D9E75",
};

export default function PlannerView({ projects = [] }) {
  const {
    loading,
    byProject,
    milestonesThisWeek,
    longTasksThisWeek,
    ganttProjects,
    ganttMilestones,
    monthStart,
    monthEnd,
    weekStart,
  } = usePlanner();

  const weekNum    = getISOWeek(weekStart);
  const monthDays  = Math.round((monthEnd - monthStart) / 86400000) + 1;
  const monthLabel = monthStart.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  function dayOffset(ts) {
    if (!ts) return 0;
    const d = typeof ts === "number" ? new Date(ts) : ts?.toDate?.() || new Date(ts);
    return Math.max(0, Math.min(100, ((d - monthStart) / 86400000 / monthDays) * 100));
  }

  if (loading) return <p className="p-6 text-sm text-stone-400">Chargement…</p>;

  const hasWeekContent = milestonesThisWeek.length > 0 || longTasksThisWeek.length > 0 || Object.keys(byProject).length > 0;

  return (
    <div className="p-5 flex flex-col gap-6 h-full">

      {/* ── EN-TÊTE ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide">
          Planner
        </h2>
        <span className="text-xs text-stone-400">
          Semaine {weekNum} · {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* ── SEMAINE EN COURS ── */}
      <section>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Cette semaine</p>

        {!hasWeekContent && (
          <p className="text-sm text-stone-400">Rien de planifié cette semaine 🎉</p>
        )}

        {/* Jalons de la semaine */}
        {milestonesThisWeek.map((t) => {
          const c = projectColor(t.project);
          const d = new Date(t.dueDate);
          return (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl border mb-2"
              style={{ background: c.bg, borderColor: c.bar + "40" }}>
              <span style={{ color: c.bar }} className="text-sm">◆</span>
              <span className="text-sm font-medium flex-1" style={{ color: c.text }}>{t.title}</span>
              {t.project && <span className="text-xs" style={{ color: c.bar }}>{t.project}</span>}
              <span className="text-xs text-stone-400">
                {d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>
          );
        })}

        {/* Tâches longues en cours cette semaine */}
        {longTasksThisWeek.map((t) => {
          const c    = projectColor(t.project);
          const pct  = t.progress || 0;
          const start = new Date(t.startDate);
          const end   = new Date(t.dueDate);
          return (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl border mb-2 bg-white"
              style={{ borderColor: c.bar + "40" }}>
              <div className="w-2 h-2 rounded-sm rotate-45 shrink-0" style={{ background: c.bar }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-stone-700 truncate">{t.title}</span>
                  {t.project && <span className="text-xs shrink-0" style={{ color: c.bar }}>{t.project}</span>}
                </div>
                {/* Mini barre progression */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded bg-stone-100">
                    <div className="h-full rounded transition-all" style={{ width: `${pct}%`, background: c.bar }} />
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{pct}%</span>
                </div>
              </div>
              <span className="text-xs text-stone-300 shrink-0 whitespace-nowrap">
                {start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} →{" "}
                {end.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            </div>
          );
        })}

        {/* Tâches ponctuelles par projet (sans dates) */}
        {Object.entries(byProject).map(([project, tasks]) => {
          const c = projectColor(project);
          return (
            <div key={project} className="rounded-xl border overflow-hidden mb-2"
              style={{ borderColor: c.bar + "40" }}>
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: c.bg }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.bar }} />
                <span className="text-sm font-medium" style={{ color: c.text }}>{project}</span>
                <span className="ml-auto text-xs" style={{ color: c.bar }}>
                  {tasks.length} active{tasks.length > 1 ? "s" : ""}
                </span>
              </div>
              {tasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-3 py-1.5 pl-7 border-t bg-white"
                  style={{ borderColor: "#f5f5f4" }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: PRIORITY_COLORS[t.priority] || "#ccc" }} />
                  <span className="text-sm text-stone-700 flex-1 truncate">{t.title}</span>
                  {t.priority && t.priority !== "Normal" && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: PRIORITY_COLORS[t.priority], background: PRIORITY_COLORS[t.priority] + "15" }}>
                      {t.priority}
                    </span>
                  )}
                </div>
              ))}
              {tasks.length > 4 && (
                <div className="px-7 py-1 text-xs text-stone-400 bg-white border-t" style={{ borderColor: "#f5f5f4" }}>
                  +{tasks.length - 4} autres
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── MINI GANTT MENSUEL ── */}
      <section>
        <p className="text-xs font-medium text-stone-800 uppercase tracking-wide mb-2">
          {monthLabel}
        </p>

        {/* Repères jours */}
        <div className="relative h-4 mb-1 ml-28">
          {[1, 8, 15, 22, 29].map((day) => {
            const pct = ((day - 1) / monthDays) * 100;
            if (pct > 100) return null;
            return (
              <span key={day} className="absolute text-xs text-stone-800 -translate-x-1/2"
                style={{ left: `${pct}%` }}>{day}</span>
            );
          })}
        </div>

        {/* Barres projet (tâches longues) */}
        <div className="flex flex-col gap-2">
          {ganttProjects.map(({ name, tasks }) => {
            const c = projectColor(name);
            return (
              <div key={name}>
                {tasks.map((t) => {
                  const start = dayOffset(t.startDate);
                  const end   = dayOffset(t.dueDate);
                  const width = Math.max(end - start, 3);
                  const pct   = t.progress || 0;
                  return (
                    <div key={t.id} className="flex items-center gap-3 h-7 mb-1">
                      <span className="w-28 text-xs truncate shrink-0 text-stone-500">{t.title}</span>
                      <div className="flex-1 relative h-5 rounded bg-stone-100">
                        {/* Fond barre */}
                        <div className="absolute h-full rounded" style={{ left: `${start}%`, width: `${width}%`, background: c.bar, opacity: 0.2 }} />
                        {/* Progression */}
                        <div className="absolute h-full rounded transition-all" style={{ left: `${start}%`, width: `${width * pct / 100}%`, background: c.bar, opacity: 0.85 }} />
                        {/* % label */}
                        <span className="absolute inset-0 flex items-center justify-center text-xs"
                          style={{ color: pct > 50 ? "white" : c.text }}>{pct}%</span>
                        {/* Trait aujourd'hui */}
                        <div className="absolute top-0 bottom-0 w-px z-10"
                          style={{ left: `${dayOffset(Date.now())}%`, width: "2px", fontWeight: "bold", background: "#E24B4A" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Jalons sur le Gantt */}
          {ganttMilestones.length > 0 && (
            <div className="flex items-center gap-3 h-6 mt-1">
              <span className="w-28 text-xs text-stone-400 shrink-0">Jalons</span>
              <div className="flex-1 relative h-5">
                <div className="absolute top-0 bottom-0 w-px" style={{ left: `${dayOffset(Date.now())}%`, width: "2px", fontWeight: "bold", background: "#E24B4A" }} />
                {ganttMilestones.map((m) => {
                  const c   = projectColor(m.project);
                  const pct = dayOffset(m.dueDate);
                  return (
                    <div key={m.id} title={`${m.title}${m.project ? ` — ${m.project}` : ""}`}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 w-3 h-3 rounded-sm z-10 cursor-default"
                      style={{ left: `${pct}%`, background: c.bar }} />
                  );
                })}
              </div>
            </div>
          )}

          {ganttProjects.length === 0 && ganttMilestones.length === 0 && (
            <p className="text-sm text-stone-400">
              Aucune tâche avec dates de début/fin.{" "}
              <span className="text-stone-300">Édite une tâche pour lui en ajouter.</span>
            </p>
          )}
        </div>

        <div className="flex gap-4 mt-3 text-xs text-stone-800">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm rotate-45 bg-stone-400" />Jalon
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1 h-3 bg-red-800" />Aujourd'hui
          </span>
        </div>
      </section>
    </div>
  );
}