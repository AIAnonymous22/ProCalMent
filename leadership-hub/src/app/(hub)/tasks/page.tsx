"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassAvatar } from "@/components/ui/glass-avatar";
import { GlassModal } from "@/components/ui/glass-modal";
import { GlassInput } from "@/components/ui/glass-input";
import { mockTasks } from "@/lib/mock-data";
import { format } from "date-fns";

type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  owner: string;
  createdBy: string;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "BACKLOG", label: "Backlog", color: "bg-slate-400" },
  { status: "TODO", label: "To Do", color: "bg-blue-400" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-amber-400" },
  { status: "IN_REVIEW", label: "In Review", color: "bg-purple-400" },
  { status: "DONE", label: "Done", color: "bg-emerald-400" },
];

const priorityConfig: Record<TaskPriority, { variant: "default" | "info" | "warning" | "danger"; label: string }> = {
  LOW: { variant: "default", label: "Low" },
  MEDIUM: { variant: "info", label: "Medium" },
  HIGH: { variant: "warning", label: "High" },
  URGENT: { variant: "danger", label: "Urgent" },
};

const mockDependencies: Record<string, string[]> = {
  task_2: ["task_1"],
  task_3: ["task_1"],
  task_5: ["task_2"],
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks as TaskItem[]);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterPriority) {
      result = result.filter((t) => t.priority === filterPriority);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.owner.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, filterPriority, searchQuery]);

  function handleDragStart(taskId: string) {
    setDraggedTask(taskId);
  }

  function handleDrop(newStatus: TaskStatus) {
    if (!draggedTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTask ? { ...t, status: newStatus } : t))
    );
    setDraggedTask(null);
  }

  const getDependencies = (taskId: string) => {
    const depIds = mockDependencies[taskId] || [];
    return tasks.filter((t) => depIds.includes(t.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-white/50 mt-1">Kanban board — drag tasks between columns</p>
        </div>
        <GlassButton onClick={() => setShowNewTask(true)}>+ New Task</GlassButton>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 max-w-xs">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or owners..."
            className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          />
        </div>
        <div className="flex items-center gap-1">
          <GlassButton
            variant={filterPriority === null ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilterPriority(null)}
          >
            All
          </GlassButton>
          {(Object.keys(priorityConfig) as TaskPriority[]).map((p) => (
            <GlassButton
              key={p}
              variant={filterPriority === p ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilterPriority(filterPriority === p ? null : p)}
            >
              {priorityConfig[p].label}
            </GlassButton>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.status)}
              className="min-h-[300px]"
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-white/70">{col.label}</h3>
                <span className="text-xs text-white/30 ml-auto bg-white/10 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map((task) => {
                  const deps = getDependencies(task.id);
                  return (
                    <GlassCard
                      key={task.id}
                      hover
                      className="p-4 cursor-grab active:cursor-grabbing"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                      >
                        <p className="text-sm font-medium text-white leading-snug">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <GlassBadge variant={priorityConfig[task.priority].variant}>
                            {priorityConfig[task.priority].label}
                          </GlassBadge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <GlassAvatar name={task.owner} size="sm" />
                            <span className="text-xs text-white/50">{task.owner}</span>
                          </div>
                          <span className="text-xs text-white/30">
                            {format(task.dueDate, "MMM d")}
                          </span>
                        </div>
                        {deps.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Depends on</p>
                            {deps.map((dep) => (
                              <p key={dep.id} className="text-xs text-indigo-400 truncate">
                                ↳ {dep.title}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task detail modal */}
      <GlassModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        maxWidth="max-w-md"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Status</p>
                <GlassBadge>{selectedTask.status.replace("_", " ")}</GlassBadge>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Priority</p>
                <GlassBadge variant={priorityConfig[selectedTask.priority].variant}>
                  {priorityConfig[selectedTask.priority].label}
                </GlassBadge>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Owner</p>
                <div className="flex items-center gap-2">
                  <GlassAvatar name={selectedTask.owner} size="sm" />
                  <span className="text-sm text-white/70">{selectedTask.owner}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Due Date</p>
                <p className="text-sm text-white/70">{format(selectedTask.dueDate, "MMM d, yyyy")}</p>
              </div>
            </div>
            {getDependencies(selectedTask.id).length > 0 && (
              <div>
                <p className="text-xs text-white/40 mb-2">Dependencies</p>
                <div className="space-y-1">
                  {getDependencies(selectedTask.id).map((dep) => (
                    <div key={dep.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                      <div className={`w-2 h-2 rounded-full ${columns.find((c) => c.status === dep.status)?.color}`} />
                      <span className="text-sm text-white/70">{dep.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <GlassButton variant="ghost" onClick={() => setSelectedTask(null)}>Close</GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* New task modal */}
      <GlassModal open={showNewTask} onClose={() => setShowNewTask(false)} title="New Task">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowNewTask(false); }}>
          <GlassInput label="Title" placeholder="Task title" required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Description</label>
            <textarea
              rows={3}
              placeholder="Task description..."
              className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">Priority</label>
              <select className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
                <option value="LOW">Low</option>
                <option value="MEDIUM" selected>Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <GlassInput label="Due Date" type="date" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <GlassButton variant="ghost" type="button" onClick={() => setShowNewTask(false)}>Cancel</GlassButton>
            <GlassButton type="submit">Create Task</GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
