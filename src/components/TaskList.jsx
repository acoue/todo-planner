export default function TaskList({ tasks, loading, onEdit, onDelete, onToggle, onNewTask }) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const todo = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 capitalize">{today}</h2>
            {!loading && (
              <p className="text-xs text-stone-400 mt-0.5">
                {todo.length} en cours · {done.length} terminée{done.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={onNewTask}
            className="w-8 h-8 flex items-center justify-center rounded-xs bg-stone-800 text-white hover:bg-stone-700 transition-colors"
            title="Nouvelle tâche"
          >
            <i className="ri-add-line"></i>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-300">
            <i className="ri-loader-4-line text-3xl mb-2 animate-spin"></i>
            <p className="text-xs">Chargement…</p>
          </div>
        )}

        {!loading && (
          <>
            {/* En cours */}
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  En cours
                </span>
                {todo.length > 0 && (
                  <span className="text-[10px] bg-stone-200 text-stone-500 rounded-xs px-1.5 py-0.5 font-medium">
                    {todo.length}
                  </span>
                )}
              </div>

              {todo.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-stone-300 border border-dashed border-stone-200 rounded-lg">
                  <i className="ri-checkbox-circle-line text-3xl mb-2"></i>
                  <p className="text-xs">Tout est fait !</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {todo.map((task) => (
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
                  ))}
                </ul>
              )}
            </section>

            {/* Terminées */}
            {done.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Terminées
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-400 rounded-xs px-1.5 py-0.5 font-medium">
                    {done.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {done.map((task) => (
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
                  ))}
                </ul>
              </section>
            )}

            {/* Empty state global */}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-stone-300">
                <i className="ri-inbox-2-line text-4xl mb-3"></i>
                <p className="text-sm">Commencez par créer une tâche</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <li className={`group border rounded-lg px-4 py-3 flex items-start gap-3 transition-colors ${
      task.done
        ? "bg-stone-50 border-stone-200"
        : "bg-white border-stone-200 hover:border-stone-300"
    }`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, task.done)}
        className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
          task.done
            ? "bg-stone-400 border-stone-400"
            : "border-stone-300 hover:border-stone-500"
        }`}
        title={task.done ? "Rouvrir" : "Terminer"}
      >
        {task.done && <i className="ri-check-line text-white text-[10px]"></i>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug transition-colors ${
          task.done ? "text-stone-400 line-through" : "text-stone-800"
        }`}>
          {task.title}
        </p>
        {task.description && (
          <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${
            task.done ? "text-stone-300" : "text-stone-400"
          }`}>
            {task.description}
          </p>
        )}
        {!task.done && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {task.project && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[12px] px-2 py-0.5 rounded-xs font-medium">
                <i className="ri-folder-3-line text-[12px]"></i>
                {task.project}
              </span>
            )}
            {task.priority && <PriorityBadge priority={task.priority} />}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!task.done && (
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 flex items-center justify-center rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Modifier"
          >
            <i className="ri-pencil-line text-sm"></i>
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="w-7 h-7 flex items-center justify-center rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Supprimer"
        >
          <i className="ri-delete-bin-2-line text-sm"></i>
        </button>
      </div>
    </li>
  );
}

function PriorityBadge({ priority }) {
  const lower = priority.toLowerCase();
  let cls = "bg-stone-100 text-stone-500";
  let icon = "ri-flag-2-line";

  if (lower.includes("urgent") || lower.includes("haute") || lower.includes("high")) {
    cls = "bg-red-50 text-red-500";
    icon = "ri-flag-2-fill";
  } else if (lower.includes("normal") || lower.includes("moyenne") || lower.includes("medium")) {
    cls = "bg-amber-50 text-amber-600";
  } else if (lower.includes("faible") || lower.includes("low") || lower.includes("basse")) {
    cls = "bg-emerald-50 text-emerald-600";
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-xs font-medium ${cls}`}>
      <i className={`${icon} text-[12px]`}></i>
      {priority}
    </span>
  );
}
