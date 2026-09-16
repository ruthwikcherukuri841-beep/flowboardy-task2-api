import { X } from "lucide-react";

function Shell({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fade absolute inset-0 bg-slate-900/45" onClick={onClose} />
      <div className="modal-rise relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
        </div>
        <div className="prose-sm mt-3 space-y-3 text-[13px] leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}

export function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell onClose={onClose} title="Terms of Service">
      <p><strong className="text-slate-800">1. The service.</strong> FlowBoard is a demo project workspace for tracking projects and tasks. It stores data locally in your browser for this preview; no account or server is required.</p>
      <p><strong className="text-slate-800">2. Acceptable use.</strong> Don't upload unlawful, harmful, or infringing content, attempt to disrupt the service, or misrepresent other people's work as your own.</p>
      <p><strong className="text-slate-800">3. Your content.</strong> You keep all rights to projects and tasks you create. By using the preview you grant permission to store that content locally so the app can function.</p>
      <p><strong className="text-slate-800">4. Availability.</strong> This preview is provided "as is" without warranties. Features may change as the product evolves toward a hosted release with accounts and sync.</p>
      <p><strong className="text-slate-800">5. Liability.</strong> To the maximum extent permitted by law, FlowBoard is not liable for indirect or consequential damages arising from use of the preview.</p>
      <p className="text-xs text-slate-400">Last updated: September 16, 2026 · Contact: hello@flowboard.app</p>
    </Shell>
  );
}

export function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell onClose={onClose} title="Privacy Policy">
      <p><strong className="text-slate-800">What we collect.</strong> In this frontend preview, your projects, tasks, theme, and profile edits are stored only in your browser's local storage. Nothing is sent to a server.</p>
      <p><strong className="text-slate-800">What we don't collect.</strong> No analytics, cookies for tracking, or third-party advertising in the preview build. The hosted release will document any analytics before enabling them.</p>
      <p><strong className="text-slate-800">Your control.</strong> Clearing site data in your browser removes all demo content. Export or screenshot anything you want to keep before resetting.</p>
      <p><strong className="text-slate-800">Contact.</strong> Privacy questions: hello@flowboard.app. We respond within 7 days.</p>
      <p className="text-xs text-slate-400">Last updated: September 16, 2026</p>
    </Shell>
  );
}

export function CookiesModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell onClose={onClose} title="Cookie Notice">
      <p>This preview uses <strong className="text-slate-800">zero tracking cookies</strong>. The only browser storage used is local storage for your preferences (theme, density, profile name) and demo board data.</p>
      <p>When accounts and hosting arrive, this notice will list exactly which cookies are used and why — strictly necessary first, everything else opt-in.</p>
    </Shell>
  );
}

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <Shell onClose={onClose} title="About FlowBoard">
      <p>FlowBoard is a focused project and task workspace for software teams: one board for projects, one list for tasks, and a calm overview that answers "what needs me today?" in seconds.</p>
      <p>Roadmap: hosted API with real accounts → team invites → AI task drafting and summaries → integrations. This build is the frontend milestone; data stays local until the API lands.</p>
      <p className="text-xs text-slate-400">Version 0.1.0 · Frontend preview</p>
    </Shell>
  );
}

export function StatusModal({ onClose }: { onClose: () => void }) {
  const rows = [["Web app", "Operational"], ["Board & search", "Operational"], ["Notifications (local)", "Operational"], ["Hosted API & sync", "Planned"]];
  return (
    <Shell onClose={onClose} title="System status">
      <ul className="divide-y divide-slate-100">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-slate-700">{k}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${v === "Operational" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${v === "Operational" ? "bg-emerald-500" : "bg-slate-400"}`} />{v}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400">Uptime last 30 days: 100% (preview served statically)</p>
    </Shell>
  );
}
