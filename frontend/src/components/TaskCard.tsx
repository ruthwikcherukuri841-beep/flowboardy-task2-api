import { CalendarDays } from "lucide-react";
import { projectById, userById } from "../data/directory";
import type { Task } from "../types";

const statusStyle: Record<string, string> = {
  todo: "bg-slate-100 text-slate-600 ring-slate-500/20",
  "in-progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const priorityDot: Record<string, string> = {
  low: "bg-slate-400",
  medium: "bg-amber-500",
  high: "bg-rose-500",
};

export function TaskCard({ task, onOpen, compact = false }: { task: Task; onOpen: () => void; compact?: boolean }) {
  const assignee = userById(task.assignee);
  const project = projectById(task.projectId);
  return (
    <button onClick={onOpen} className={`block w-full rounded-xl border border-slate-200 bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] ${compact ? "p-2.5" : "p-3.5"}`}>
      <div className="flex items-center gap-1.5">
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusStyle[task.status]}`}>
          {task.status.replace("-", " ")}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium capitalize text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.priority]}`} />{task.priority}
        </span>
      </div>
      <h4 className="mt-2 text-[13px] font-semibold leading-snug text-slate-900">{task.title}</h4>
      <p className="line-clamp-2 mt-0.5 text-xs leading-relaxed text-slate-500">{task.description}</p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{project.title}</p>
      <div className="mt-2.5 flex items-center justify-between border-t border-slate-50 pt-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[8px] font-bold text-white" title={assignee.name}>{assignee.avatar}</span>
          {assignee.name.split(" ")[0]}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12} /> {task.dueDate}</span>
      </div>
    </button>
  );
}
