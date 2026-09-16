import { useState } from "react";
import { CalendarDays, Trash2, Users, X } from "lucide-react";
import { projectById, userById } from "../data/mockData";
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus } from "../types";
import { ProgressBar } from "./Progress";
import { TaskCard } from "./TaskCard";

function Shell({ onClose, children, label }: { onClose: () => void; children: React.ReactNode; label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div className="fade absolute inset-0 bg-slate-900/45" onClick={onClose} />
      <div className="modal-rise relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
}

export function ProjectDetailModal({
  project, tasks, onClose, onViewTasks, onUpdate, onDelete, onOpenTask,
}: {
  project: Project;
  tasks: Task[];
  onClose: () => void;
  onViewTasks: (projectId: string) => void;
  onUpdate: (p: Project) => void;
  onDelete: (id: string) => void;
  onOpenTask: (taskId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [desc, setDesc] = useState(project.description);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <Shell onClose={onClose} label={`Project ${project.title}`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Project · {project.id.toUpperCase()}</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">{project.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
      </div>
      <div className="px-5 py-4">
        {!editing ? (
          <>
            <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 py-2.5"><p className="text-base font-bold text-slate-900">{tasks.length}</p><p className="text-[11px] text-slate-500">Tasks</p></div>
              <div className="rounded-xl bg-slate-50 py-2.5"><p className="text-base font-bold text-slate-900">{done}</p><p className="text-[11px] text-slate-500">Done</p></div>
              <div className="rounded-xl bg-slate-50 py-2.5"><p className="text-base font-bold text-slate-900">{project.progress}%</p><p className="text-[11px] text-slate-500">Progress</p></div>
            </div>
            <div className="mt-4"><ProgressBar value={project.progress} /></div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-slate-600">
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} className="text-slate-400" /> Due {project.dueDate}</span>
              <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-slate-400" />
                {project.members.map((m) => userById(m).name).join(", ")}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-slate-600">{project.status}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => onViewTasks(project.id)} className="rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-slate-700">View tasks</button>
              <button onClick={() => setEditing(true)} className="rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
              {confirming ? (
                <span className="inline-flex items-center gap-2 text-[13px]">
                  <span className="text-slate-500">Delete this project?</span>
                  <button onClick={() => onDelete(project.id)} className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-500">Yes, delete</button>
                  <button onClick={() => setConfirming(false)} className="rounded-lg border px-3 py-1.5 text-slate-600">Keep</button>
                </span>
              ) : (
                <button onClick={() => setConfirming(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3.5 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50"><Trash2 size={14} /> Delete</button>
              )}
            </div>
            <h3 className="mb-2 mt-6 text-sm font-bold text-slate-900">Tasks in this project ({tasks.length})</h3>
            {tasks.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-[13px] text-slate-500">No tasks yet in this project.</p> : (
              <div className="grid gap-3 sm:grid-cols-2">
                {tasks.map((t) => (
                  <TaskCard key={t.id} task={t} onOpen={() => onOpenTask(t.id)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; onUpdate({ ...project, title: title.trim(), description: desc.trim(), status }); }} className="space-y-3">
            <label className="block text-[13px] font-medium text-slate-700">Title<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" required minLength={3} /></label>
            <label className="block text-[13px] font-medium text-slate-700">Description<textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" /></label>
            <label className="block text-[13px] font-medium text-slate-700">Status
              <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On hold</option>
              </select>
            </label>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-500">Save changes</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </Shell>
  );
}

export function TaskDetailModal({
  task, onClose, onUpdateStatus, onUpdatePriority,
}: {
  task: Task;
  onClose: () => void;
  onUpdateStatus: (id: string, s: TaskStatus) => void;
  onUpdatePriority: (id: string, p: TaskPriority) => void;
}) {
  const assignee = userById(task.assignee);
  const project = projectById(task.projectId);
  const statuses: TaskStatus[] = ["todo", "in-progress", "done"];
  return (
    <Shell onClose={onClose} label={`Task ${task.title}`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{project.title} · {task.id.toUpperCase()}</p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">{task.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
      </div>
      <div className="space-y-4 px-5 py-4">
        <p className="text-sm leading-relaxed text-slate-600">{task.description}</p>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
          <div className="flex gap-1.5" role="group" aria-label="Change status">
            {statuses.map((s) => (
              <button key={s} onClick={() => onUpdateStatus(task.id, s)} className={`rounded-lg border px-3 py-1.5 text-[13px] font-semibold capitalize ${task.status === s ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s.replace("-", " ")}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Priority</p>
          <div className="flex gap-1.5" role="group" aria-label="Change priority">
            {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
              <button key={p} onClick={() => onUpdatePriority(task.id, p)} className={`rounded-lg border px-3 py-1.5 text-[13px] font-semibold capitalize ${task.priority === p ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{p}</button>
            ))}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 text-[13px]">
          <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Assignee</dt><dd className="mt-0.5 font-semibold text-slate-800">{assignee.name}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Due date</dt><dd className="mt-0.5 font-semibold text-slate-800">{task.dueDate}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Project</dt><dd className="mt-0.5 font-semibold text-slate-800">{project.title}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-wide text-slate-400">Created</dt><dd className="mt-0.5 font-semibold text-slate-800">{task.createdAt}</dd></div>
        </dl>
      </div>
    </Shell>
  );
}
