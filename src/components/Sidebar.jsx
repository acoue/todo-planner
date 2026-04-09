import { useState } from "react";

function LabelSection({ title, icon, items, type, onAdd, onRemove }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(type, input);
    setInput("");
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <i className={`${icon} text-stone-400 text-sm`}></i>
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {title}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
        {items.length === 0 && (
          <span className="text-xs text-stone-300 italic">Aucun élément</span>
        )}
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 bg-blue-100 text-stone-700 text-xs px-2 py-0.5 rounded-xs group"
          >
            {item}
            <button
              onClick={() => onRemove(type, item)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-stone-700 ml-0.5"
              title="Supprimer"
            >
              <i className="ri-close-line text-[10px]"></i>
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Ajouter…"
          className="flex-1 text-xs border border-stone-200 rounded px-2 py-1.5 outline-none focus:border-stone-400 bg-stone-50 placeholder:text-stone-300"
        />
        <button
          onClick={handleAdd}
          className="w-7 h-7 flex items-center justify-center bg-stone-100 hover:bg-stone-200 rounded transition-colors text-stone-600"
        >
          <i className="ri-add-line text-sm"></i>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ priorities, projects, onAddLabel, onRemoveLabel }) {
  return (
    <aside className="w-[15%] min-w-55 border-r border-blue-200 bg-blue-50 p-4 flex flex-col gap-4 overflow-y-auto">
      <LabelSection
        title="Priorités"
        icon="ri-flag-2-line"
        items={priorities}
        type="priorities"
        onAdd={onAddLabel}
        onRemove={onRemoveLabel}
      />
      <LabelSection
        title="Projets"
        icon="ri-folder-3-line"
        items={projects}
        type="projects"
        onAdd={onAddLabel}
        onRemove={onRemoveLabel}
      />
    </aside>
  );
}
