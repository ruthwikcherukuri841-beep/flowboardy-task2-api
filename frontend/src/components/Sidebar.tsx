import { CheckSquare, FolderKanban, LayoutDashboard, Plus, Settings, User } from "lucide-react";
import type { View } from "../types";

export function Sidebar({
  view, onView, open, donePct, counts, onNewProject, onSettings, profileName, profileRole,
}: {
  view: View; onView: (v: View) => void; open: boolean; donePct: number;
  counts: { projects: number; tasks: number };
  onNewProject: () => void; onSettings: () => void;
  profileName: string; profileRole: string;
}) {
  const items: { id: View; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban, count: counts.projects },
    { id: "tasks", label: "Tasks", icon: CheckSquare, count: counts.tasks },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} aria-label="Sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-slate-100 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[13px] font-extrabold text-white">F</span>
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-slate-900">FlowBoard</p>
          <p className="text-[11px] text-slate-400">Team workspace</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2.5">
        <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <div className="space-y-0.5">
          {items.map((it) => {
            const Icon = it.icon;
            const active = view === it.id;
            return (
              <button key={it.id} onClick={() => onView(it.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition ${active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-md ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}><Icon size={14} /></span>
                {it.label}
                {typeof it.count === "number" && <span className="ml-auto rounded-full bg-slate-100 px-1.5 py-px text-[11px] font-semibold text-slate-500">{it.count}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onNewProject} className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400"><Plus size={14} /></span>
          New project
        </button>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sprint progress</p>
          <p className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">{donePct}%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${donePct}%` }} />
          </div>
          <p className="mt-1.5 text-xs leading-snug text-slate-500">Share updates in standup. Overdue items need owners.</p>
        </div>
      </nav>
      <div className="border-t border-slate-100 p-2.5">
        <button onClick={onSettings} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
          <Settings size={15} /> Display settings
        </button>
        <button onClick={() => onView("profile")} className="mt-0.5 flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left hover:bg-slate-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">{profileName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-semibold text-slate-900">{profileName}</p>
            <p className="truncate text-[11px] text-slate-400">{profileRole}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
