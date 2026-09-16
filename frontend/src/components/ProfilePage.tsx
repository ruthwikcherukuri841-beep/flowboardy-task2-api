import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, ChevronRight, Copy, FolderKanban, ListChecks, MapPin, Share2, Trophy } from "lucide-react";
import { initials } from "../theme";
import type { Project, Task } from "../types";
import { ProgressBar } from "./Progress";
import { TaskCard } from "./TaskCard";

type Browse = "all" | "todo" | "in-progress" | "done";

export function ProfilePage({
  name, role, email, bio, location, accentSolid,
  projects, tasks, compact,
  onSave, onOpenTask, onOpenProject, onBrowseTasks, onToast,
}: {
  name: string; role: string; email: string; bio: string; location: string; accentSolid: string;
  projects: Project[]; tasks: Task[]; compact: boolean;
  onSave: (name: string, role: string, bio: string, location: string) => void;
  onOpenTask: (id: string) => void;
  onOpenProject: (id: string) => void;
  onBrowseTasks: (s: Browse) => void;
  onToast: (m: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [n, setN] = useState(name);
  const [r, setR] = useState(role);
  const [b, setB] = useState(bio);
  const [l, setL] = useState(location);
  const [tab, setTab] = useState<Browse>("all");

  const mine = useMemo(() => tasks.filter((t) => t.assignee === "u1"), [tasks]);
  const done = mine.filter((t) => t.status === "done").length;
  const inProg = mine.filter((t) => t.status === "in-progress").length;
  const todo = mine.filter((t) => t.status === "todo").length;
  const overdue = mine.filter((t) => t.status !== "done" && t.dueDate < "2026-09-16");
  const rate = mine.length ? Math.round((done / mine.length) * 100) : 0;
  const myProjects = useMemo(() => projects.filter((p) => p.members.includes("u1")), [projects]);
  const visible = mine.filter((t) => tab === "all" || t.status === tab);
  const weekBars = useMemo(() => ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => ({
    d, h: 18 + ((mine.length * (i + 3) * 37 + done * 11) % 78),
  })), [mine.length, done]);
  const focus = overdue[0] ?? mine.find((t) => t.status !== "done");

  const share = async () => {
    const link = `https://flowboardy.vercel.app/#/u/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))}`;
    try {
      await navigator.clipboard.writeText(link);
      onToast("Profile link copied to clipboard");
    } catch {
      onToast(link);
    }
  };

  return (
    <section>
      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
        <div className="relative h-24 bg-slate-900 sm:h-28" aria-hidden>
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: accentSolid }} />
        </div>
        <div className="px-4 pb-4 sm:px-6 sm:pb-5">
          <div className="-mt-9 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-3.5">
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-xl font-extrabold text-white shadow-md">{initials(name)}</span>
              <div className="pb-1">
                <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-slate-900">
                  {name}
                  <BadgeCheck size={17} className="text-sky-500" aria-label="Verified member" />
                </h1>
                <p className="text-[13px] text-slate-500">{role} · <span className="inline-flex translate-y-[-1px] items-center gap-1"><MapPin size={12} className="text-slate-400" />{location}</span></p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setN(name); setR(role); setB(bio); setL(location); setEditing((v) => !v); }} className="rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-slate-700">
                {editing ? "Cancel" : "Edit profile"}
              </button>
              <button onClick={share} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); if (n.trim().length < 2) return; onSave(n.trim(), r.trim() || role, b.trim(), l.trim() || location); setEditing(false); }} className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
              <label className="block text-[13px] font-medium text-slate-700">Full name<input value={n} onChange={(e) => setN(e.target.value)} minLength={2} required className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" /></label>
              <label className="block text-[13px] font-medium text-slate-700">Role<input value={r} onChange={(e) => setR(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" /></label>
              <label className="block text-[13px] font-medium text-slate-700">Location<input value={l} onChange={(e) => setL(e.target.value)} placeholder="City, Country" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" /></label>
              <label className="block text-[13px] font-medium text-slate-700">Email<input value={email} disabled className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500" /></label>
              <label className="block text-[13px] font-medium text-slate-700 sm:col-span-2">Bio<textarea value={b} onChange={(e) => setB(e.target.value)} rows={2} maxLength={220} placeholder="What are you focused on?" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" /></label>
              <div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-slate-700">Save changes</button></div>
            </form>
          ) : (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{bio}</p>
          )}

          {/* Stat strip */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <button onClick={() => onBrowseTasks("all")} className="rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100">
              <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900"><ListChecks size={16} className="text-slate-400" />{mine.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Assigned to me</p>
            </button>
            <button onClick={() => onBrowseTasks("done")} className="rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100">
              <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900"><Trophy size={16} className="text-slate-400" />{done}</p>
              <p className="text-[11px] font-medium text-slate-500">Completed · {rate}%</p>
            </button>
            <button onClick={() => onBrowseTasks("in-progress")} className="rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100">
              <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900"><CalendarDays size={16} className="text-slate-400" />{inProg}</p>
              <p className="text-[11px] font-medium text-slate-500">In progress</p>
            </button>
            <button onClick={() => onBrowseTasks("todo")} className="rounded-xl bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100">
              <p className={`flex items-center gap-1.5 text-lg font-bold ${overdue.length ? "text-rose-600" : "text-slate-900"}`}><FolderKanban size={16} className={overdue.length ? "text-rose-400" : "text-slate-400"} />{overdue.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Overdue</p>
            </button>
          </div>
        </div>
      </div>

      {/* Middle grid */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Workload</h2>
              <span className="text-xs text-slate-400">{todo} to do · {inProg} active · {done} done</span>
            </div>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
              <span className="bg-slate-400" style={{ width: `${mine.length ? (todo / mine.length) * 100 : 0}%` }} title="To do" />
              <span className="bg-blue-500" style={{ width: `${mine.length ? (inProg / mine.length) * 100 : 0}%` }} title="In progress" />
              <span className="bg-emerald-500" style={{ width: `${mine.length ? (done / mine.length) * 100 : 0}%` }} title="Done" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-100 pt-4">
              {weekBars.map((b, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="w-full max-w-8 rounded-md bg-slate-900/85" style={{ height: `${b.h}px`, opacity: 0.25 + (b.h / 100) * 0.75 }} title={`${b.h}% focus`} />
                  <span className="text-[10px] font-semibold text-slate-400">{b.d}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">Focus distribution this week</p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Projects I'm in ({myProjects.length})</h2>
            </div>
            <ul className="mt-2 divide-y divide-slate-100">
              {myProjects.map((p) => {
                const count = tasks.filter((t) => t.projectId === p.id).length;
                return (
                  <li key={p.id}>
                    <button onClick={() => onOpenProject(p.id)} className="group flex w-full items-center gap-3 py-2.5 text-left">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-slate-800 group-hover:text-slate-950">{p.title}</span>
                        <span className="mt-1 block"><ProgressBar value={p.progress} /></span>
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">{count} tasks</span>
                      <ChevronRight size={15} className="shrink-0 text-slate-300 group-hover:text-slate-500" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
            <h2 className="text-sm font-bold text-slate-900">Up next</h2>
            {focus ? (
              <div className="mt-2.5 rounded-xl bg-slate-50 p-3">
                <p className="text-[13px] font-semibold leading-snug text-slate-800">{focus.title}</p>
                <p className="mt-1 text-xs text-slate-500">Due {focus.dueDate} · {focus.status.replace("-", " ")}</p>
                <button onClick={() => onOpenTask(focus.id)} className="mt-2.5 w-full rounded-lg bg-slate-900 py-1.5 text-[13px] font-semibold text-white hover:bg-slate-700">Open task</button>
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-slate-500">Nothing assigned. Enjoy the calm.</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
            <h2 className="text-sm font-bold text-slate-900">Details</h2>
            <dl className="mt-2 space-y-2 text-[13px]">
              <div className="flex justify-between gap-2"><dt className="text-slate-400">Email</dt><dd className="truncate font-medium text-slate-700">{email}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-400">Role</dt><dd className="font-medium text-slate-700">{role}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-400">Location</dt><dd className="font-medium text-slate-700">{location}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-slate-400">Member since</dt><dd className="font-medium text-slate-700">Aug 2026</dd></div>
            </dl>
            <button onClick={() => onToast("Demo workspace — sign-in stays on for this preview.")} className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Sign out</button>
          </div>
        </div>
      </div>

      {/* My tasks */}
      <div className="mb-2.5 mt-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">My tasks ({visible.length})</h2>
        <div className="flex gap-1" role="group" aria-label="Filter my tasks">
          {(["all", "todo", "in-progress", "done"] as Browse[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize ${tab === t ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-500 hover:text-slate-800"}`}>
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-[13px] text-slate-500">
          Nothing here. <button onClick={() => setTab("all")} className="font-semibold text-slate-800 underline">Show everything</button>
        </div>
      ) : (
        <div className={`grid ${compact ? "gap-2" : "gap-3"} sm:grid-cols-2 xl:grid-cols-3`}>
          {visible.map((t: Task) => <TaskCard key={t.id} task={t} compact={compact} onOpen={() => onOpenTask(t.id)} />)}
        </div>
      )}
      <p className="mt-3 flex items-center gap-1 text-xs text-slate-400"><Copy size={11} /> Profile edits and preferences are stored in this browser for the preview.</p>
    </section>
  );
}
