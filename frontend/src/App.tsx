import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarDays, FolderKanban, ListChecks, Plus, Timer, Trophy } from "lucide-react";
import { currentUser, projects as seedProjects, tasks as seedTasks, userById } from "./data/mockData";
import { buildActivity, buildNotifications, type AppNotification } from "./data/activity";
import { accents, initials, load, save, type AccentKey, type Density } from "./theme";
import { Navbar } from "./components/Navbar";
import { ProjectCard } from "./components/ProjectCard";
import { Sidebar } from "./components/Sidebar";
import { EmptyState, LoadingSkeleton, NoSearchResults } from "./components/States";
import { TaskCard } from "./components/TaskCard";
import { ProjectDetailModal, TaskDetailModal } from "./components/DetailModals";
import { NewProjectModal, NewTaskModal, ShortcutsModal, Toast } from "./components/Modals";
import { AboutModal, CookiesModal, PrivacyModal, StatusModal, TermsModal } from "./components/Legal";
import { Footer, SettingsModal, type LegalKind } from "./components/SettingsFooter";
import { ProfilePage } from "./components/ProfilePage";
import type { Project, ProjectStatus, Task, TaskPriority, TaskStatus, View } from "./types";

const today = "2026-09-16";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [globalQuery, setGlobalQuery] = useState("");
  const [projectStatus, setProjectStatus] = useState("all");
  const [taskStatus, setTaskStatus] = useState("all");
  const [taskPriority, setTaskPriority] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profileName, setProfileName] = useState(() => load("flowboard-name", currentUser.name));
  const [profileRole, setProfileRole] = useState(() => load("flowboard-role", currentUser.role));
  const [profileBio, setProfileBio] = useState(() => load<string>("flowboard-bio", "Building FlowBoard — focused project tracking for software teams. Currently hardening the board experience before the API milestone."));
  const [profileLocation, setProfileLocation] = useState(() => load<string>("flowboard-location", "Remote"));
  const [accent, setAccent] = useState<AccentKey>(() => load<AccentKey>("flowboard-accent", "slate"));
  const [density, setDensity] = useState<Density>(() => load<Density>("flowboard-density", "comfortable"));
  const [showCompleted, setShowCompleted] = useState(() => load<string>("flowboard-show-completed", "true") !== "false");
  const compact = density === "compact";
  const accentBtn = accents[accent].btn;

  const [notifications, setNotifications] = useState<AppNotification[]>(() => buildNotifications(seedTasks));
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<"all" | "unread">("all");

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskProject, setNewTaskProject] = useState<string | undefined>(undefined);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [legal, setLegal] = useState<LegalKind>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => { save("flowboard-accent", accent); }, [accent]);
  useEffect(() => { save("flowboard-density", density); }, [density]);
  useEffect(() => { save("flowboard-show-completed", String(showCompleted)); }, [showCompleted]);
  useEffect(() => { save("flowboard-name", profileName); }, [profileName]);
  useEffect(() => { save("flowboard-role", profileRole); }, [profileRole]);
  useEffect(() => { save("flowboard-bio", profileBio); }, [profileBio]);
  useEffect(() => { save("flowboard-location", profileLocation); }, [profileLocation]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [view]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        if (e.key === "Escape") (document.activeElement as HTMLElement).blur();
        return;
      }
      if (e.key === "n" || e.key === "N") { e.preventDefault(); setNewTaskProject(undefined); setShowNewTask(true); }
      if (e.key === "p" || e.key === "P") { e.preventDefault(); setShowNewProject(true); }
      if (e.key === "1") setView("dashboard");
      if (e.key === "2") setView("projects");
      if (e.key === "3") setView("tasks");
      if (e.key === "4") setView("profile");
      if (e.key === "?") setShowShortcuts(true);
      if (e.key === "Escape") { setSelectedProjectId(null); setSelectedTaskId(null); setShowNewProject(false); setShowNewTask(false); setShowShortcuts(false); setShowSettings(false); setLegal(null); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const q = globalQuery.trim().toLowerCase();
  const filteredProjects = useMemo(() => projects.filter((p) => {
    const matchQ = !q || `${p.title} ${p.description}`.toLowerCase().includes(q);
    return matchQ && (projectStatus === "all" || p.status === projectStatus);
  }), [projects, q, projectStatus]);

  const filteredTasks = useMemo(() => tasks.filter((t) => {
    if (!showCompleted && t.status === "done" && taskStatus !== "done") return false;
    const matchQ = !q || `${t.title} ${t.description}`.toLowerCase().includes(q);
    return matchQ && (taskStatus === "all" || t.status === taskStatus) && (taskPriority === "all" || t.priority === taskPriority) && (projectFilter === "all" || t.projectId === projectFilter);
  }), [tasks, q, taskStatus, taskPriority, projectFilter, showCompleted]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    const inProg = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const overdue = tasks.filter((t) => t.status !== "done" && t.dueDate < today).length;
    return { total: tasks.length, done, inProg, todo, overdue, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0, projects: projects.length };
  }, [tasks, projects]);

  const activity = useMemo(() => buildActivity(tasks), [tasks]);
  const selectedProject = selectedProjectId ? projects.find((p) => p.id === selectedProjectId) ?? null : null;
  const selectedTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) ?? null : null;
  const selectedProjectTasks = selectedProject ? tasks.filter((t) => t.projectId === selectedProject.id) : [];

  const resetAll = () => { setGlobalQuery(""); setProjectStatus("all"); setTaskStatus("all"); setTaskPriority("all"); setProjectFilter("all"); };
  const openTask = (id: string) => { setSelectedTaskId(id); setNotifOpen(false); setNotifications((ns) => ns.map((n) => (n.taskId === id ? { ...n, read: true } : n))); };

  const viewTasksOf = (projectId: string) => {
    setSelectedProjectId(null);
    setProjectFilter(projectId);
    setTaskStatus("all"); setTaskPriority("all");
    setView("tasks");
  };

  const createProject = (d: { title: string; description: string; status: ProjectStatus; dueDate: string }) => {
    const p: Project = { id: `p${Date.now()}`, title: d.title, description: d.description, status: d.status, progress: 0, dueDate: d.dueDate, members: [currentUser.id], createdAt: today };
    setProjects((ps) => [p, ...ps]);
    setShowNewProject(false);
    showToast(`Project “${d.title}” created`);
  };
  const updateProject = (p: Project) => { setProjects((ps) => ps.map((x) => (x.id === p.id ? p : x))); setSelectedProjectId(null); showToast("Project updated"); };
  const deleteProject = (id: string) => {
    setProjects((ps) => ps.filter((p) => p.id !== id));
    setTasks((ts) => ts.filter((t) => t.projectId !== id));
    setSelectedProjectId(null);
    showToast("Project deleted");
  };
  const createTask = (d: { projectId: string; title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string }) => {
    const t: Task = { id: `t${Date.now()}`, projectId: d.projectId, title: d.title, description: d.description, status: d.status, priority: d.priority, assignee: currentUser.id, dueDate: d.dueDate, createdAt: today };
    setTasks((ts) => [t, ...ts]);
    setProjects((ps) => ps.map((p) => {
      if (p.id !== d.projectId) return p;
      const count = tasks.filter((x) => x.projectId === p.id).length + 1;
      const doneCount = tasks.filter((x) => x.projectId === p.id && x.status === "done").length + (d.status === "done" ? 1 : 0);
      return { ...p, progress: Math.round((doneCount / Math.max(1, count)) * 100) };
    }));
    setShowNewTask(false);
    showToast(`Task “${d.title}” created`);
  };
  const setTaskStatusById = (id: string, s: TaskStatus) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: s } : t)));
    const t = tasks.find((x) => x.id === id);
    if (t) {
      setProjects((ps) => ps.map((p) => {
        if (p.id !== t.projectId) return p;
        const list = tasks.map((x) => (x.id === id ? { ...x, status: s } : x)).filter((x) => x.projectId === p.id);
        const doneCount = list.filter((x) => x.status === "done").length;
        return { ...p, progress: list.length ? Math.round((doneCount / list.length) * 100) : p.progress };
      }));
    }
    showToast(`Task moved to ${s.replace("-", " ")}`);
  };
  const setTaskPriorityById = (id: string, p: TaskPriority) => { setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, priority: p } : t))); showToast(`Priority set to ${p}`); };

  const tasksFor = (pid: string) => tasks.filter((t) => t.projectId === pid).length;
  const viewTitle = view === "dashboard" ? "Overview" : view === "projects" ? `Projects · ${filteredProjects.length}` : view === "tasks" ? `Tasks · ${filteredTasks.length}` : "Profile";
  const statCards = [
    { key: "projects", label: "Total projects", value: stats.projects, icon: FolderKanban, action: () => setView("projects") },
    { key: "done", label: "Completed", value: `${stats.done}/${stats.total}`, icon: Trophy, action: () => { setTaskStatus("done"); setView("tasks"); } },
    { key: "prog", label: "In progress", value: stats.inProg, icon: Timer, action: () => { setTaskStatus("in-progress"); setView("tasks"); } },
    { key: "over", label: "Overdue", value: stats.overdue, icon: ListChecks, action: () => { setTaskStatus("all"); setView("tasks"); } },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <Navbar
        query={globalQuery} onQuery={setGlobalQuery} onMenu={() => setSidebarOpen((s) => !s)} sidebarOpen={sidebarOpen} viewTitle={viewTitle}
        notifications={notifications} notifTab={notifTab} onNotifTab={setNotifTab}
        onOpenTask={openTask} onMarkRead={(id) => setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))}
        onMarkAll={() => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))}
        onClearNotifs={() => { setNotifications([]); setNotifOpen(false); showToast("Notifications cleared"); }}
        notifOpen={notifOpen} onNotifToggle={() => setNotifOpen((v) => !v)} onNotifClose={() => setNotifOpen(false)}
        onNewTask={() => { setNewTaskProject(undefined); setShowNewTask(true); }}
        onNewProject={() => setShowNewProject(true)}
        onShortcuts={() => setShowShortcuts(true)} onToast={showToast}
        onProfile={() => setView("profile")} onSettings={() => setShowSettings(true)}
        profileName={profileName} profileRole={profileRole} profileEmail={currentUser.email}
      />

      <div className="mx-auto flex max-w-7xl items-start lg:gap-5 lg:px-5 lg:py-5">
        <Sidebar view={view} onView={(v) => { setView(v); setSidebarOpen(false); }} open={sidebarOpen} donePct={stats.pct}
          counts={{ projects: projects.length, tasks: tasks.length }} onNewProject={() => setShowNewProject(true)}
          onSettings={() => setShowSettings(true)} profileName={profileName} profileRole={profileRole} />
        {sidebarOpen && <div className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="min-w-0 flex-1 px-4 py-4 sm:px-5 lg:px-0 lg:py-0">
          {view === "dashboard" && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">Tuesday, September 16</h1>
                  <p className="mt-0.5 text-[13px] text-slate-500">Morning, {profileName.split(" ")[0]} — {stats.inProg} in progress, {stats.overdue} overdue. Standup-ready summary below.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setNewTaskProject(undefined); setShowNewTask(true); }} className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white ${accentBtn}`}><Plus size={15} /> New task</button>
                  <button onClick={() => setShowNewProject(true)} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">New project</button>
                </div>
              </div>

              <div className={`mt-4 grid grid-cols-2 ${compact ? "gap-2" : "gap-3"} xl:grid-cols-4`}>
                {statCards.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button key={s.key} onClick={s.action} className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)]" title={`Filter: ${s.label}`}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon size={16} /></span>
                      <p className="mt-2.5 text-xl font-bold tracking-tight">{s.value}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-slate-500">{s.label} <ArrowRight size={12} className="text-slate-300" /></p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_320px]">
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Priority projects</h2>
                    <button onClick={() => setView("projects")} className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-slate-900">View all <ArrowRight size={13} /></button>
                  </div>
                  {loading ? <LoadingSkeleton rows={3} /> : (
                    <div className={`grid ${compact ? "gap-2" : "gap-3"} sm:grid-cols-2`}>
                      {filteredProjects.slice(0, 4).map((p) => <ProjectCard key={p.id} project={p} taskCount={tasksFor(p.id)} compact={compact} onOpen={() => setSelectedProjectId(p.id)} />)}
                    </div>
                  )}
                  <div className="mb-2.5 mt-5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Needs attention</h2>
                    <button onClick={() => { setTaskStatus("all"); setView("tasks"); }} className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-slate-900">Open tasks <ArrowRight size={13} /></button>
                  </div>
                  {loading ? <LoadingSkeleton rows={2} /> : filteredTasks.filter((t) => t.status !== "done").slice(0, 2).length === 0 ? (
                    <EmptyState title="All caught up" hint="No pending tasks match your search." onReset={resetAll} />
                  ) : (
                    <div className={`grid ${compact ? "gap-2" : "gap-3"} sm:grid-cols-2`}>
                      {filteredTasks.filter((t) => t.status !== "done").slice(0, 2).map((t) => <TaskCard key={t.id} task={t} compact={compact} onOpen={() => openTask(t.id)} />)}
                    </div>
                  )}
                </div>
                <div className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">Recent activity</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{activity.length} events</span>
                  </div>
                  <ol className="mt-3 space-y-1">
                    {activity.map((a) => (
                      <li key={a.id}>
                        <button onClick={() => a.taskId && openTask(a.taskId)} className="block w-full rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                          <span className="block text-[13px] leading-snug text-slate-700">{a.text}</span>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400"><CalendarDays size={11} /> Due {a.time}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <button onClick={() => setNotifOpen(true)} className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Open notifications</button>
                </div>
              </div>
            </section>
          )}

          {view === "projects" && (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <h1 className="text-xl font-bold tracking-tight">Projects <span className="text-sm font-semibold text-slate-400">{filteredProjects.length}</span></h1>
                <div className="flex flex-wrap items-center gap-2">
                  <FilterPills options={["all", "active", "completed", "on-hold"]} value={projectStatus} onChange={setProjectStatus} />
                  <button onClick={() => setShowNewProject(true)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white ${accentBtn}`}><Plus size={14} /> Project</button>
                </div>
              </div>
              <div className="mt-4">
                {loading ? <LoadingSkeleton rows={6} /> : filteredProjects.length === 0 ? (
                  q || projectStatus !== "all" ? <NoSearchResults onReset={resetAll} /> : <EmptyState title="No projects yet" hint="Create your first project to group work." onReset={() => setShowNewProject(true)} />
                ) : (
                  <div className={`grid ${compact ? "gap-2" : "gap-3"} sm:grid-cols-2 xl:grid-cols-3`}>
                    {filteredProjects.map((p) => <ProjectCard key={p.id} project={p} taskCount={tasksFor(p.id)} compact={compact} onOpen={() => setSelectedProjectId(p.id)} />)}
                  </div>
                )}
              </div>
            </section>
          )}

          {view === "tasks" && (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <h1 className="text-xl font-bold tracking-tight">Tasks <span className="text-sm font-semibold text-slate-400">{filteredTasks.length}</span></h1>
                <div className="flex flex-wrap items-center gap-2">
                  {projectFilter !== "all" && (
                    <button onClick={() => setProjectFilter("all")} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                      {projects.find((p) => p.id === projectFilter)?.title ?? "Project"} ✕
                    </button>
                  )}
                  <FilterPills options={["all", "todo", "in-progress", "done"]} value={taskStatus} onChange={setTaskStatus} />
                  <FilterPills options={["all", "low", "medium", "high"]} value={taskPriority} onChange={setTaskPriority} />
                  <button onClick={() => { setNewTaskProject(projectFilter !== "all" ? projectFilter : undefined); setShowNewTask(true); }} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white ${accentBtn}`}><Plus size={14} /> Task</button>
                </div>
              </div>
              {!showCompleted && taskStatus === "all" && (
                <p className="mt-2 text-xs text-slate-400">Completed tasks are hidden — enable them in Display settings.</p>
              )}
              <div className="mt-4">
                {loading ? <LoadingSkeleton rows={6} /> : filteredTasks.length === 0 ? (
                  q || taskStatus !== "all" || taskPriority !== "all" || projectFilter !== "all" ? <NoSearchResults onReset={resetAll} /> : <EmptyState title="No tasks yet" hint="Add a task to start tracking work." />
                ) : (
                  <div className={`grid ${compact ? "gap-2" : "gap-3"} sm:grid-cols-2 xl:grid-cols-3`}>
                    {filteredTasks.map((t) => <TaskCard key={t.id} task={t} compact={compact} onOpen={() => openTask(t.id)} />)}
                  </div>
                )}
              </div>
            </section>
          )}

          {view === "profile" && (
            <ProfilePage name={profileName} role={profileRole} email={currentUser.email} bio={profileBio} location={profileLocation}
              accentSolid={accents[accent].solid} projects={projects} tasks={tasks} compact={compact}
              onSave={(n, r, b, l) => { setProfileName(n); setProfileRole(r); setProfileBio(b); setProfileLocation(l); showToast("Profile updated"); }}
              onOpenTask={openTask} onOpenProject={(id) => setSelectedProjectId(id)}
              onBrowseTasks={(s) => { setTaskStatus(s); setProjectFilter("all"); setView("tasks"); }}
              onToast={showToast} />
          )}

          <Footer onNav={(v) => setView(v)} onLegal={(k) => setLegal(k)} onShortcuts={() => setShowShortcuts(true)} onSettings={() => setShowSettings(true)} onNewProject={() => setShowNewProject(true)} />
          <p className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{initials(profileName)} {profileName}'s workspace · {projects.length} projects · {tasks.length} tasks</span>
            <button onClick={() => setShowShortcuts(true)} className="font-medium hover:text-slate-600">Press <kbd className="rounded border border-slate-200 bg-white px-1 font-mono">?</kbd> for shortcuts</button>
          </p>
        </main>
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} tasks={selectedProjectTasks} onClose={() => setSelectedProjectId(null)}
          onViewTasks={viewTasksOf} onUpdate={updateProject} onDelete={deleteProject} onOpenTask={openTask} />
      )}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} onUpdateStatus={setTaskStatusById} onUpdatePriority={setTaskPriorityById} />
      )}
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} onCreate={createProject} />}
      {showNewTask && <NewTaskModal projects={projects} defaultProjectId={newTaskProject} onClose={() => setShowNewTask(false)} onCreate={createTask} />}
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showSettings && (
        <SettingsModal accent={accent} onAccent={setAccent} density={density} onDensity={setDensity}
          showCompleted={showCompleted} onShowCompleted={setShowCompleted}
          onReset={() => { setAccent("slate"); setDensity("comfortable"); setShowCompleted(true); showToast("Preferences reset"); }}
          onClose={() => setShowSettings(false)} />
      )}
      {legal === "terms" && <TermsModal onClose={() => setLegal(null)} />}
      {legal === "privacy" && <PrivacyModal onClose={() => setLegal(null)} />}
      {legal === "cookies" && <CookiesModal onClose={() => setLegal(null)} />}
      {legal === "about" && <AboutModal onClose={() => setLegal(null)} />}
      {legal === "status" && <StatusModal onClose={() => setLegal(null)} />}
      <Toast message={toast} />
    </div>
  );
}

function FilterPills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Filter">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize transition ${value === o ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"}`}>
          {o.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}

export function ErrorBox({ onRetry }: { onRetry: () => void }) {
  void userById;
  return (
    <div className="flex flex-col items-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
      <AlertTriangle className="text-rose-500" />
      <p className="mt-2 text-sm font-semibold text-rose-700">Couldn't load this view</p>
      <button onClick={onRetry} className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-500">Try again</button>
    </div>
  );
}
