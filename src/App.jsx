import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import Header from "./components/Header";
import PlannerView from "./components/PlannerView";
import { useFirestore } from "./useFirestore";

export default function App() {
  const {
    tasks, labels, loading,
    saveTask, deleteTask, toggleTask,
    addLabel, removeLabel,
  } = useFirestore();

  const [modalOpen, setModalOpen]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const openNew  = () => { setEditingTask(null); setModalOpen(true); };
  const handleSave = async (task) => {
    await saveTask(task);
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans flex flex-col">
      <Header onNewTask={openNew} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche */}
        <Sidebar
          priorities={labels.priorities}
          projects={labels.projects}
          onAddLabel={addLabel}
          onRemoveLabel={removeLabel}
        />

        {/* Todo list — largeur fixe */}
        <div className="flex flex-col w-[30%] min-w-[320px] border-r border-stone-200 overflow-y-auto">
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={openEdit}
            onDelete={deleteTask}
            onToggle={(id, done) => toggleTask(id, done)}
            onNewTask={openNew}
          />
        </div>

        {/* Planner — prend le reste */}
        <div className="flex-1 overflow-y-auto bg-white">
          <PlannerView projects={labels.projects} />
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          priorities={labels.priorities}
          projects={labels.projects}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}