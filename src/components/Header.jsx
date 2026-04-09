export default function Header({ onNewTask }) {
  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center px-6 gap-3 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-stone-800 rounded-md flex items-center justify-center">
          <i className="ri-check-line text-white text-sm"></i>
        </div>
        <span className="font-semibold text-stone-800 tracking-tight text-[15px]">
         Todo app et planner
        </span>
      </div>
      {/* <div className="flex-1" />
      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 bg-stone-800 text-white text-xs px-3 py-1.5 rounded-md hover:bg-stone-700 transition-colors"
      >
        <i className="ri-add-line text-sm"></i>
        Nouvelle tâche
      </button> */}
    </header>
  );
}
