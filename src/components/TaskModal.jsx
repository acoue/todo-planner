import { useState, useEffect, useRef } from "react";

export default function TaskModal({ task, priorities, projects, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    project: "",
    isMilestone: false,
    startDate: "",
    dueDate: "",
    progress: 0,
    ...task,
    // Convertit les timestamps Firestore en string date pour les inputs
    startDate: task?.startDate ? new Date(task.startDate).toISOString().slice(0, 10) : "",
    dueDate:   task?.dueDate   ? new Date(task.dueDate).toISOString().slice(0, 10)   : "",
    progress:  task?.progress  ?? 0,
  });

  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setCheck = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }));

  // Si jalon → pas de startDate, dueDate obligatoire
  // Si tâche longue → startDate + dueDate
  const isLong = !form.isMilestone && form.startDate && form.dueDate;

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      startDate: form.startDate ? new Date(form.startDate).getTime() : null,
      dueDate:   form.dueDate   ? new Date(form.dueDate).getTime()   : null,
      progress:  Number(form.progress),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-700">
            {task?.id ? "Modifier la tâche" : "Nouvelle tâche"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={set("title")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Nom de la tâche"
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">
              Description <span className="text-stone-300 font-normal">(facultatif)</span>
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Détails supplémentaires…"
              rows={2}
              className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all placeholder:text-stone-300 resize-none"
            />
          </div>

          {/* Priorité + Projet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">
                <i className="ri-flag-2-line mr-1 text-stone-400" />Priorité
              </label>
              <select value={form.priority} onChange={set("priority")}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 bg-white focus:ring-2 focus:ring-stone-100 transition-all text-stone-600">
                <option value="">— Aucune —</option>
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">
                <i className="ri-folder-3-line mr-1 text-stone-400" />Projet
              </label>
              <select value={form.project} onChange={set("project")}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 bg-white focus:ring-2 focus:ring-stone-100 transition-all text-stone-600">
                <option value="">— Aucun —</option>
                {projects.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Séparateur planning */}
          <div className="border-t border-stone-100 pt-3">
            <p className="text-xs font-medium text-stone-400 mb-3 uppercase tracking-wide">Planning</p>

            {/* Toggle jalon */}
            <label className="flex items-center gap-3 cursor-pointer mb-3 select-none">
              <div className="relative">
                <input type="checkbox" className="sr-only peer"
                  checked={form.isMilestone} onChange={setCheck("isMilestone")} />
                <div className="w-9 h-5 rounded-full bg-stone-200 peer-checked:bg-stone-700 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-stone-600">
                Jalon <span className="text-stone-400 font-normal">◆ événement ponctuel</span>
              </span>
            </label>

            {form.isMilestone ? (
              /* Jalon : date unique */
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Date du jalon</label>
                <input type="date" value={form.dueDate} onChange={set("dueDate")}
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all" />
              </div>
            ) : (
              /* Tâche : dates + progression */
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">
                      <i className="ri-calendar-line mr-1 text-stone-400" />Début
                    </label>
                    <input type="date" value={form.startDate} onChange={set("startDate")}
                      className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">
                      <i className="ri-calendar-check-line mr-1 text-stone-400" />Fin
                    </label>
                    <input type="date" value={form.dueDate} onChange={set("dueDate")}
                      className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all" />
                  </div>
                </div>

                {/* Progression — visible seulement si tâche longue */}
                {isLong && (
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">
                      Avancement — <span className="text-stone-700 font-semibold">{form.progress}%</span>
                    </label>
                    <input type="range" min="0" max="100" step="5"
                      value={form.progress} onChange={set("progress")}
                      className="w-full accent-stone-700" />
                    <div className="flex justify-between text-xs text-stone-300 mt-0.5">
                      <span>0%</span><span>50%</span><span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-stone-100">
          <button onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={!form.title.trim()}
            className="text-xs px-4 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {task?.id ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}