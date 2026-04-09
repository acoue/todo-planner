import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const SETTINGS_DOC = "settings/labels";

const defaultLabels = {
  priorities: ["Urgent", "Normal", "Faible"],
  projects: ["Personnel", "Travail"],
};

export function useFirestore() {
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState(defaultLabels);
  const [loading, setLoading] = useState(true);

  // Écoute temps réel des tâches
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Écoute temps réel des labels (priorités + projets)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, SETTINGS_DOC), (snap) => {
      if (snap.exists()) {
        setLabels(snap.data());
      } else {
        // Premier lancement : initialise les labels par défaut
        setDoc(doc(db, SETTINGS_DOC), defaultLabels);
      }
    });
    return unsub;
  }, []);

  // --- Tasks ---
  const saveTask = async (task) => {
    if (task.id) {
      const { id, ...data } = task;
      await updateDoc(doc(db, "tasks", id), data);
    } else {
      await addDoc(collection(db, "tasks"), { ...task, done: false, createdAt: Date.now() });
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleTask = async (id, currentDone) => {
    await updateDoc(doc(db, "tasks", id), { done: !currentDone });
  };

  // --- Labels ---
  const addLabel = async (type, value) => {
    const trimmed = value.trim();
    if (!trimmed || labels[type].includes(trimmed)) return;
    const updated = [...labels[type], trimmed];
    await updateDoc(doc(db, SETTINGS_DOC), { [type]: updated });
  };

  const removeLabel = async (type, value) => {
    const updated = labels[type].filter((v) => v !== value);
    await updateDoc(doc(db, SETTINGS_DOC), { [type]: updated });
  };

  return {
    tasks,
    labels,
    loading,
    saveTask,
    deleteTask,
    toggleTask,
    addLabel,
    removeLabel,
  };
}
