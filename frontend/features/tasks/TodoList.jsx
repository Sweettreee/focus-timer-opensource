import { useState } from "react";
import { Plus, Check, Trash2, Target } from "lucide-react";
import { useTasks } from "../../app/selectors";
import { useTaskController } from "./useTaskController";

export default function TodoList() {
  const tasks = useTasks();
  const { addTask, toggleTask, deleteTask } = useTaskController();

  const [newTaskText, setNewTaskText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (id) => toggleTask(id);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteTask(id);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText);
    setNewTaskText("");
    setIsAdding(false);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xs font-bold text-[#4A5D4E]/80 uppercase tracking-widest">
            Today's Focus
          </h2>

        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${isAdding
              ? "bg-amber-100 text-amber-700 rotate-45"
              : "bg-[#5A6E5D]/10 text-[#5A6E5D] hover:bg-[#5A6E5D]/20"
            }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 태스크 추가 폼 (토글식) */}
      {isAdding && (
        <form
          onSubmit={handleAddTask}
          className="mb-4 bg-white/80 p-3 rounded-xl border border-gray-100 space-y-2.5 animate-fadeIn"
        >
          <input
            type="text"
            placeholder="What are you focusing on?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none focus:border-[#6B8E23] transition-all bg-white"
            autoFocus
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[10px] px-2.5 py-1 text-gray-400 hover:text-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-[10px] px-3 py-1 bg-[#6B8E23] text-white rounded font-medium shadow-sm hover:bg-[#5A7D20]"
            >
              Add Goal
            </button>
          </div>
        </form>
      )}

      {/* 할 일 리스트 */}
      <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[300px] pr-1">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 text-center text-gray-400 gap-2">
            <Target className="w-8 h-8 opacity-30 text-[#6B8E23]" />
            <p className="text-xs">No focus items added yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-[10px] text-[#6B8E23] hover:underline font-semibold"
            >
              + Add your first task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className="group flex items-center justify-between text-xs bg-white/40 p-2.5 rounded-xl border border-gray-100/50 hover:bg-white/80 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${task.checked
                      ? "bg-[#6B8E23] border-[#6B8E23] text-white"
                      : "border-gray-300 group-hover:border-[#6B8E23]"
                    }`}
                >
                  {task.checked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span
                  className={`font-medium truncate ${task.checked ? "line-through text-gray-400" : "text-gray-600"}`}
                >
                  {task.text}
                </span>
              </div>
              <div className="flex items-center pl-2">
                <button
                  onClick={(e) => handleDelete(task.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                  title="Delete Goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
