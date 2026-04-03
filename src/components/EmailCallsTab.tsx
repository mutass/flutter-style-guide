import { useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  Plus,
  Send,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MailOpen,
  PhoneCall,
  PhoneMissed,
  MessageSquare,
} from "lucide-react";

interface EmailStep {
  id: string;
  subject: string;
  body: string;
  delayDays: number;
}

interface Sequence {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  steps: EmailStep[];
  leads: number;
  openRate: number;
  replyRate: number;
}

interface ScheduledCall {
  id: string;
  leadName: string;
  phone: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "missed" | "cancelled";
  notes: string;
}

interface CommEntry {
  id: string;
  type: "email_sent" | "email_opened" | "email_replied" | "call_made" | "call_missed" | "sms";
  leadName: string;
  subject: string;
  timestamp: string;
  status: string;
}

const initialSequences: Sequence[] = [
  {
    id: "seq1",
    name: "New Reader Welcome",
    status: "active",
    leads: 84,
    openRate: 72,
    replyRate: 18,
    steps: [
      { id: "s1", subject: "Welcome! Here's your free chapter", body: "Hi {{first_name}},\n\nThank you for signing up! As promised, here's your exclusive preview chapter...", delayDays: 0 },
      { id: "s2", subject: "Did you enjoy the preview?", body: "Hi {{first_name}},\n\nI hope you enjoyed the preview chapter. Many readers have told me...", delayDays: 3 },
      { id: "s3", subject: "Special launch pricing — 48 hours only", body: "Hi {{first_name}},\n\nThe full book launches tomorrow and I wanted to give you first access...", delayDays: 7 },
    ],
  },
  {
    id: "seq2",
    name: "Re-engagement Campaign",
    status: "paused",
    leads: 156,
    openRate: 45,
    replyRate: 8,
    steps: [
      { id: "s4", subject: "We miss you, {{first_name}}!", body: "It's been a while since we connected...", delayDays: 0 },
      { id: "s5", subject: "A gift for loyal readers", body: "As a thank you for being part of our community...", delayDays: 5 },
    ],
  },
];

const initialCalls: ScheduledCall[] = [
  { id: "c1", leadName: "Marcus Williams", phone: "+1 (555) 234-8901", date: "2025-01-15", time: "10:00 AM", status: "scheduled", notes: "Follow up on pre-order interest" },
  { id: "c2", leadName: "Jana Adeyemi", phone: "+1 (555) 567-1234", date: "2025-01-15", time: "2:30 PM", status: "scheduled", notes: "Discuss bulk purchase for book club" },
  { id: "c3", leadName: "Ryan Park", phone: "+1 (555) 890-4567", date: "2025-01-14", time: "11:00 AM", status: "completed", notes: "Confirmed speaking engagement interest" },
  { id: "c4", leadName: "Lisa Chen", phone: "+1 (555) 345-6789", date: "2025-01-14", time: "4:00 PM", status: "missed", notes: "Left voicemail about new release" },
];

const initialHistory: CommEntry[] = [
  { id: "h1", type: "email_sent", leadName: "Marcus Williams", subject: "Welcome! Here's your free chapter", timestamp: "2025-01-14 09:15 AM", status: "Delivered" },
  { id: "h2", type: "email_opened", leadName: "Marcus Williams", subject: "Welcome! Here's your free chapter", timestamp: "2025-01-14 09:42 AM", status: "Opened" },
  { id: "h3", type: "call_made", leadName: "Ryan Park", subject: "Follow-up call — 4 min 32s", timestamp: "2025-01-14 11:05 AM", status: "Connected" },
  { id: "h4", type: "email_sent", leadName: "Jana Adeyemi", subject: "Did you enjoy the preview?", timestamp: "2025-01-13 02:00 PM", status: "Delivered" },
  { id: "h5", type: "email_replied", leadName: "Jana Adeyemi", subject: "Re: Did you enjoy the preview?", timestamp: "2025-01-13 05:18 PM", status: "Replied" },
  { id: "h6", type: "call_missed", leadName: "Lisa Chen", subject: "Scheduled call — no answer", timestamp: "2025-01-14 04:02 PM", status: "No answer" },
  { id: "h7", type: "sms", leadName: "Ryan Park", subject: "Sent reminder about launch event", timestamp: "2025-01-13 10:30 AM", status: "Delivered" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald/10 text-emerald",
  paused: "bg-gold/10 text-gold",
  draft: "bg-muted/20 text-muted",
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-emerald/10 text-emerald",
  missed: "bg-coral/10 text-coral",
  cancelled: "bg-muted/20 text-muted",
};

const commIcons: Record<string, React.ElementType> = {
  email_sent: Send,
  email_opened: MailOpen,
  email_replied: Mail,
  call_made: PhoneCall,
  call_missed: PhoneMissed,
  sms: MessageSquare,
};

const commColors: Record<string, string> = {
  email_sent: "text-primary",
  email_opened: "text-emerald",
  email_replied: "text-gold",
  call_made: "text-emerald",
  call_missed: "text-coral",
  sms: "text-primary",
};

export default function EmailCallsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"sequences" | "calls" | "history">("sequences");
  const [sequences, setSequences] = useState(initialSequences);
  const [calls, setCalls] = useState(initialCalls);
  const [history] = useState(initialHistory);
  const [expandedSeq, setExpandedSeq] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showNewCall, setShowNewCall] = useState(false);
  const [newCall, setNewCall] = useState({ leadName: "", phone: "", date: "", time: "", notes: "" });
  const [showNewSequence, setShowNewSequence] = useState(false);
  const [newSeqName, setNewSeqName] = useState("");

  const toggleSequenceStatus = (id: string) => {
    setSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s))
    );
  };

  const deleteSequence = (id: string) => setSequences((prev) => prev.filter((s) => s.id !== id));

  const addCall = () => {
    if (!newCall.leadName || !newCall.date || !newCall.time) return;
    setCalls((prev) => [
      { ...newCall, id: `c${Date.now()}`, status: "scheduled" },
      ...prev,
    ]);
    setNewCall({ leadName: "", phone: "", date: "", time: "", notes: "" });
    setShowNewCall(false);
  };

  const updateCallStatus = (id: string, status: ScheduledCall["status"]) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addSequence = () => {
    if (!newSeqName.trim()) return;
    setSequences((prev) => [
      {
        id: `seq${Date.now()}`,
        name: newSeqName,
        status: "draft",
        leads: 0,
        openRate: 0,
        replyRate: 0,
        steps: [{ id: `s${Date.now()}`, subject: "New email", body: "Write your email here...", delayDays: 0 }],
      },
      ...prev,
    ]);
    setNewSeqName("");
    setShowNewSequence(false);
  };

  const filteredHistory = history.filter((h) => {
    const matchesSearch = !searchHistory || h.leadName.toLowerCase().includes(searchHistory.toLowerCase()) || h.subject.toLowerCase().includes(searchHistory.toLowerCase());
    const matchesType = filterType === "all" || h.type.startsWith(filterType);
    return matchesSearch && matchesType;
  });

  const tabs = [
    { id: "sequences" as const, label: "Email Sequences", icon: Mail },
    { id: "calls" as const, label: "Call Scheduler", icon: Phone },
    { id: "history" as const, label: "Communication Log", icon: Clock },
  ];

  return (
    <div className="p-8">
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSubTab === tab.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-card border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground hover:border-primary/20"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* EMAIL SEQUENCES */}
      {activeSubTab === "sequences" && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-lg text-foreground">Email Sequences</h3>
              <p className="text-xs text-muted mt-0.5">Automated email workflows for your leads</p>
            </div>
            <button onClick={() => setShowNewSequence(true)} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:brightness-110">
              <Plus size={14} /> New Sequence
            </button>
          </div>

          {showNewSequence && (
            <div className="bg-card border border-primary/20 rounded-xl p-5 mb-5 animate-fade-up">
              <div className="text-sm font-bold text-foreground mb-3">Create New Sequence</div>
              <div className="flex gap-3">
                <input
                  value={newSeqName}
                  onChange={(e) => setNewSeqName(e.target.value)}
                  placeholder="Sequence name..."
                  className="flex-1 bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40"
                />
                <button onClick={addSequence} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-xs">Create</button>
                <button onClick={() => setShowNewSequence(false)} className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-4 py-2.5 rounded-lg text-xs font-semibold hover:text-foreground">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {sequences.map((seq) => (
              <div key={seq.id} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden transition-all hover:border-primary/15">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{seq.name}</div>
                      <div className="text-xs text-muted mt-0.5">{seq.steps.length} steps · {seq.leads} leads enrolled</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-3 hidden sm:block">
                      <div className="text-xs text-muted">Open <span className="font-bold text-foreground">{seq.openRate}%</span></div>
                      <div className="text-xs text-muted">Reply <span className="font-bold text-foreground">{seq.replyRate}%</span></div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase ${statusColors[seq.status]}`}>{seq.status}</span>
                    <button onClick={() => toggleSequenceStatus(seq.id)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted hover:text-primary">
                      {seq.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button onClick={() => deleteSequence(seq.id)} className="p-2 rounded-lg hover:bg-coral/10 transition-colors text-muted hover:text-coral">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={() => setExpandedSeq(expandedSeq === seq.id ? null : seq.id)} className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted hover:text-foreground">
                      {expandedSeq === seq.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
                {expandedSeq === seq.id && (
                  <div className="border-t border-[rgba(255,255,255,0.06)] p-5 bg-secondary/30 animate-fade-up">
                    <div className="text-xs font-bold text-muted mb-3 uppercase tracking-wider">Sequence Steps</div>
                    <div className="space-y-3">
                      {seq.steps.map((step, i) => (
                        <div key={step.id} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                            {i < seq.steps.length - 1 && <div className="w-px h-8 bg-primary/10 mt-1" />}
                          </div>
                          <div className="flex-1 bg-card border border-[rgba(255,255,255,0.06)] rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-sm text-foreground">{step.subject}</div>
                                <div className="text-xs text-muted mt-1">{step.delayDays === 0 ? "Sends immediately" : `Sends after ${step.delayDays} day${step.delayDays > 1 ? "s" : ""}`}</div>
                              </div>
                              <button className="p-1.5 rounded hover:bg-primary/10 text-muted hover:text-primary"><Edit2 size={12} /></button>
                            </div>
                            <p className="text-xs text-muted mt-2 line-clamp-2">{step.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALL SCHEDULER */}
      {activeSubTab === "calls" && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-lg text-foreground">Call Scheduler</h3>
              <p className="text-xs text-muted mt-0.5">Schedule and track calls with your leads</p>
            </div>
            <button onClick={() => setShowNewCall(true)} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:brightness-110">
              <Plus size={14} /> Schedule Call
            </button>
          </div>

          {showNewCall && (
            <div className="bg-card border border-primary/20 rounded-xl p-5 mb-5 animate-fade-up">
              <div className="text-sm font-bold text-foreground mb-3">Schedule New Call</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input value={newCall.leadName} onChange={(e) => setNewCall({ ...newCall, leadName: e.target.value })} placeholder="Lead name" className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40" />
                <input value={newCall.phone} onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })} placeholder="Phone number" className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40" />
                <input type="date" value={newCall.date} onChange={(e) => setNewCall({ ...newCall, date: e.target.value })} className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/40" />
                <input value={newCall.time} onChange={(e) => setNewCall({ ...newCall, time: e.target.value })} placeholder="Time (e.g. 2:30 PM)" className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40" />
              </div>
              <input value={newCall.notes} onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })} placeholder="Notes..." className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 mb-3" />
              <div className="flex gap-3">
                <button onClick={addCall} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-xs">Schedule</button>
                <button onClick={() => setShowNewCall(false)} className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-4 py-2.5 rounded-lg text-xs font-semibold hover:text-foreground">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { label: "Upcoming", value: calls.filter((c) => c.status === "scheduled").length, color: "text-primary" },
              { label: "Completed", value: calls.filter((c) => c.status === "completed").length, color: "text-emerald" },
              { label: "Missed", value: calls.filter((c) => c.status === "missed").length, color: "text-coral" },
            ].map((m) => (
              <div key={m.label} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                <div className="text-[0.63rem] font-bold uppercase tracking-wider text-muted mb-1">{m.label}</div>
                <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/[0.03]">
                  {["Lead", "Phone", "Date & Time", "Status", "Notes", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[0.62rem] font-bold uppercase tracking-wider text-muted text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calls.map((call) => (
                  <tr key={call.id} className="border-t border-[rgba(255,255,255,0.06)] hover:bg-primary/[0.03] transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm text-foreground">{call.leadName}</td>
                    <td className="px-4 py-3 text-sm text-muted">{call.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted">
                      <div className="flex items-center gap-1.5"><Calendar size={12} /> {call.date} · {call.time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${statusColors[call.status]}`}>{call.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted max-w-[180px] truncate">{call.notes}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {call.status === "scheduled" && (
                          <>
                            <button onClick={() => updateCallStatus(call.id, "completed")} className="p-1.5 rounded hover:bg-emerald/10 text-muted hover:text-emerald" title="Mark completed"><CheckCircle size={14} /></button>
                            <button onClick={() => updateCallStatus(call.id, "missed")} className="p-1.5 rounded hover:bg-coral/10 text-muted hover:text-coral" title="Mark missed"><XCircle size={14} /></button>
                          </>
                        )}
                        <button onClick={() => setCalls((prev) => prev.filter((c) => c.id !== call.id))} className="p-1.5 rounded hover:bg-coral/10 text-muted hover:text-coral" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMMUNICATION HISTORY */}
      {activeSubTab === "history" && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-lg text-foreground">Communication Log</h3>
              <p className="text-xs text-muted mt-0.5">Complete history of all emails, calls, and messages</p>
            </div>
          </div>

          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
                placeholder="Search by lead or subject..."
                className="w-full bg-card border border-[rgba(255,255,255,0.06)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-muted" />
              {[
                { val: "all", label: "All" },
                { val: "email", label: "Emails" },
                { val: "call", label: "Calls" },
                { val: "sms", label: "SMS" },
              ].map((f) => (
                <button
                  key={f.val}
                  onClick={() => setFilterType(f.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterType === f.val
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-card border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredHistory.map((entry) => {
              const Icon = commIcons[entry.type] || Mail;
              const color = commColors[entry.type] || "text-muted";
              return (
                <div key={entry.id} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex items-center gap-4 transition-all hover:border-primary/15">
                  <div className={`w-9 h-9 rounded-full bg-card border border-[rgba(255,255,255,0.06)] flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{entry.leadName}</span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted truncate">{entry.subject}</span>
                    </div>
                    <div className="text-[0.65rem] text-muted mt-0.5">{entry.timestamp}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-bold ${
                    entry.status === "Replied" ? "bg-gold/10 text-gold" :
                    entry.status === "Opened" ? "bg-emerald/10 text-emerald" :
                    entry.status === "No answer" ? "bg-coral/10 text-coral" :
                    "bg-primary/10 text-primary"
                  }`}>{entry.status}</span>
                </div>
              );
            })}
            {filteredHistory.length === 0 && (
              <div className="text-center py-12 text-muted text-sm">No communication records match your filters.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
