import React, { useState, useEffect, useCallback, useMemo } from "react";
import { storage } from "./storage.js";

const ORANGE = "#E8590C";
const ORANGE_DARK = "#B8430A";
const BLACK = "#1A1A1A";
const WHITE = "#FBF8F3";
const SAGE = "#5C7A52";
const RED = "#B5413A";
const AMBER = "#C9852E";
const GREY = "#74726A";
const GREY_LIGHT = "#A6A399";
const LINE = "#E2DED4";
const LINE_STRONG = "#CFC9BA";
const CARD_BG = "#FFFFFF";

const WHATSAPP_NUMBER = "916238627951"; 
const ROADMAP = [
  {
    id: "step1",
    label: "Step 1",
    title: "Learn listing optimization",
    tasks: [
      { id: "s1t1", text: "Log 20-30 Kerala listings (titles, photos, descriptions, pricing)" },
      { id: "s1t2", text: "Write up Pattern Summary (title/photo/description/pricing rules)" },
      { id: "s1t3", text: "Pick 3 homestays for case studies" },
      { id: "s1t4", text: "Screenshot all 3 current listings" },
      { id: "s1t5", text: "Identify problems for each of the 3" },
      { id: "s1t6", text: "Redesign cover image for case study 1" },
      { id: "s1t7", text: "Redesign cover image for case study 2" },
      { id: "s1t8", text: "Redesign cover image for case study 3" },
      { id: "s1t9", text: "Write optimized titles for all 3" },
      { id: "s1t10", text: "Write optimized descriptions for all 3" },
      { id: "s1t11", text: "Build Before/After presentation" },
      { id: "s1t12", text: "Draft 4 guest communication templates" },
    ],
  },
  {
    id: "step2",
    label: "Step 2",
    title: "Find & contact property owners",
    tasks: [
      { id: "s2t1", text: "Build list of 30 target homestays/owners in Kerala" },
      { id: "s2t2", text: "Find contact details (phone/Instagram/email) for each" },
      { id: "s2t3", text: "Write cold outreach message template" },
      { id: "s2t4", text: "Send first 10 outreach messages" },
      { id: "s2t5", text: "Share Before/After case studies with leads" },
      { id: "s2t6", text: "Follow up with non-responders" },
      { id: "s2t7", text: "Book first 3 discovery calls" },
    ],
  },
  {
    id: "step3",
    label: "Step 3",
    title: "Package, price & deliver",
    tasks: [
      { id: "s3t1", text: "Define service packages (Basic / Full redesign / Ongoing)" },
      { id: "s3t2", text: "Set pricing for each package" },
      { id: "s3t3", text: "Create a simple service agreement / scope doc" },
      { id: "s3t4", text: "Set up a payment collection method" },
      { id: "s3t5", text: "Deliver first paid redesign" },
      { id: "s3t6", text: "Request testimonial/review after delivery" },
      { id: "s3t7", text: "Turn this into a repeatable monthly offer" },
    ],
  },
];

const NAV = [
  { id: "today", label: "Today", icon: "calendar" },
  { id: "roadmap", label: "Roadmap", icon: "route" },
  { id: "audit", label: "Mini-audit", icon: "search" },
  { id: "leads", label: "Leads", icon: "users" },
  { id: "invoices", label: "Invoices", icon: "receipt" },
  { id: "cases", label: "Case studies", icon: "stack" },
  { id: "pricing", label: "Pricing", icon: "tag" },
  { id: "pitch", label: "Pitch page", icon: "presentation" },
];

const ICONS = {
  calendar: "M7 2v3M17 2v3M3.5 9h17M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  route: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 16V10a4 4 0 0 1 4-4h6",
  users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 11a3 3 0 1 0 0-6M17 21v-1a5 5 0 0 0-3-4.58",
  stack: "M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 17l8 4 8-4",
  presentation: "M3 4h18M4 4v11h16V4M9 20l3-5 3 5",
  receipt: "M6 2h12v19l-3-2-3 2-3-2-3 2V2zM9 8h6M9 12h6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  tag: "M20.5 12.5L13 20a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8L10.7 3H19a1.5 1.5 0 0 1 1.5 1.5v8zM15.5 8.5h.01",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zM8.3 7.6c.2-.4.5-.4.7-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.7.7 1.8.1.2.1.3 0 .5-.1.2-.2.3-.3.4l-.4.5c-.1.2-.3.3-.1.6.2.4.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .2 0 1-.4 1.5-.4.5-1.6 1.1-2.6.7-1.2-.4-3.4-1.4-4.9-3.7-1.2-1.8-1.7-3-1.9-3.5-.1-.5-.6-1.6-.4-2z",
};

function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.7 }) {
  const d = ICONS[name];
  if (!d) return null;
  if (name === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d={d} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

const SCORE_COLORS = {
  Hot: { bg: "#FBEAE6", text: RED, border: RED },
  Warm: { bg: "#FBF1E2", text: AMBER, border: AMBER },
  Cold: { bg: "#EDEEE9", text: GREY, border: GREY_LIGHT },
};

const PACKAGES = [
  {
    name: "Mini-audit",
    price: "Free",
    sub: "Lead magnet",
    desc: "5-point problem list on your current listing",
    features: ["Title check", "Cover photo check", "Description check", "1 quick-win recommendation"],
    cta: "Get free audit",
    featured: false,
  },
  {
    name: "Basic redesign",
    price: "₹1,499",
    sub: "One-time",
    desc: "New title, description, and a retouched cover image",
    features: ["1 optimized title", "1 rewritten description", "1 retouched cover photo", "2-day turnaround"],
    cta: "Choose Basic",
    featured: false,
  },
  {
    name: "Full redesign",
    price: "₹3,999",
    sub: "One-time",
    desc: "Everything retouched, rewritten, and guest-ready",
    features: ["Full photo retouching (up to 10)", "Complete description rewrite", "Title + SEO captions", "4 guest message templates", "5-day turnaround"],
    cta: "Choose Full",
    featured: true,
  },
  {
    name: "Ongoing management",
    price: "₹2,499",
    sub: "Per month",
    desc: "Monthly upkeep so the listing never goes stale",
    features: ["Seasonal pricing review", "Monthly description refresh", "Review response support", "Priority WhatsApp support"],
    cta: "Choose Ongoing",
    featured: false,
  },
];

const AUDIT_RULES = {
  titleTooShort: { text: "Title is short and generic — add a location hook or standout feature", weight: 1 },
  titleNoLocation: { text: "Title doesn't mention the specific area — owners searching by location won't find it as easily", weight: 1 },
  titleAllCaps: { text: "Title is in all caps — Airbnb treats this as shouting and it reads unpolished", weight: 1 },
  descShort: { text: "Description is very short — guests can't picture the stay or amenities", weight: 1 },
  descNoAmenities: { text: "No amenities mentioned in the text — list WiFi, AC, parking, breakfast explicitly", weight: 1 },
  noPhotoMention: { text: "No mention of photos/view — can't verify photo quality from text alone, but it's worth a manual photo audit", weight: 1 },
};

function runMiniAudit({ title, description }) {
  const findings = [];
  const t = (title || "").trim();
  const d = (description || "").trim();

  if (t.length > 0 && t.length < 25) findings.push(AUDIT_RULES.titleTooShort);
  if (t.length > 0 && t === t.toUpperCase() && /[A-Z]/.test(t)) findings.push(AUDIT_RULES.titleAllCaps);
  if (t.length > 0 && !/kerala|kannur|kochi|munnar|wayanad|alleppey|kovalam|varkala|calicut|kozhikode|thekkady|fort kochi/i.test(t)) {
    findings.push(AUDIT_RULES.titleNoLocation);
  }
  if (d.length > 0 && d.length < 150) findings.push(AUDIT_RULES.descShort);
  if (d.length > 0 && !/wifi|wi-fi|ac\b|air condition|parking|breakfast|kitchen|pool|balcony|view/i.test(d)) {
    findings.push(AUDIT_RULES.descNoAmenities);
  }
  findings.push(AUDIT_RULES.noPhotoMention);

  return findings;
}

export default function App() {
  const [view, setView] = useState("today");
  const [loaded, setLoaded] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const [leads, setLeads] = useState([]);
  const [cases, setCases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [testimonials, setTestimonials] = useState([
    { id: "t1", quote: "", author: "", property: "" },
    { id: "t2", quote: "", author: "", property: "" },
    { id: "t3", quote: "", author: "", property: "" },
  ]);
  const [auditInput, setAuditInput] = useState({ title: "", description: "", listingUrl: "" });
  const [auditResult, setAuditResult] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  useEffect(() => {
    (async () => {
      const loadKey = async (key, setter) => {
        try {
          const r = await storage.get(key);
          if (r) setter(JSON.parse(r.value));
        } catch (e) {}
      };
      await loadKey("completed-tasks", setCompletedTasks);
      await loadKey("leads", setLeads);
      await loadKey("case-studies", setCases);
      await loadKey("invoices", setInvoices);
      await loadKey("testimonials", setTestimonials);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) storage.set("completed-tasks", JSON.stringify(completedTasks)).catch(() => {}); }, [completedTasks, loaded]);
  useEffect(() => { if (loaded) storage.set("leads", JSON.stringify(leads)).catch(() => {}); }, [leads, loaded]);
  useEffect(() => { if (loaded) storage.set("case-studies", JSON.stringify(cases)).catch(() => {}); }, [cases, loaded]);
  useEffect(() => { if (loaded) storage.set("invoices", JSON.stringify(invoices)).catch(() => {}); }, [invoices, loaded]);
  useEffect(() => { if (loaded) storage.set("testimonials", JSON.stringify(testimonials)).catch(() => {}); }, [testimonials, loaded]);

  const toggleTask = (taskId) => setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));

  const totalTasks = ROADMAP.reduce((sum, s) => sum + s.tasks.length, 0);
  const totalDone = Object.values(completedTasks).filter(Boolean).length;
  const stepProgress = (step) => {
    const done = step.tasks.filter((t) => completedTasks[t.id]).length;
    return { done, total: step.tasks.length, pct: Math.round((done / step.tasks.length) * 100) };
  };
  const currentStep = ROADMAP.find((s) => stepProgress(s).pct < 100) || ROADMAP[ROADMAP.length - 1];
  const nextTasks = currentStep.tasks.filter((t) => !completedTasks[t.id]).slice(0, 5);

  const addLead = () =>
    setLeads((prev) => [
      { id: uid(), name: "", location: "", contact: "", status: "Not contacted", score: "Warm", followUp: "", notes: "" },
      ...prev,
    ]);
  const updateLead = (id, field, value) => setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  const removeLead = (id) => setLeads((prev) => prev.filter((l) => l.id !== id));

  const addCase = () =>
    setCases((prev) => [{ id: uid(), name: "", location: "", before: "", after: "", status: "Not started" }, ...prev]);
  const updateCase = (id, field, value) => setCases((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  const removeCase = (id) => setCases((prev) => prev.filter((c) => c.id !== id));

  const addInvoice = () =>
    setInvoices((prev) => [
      { id: uid(), client: "", package: "Basic redesign", amount: "", status: "Unpaid", date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  const updateInvoice = (id, field, value) => setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const removeInvoice = (id) => setInvoices((prev) => prev.filter((i) => i.id !== id));

  const updateTestimonial = (id, field, value) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const handleAudit = () => {
    if (!auditInput.title && !auditInput.description) {
      showToast("Paste at least a title or description to audit");
      return;
    }
    const findings = runMiniAudit(auditInput);
    setAuditResult(findings);
  };

  const sendAuditAsLead = () => {
    setLeads((prev) => [
      {
        id: uid(),
        name: auditInput.listingUrl || "Audit lead",
        location: "",
        contact: "",
        status: "Enquiry received",
        score: "Hot",
        followUp: "",
        notes: `From mini-audit. Title: "${auditInput.title}". Findings: ${auditResult?.length || 0} issues flagged.`,
      },
      ...prev,
    ]);
    showToast("Saved to Leads as a hot lead");
  };

  const totalOutstanding = useMemo(
    () => invoices.filter((i) => i.status === "Unpaid").reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0),
    [invoices]
  );
  const totalCollected = useMemo(
    () => invoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0),
    [invoices]
  );
  const hotLeadsCount = leads.filter((l) => l.score === "Hot").length;
  const overdueFollowUps = leads.filter((l) => {
    const d = daysUntil(l.followUp);
    return d !== null && d <= 0;
  }).length;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: WHITE, color: BLACK, minHeight: "100%", display: "flex", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select {
          font-family: 'Inter', sans-serif;
          border: 1px solid ${LINE};
          border-radius: 5px;
          padding: 9px 11px;
          font-size: 13px;
          background: #fff;
          color: ${BLACK};
          width: 100%;
        }
        input:focus, textarea:focus, select:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(232,89,12,0.08); }
        button { font-family: 'Inter', sans-serif; cursor: pointer; }
        .checkbox-row:hover { background: #F3EEE3; }
        .navbtn:hover { background: #2A2A28 !important; }
        .card-hover:hover { border-color: ${LINE_STRONG} !important; }
        .scrollarea::-webkit-scrollbar { width: 6px; }
        .scrollarea::-webkit-scrollbar-thumb { background: ${LINE}; border-radius: 3px; }
        .wabtn:hover { background: #1ea952 !important; }
      `}</style>

      <div style={{ width: 228, minWidth: 228, borderRight: `1px solid ${LINE}`, padding: "24px 14px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ padding: "0 10px 4px" }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, letterSpacing: "0.02em", color: BLACK }}>INKEDARTIQ</div>
          <div style={{ fontSize: 10.5, color: GREY, marginTop: 2, letterSpacing: "0.05em" }}>AIRBNB STUDIO · OS</div>
        </div>
        <div style={{ height: 1, background: LINE, margin: "12px 10px 14px" }} />

        {NAV.map((n) => {
          const badge = n.id === "leads" && hotLeadsCount > 0 ? hotLeadsCount : n.id === "invoices" && totalOutstanding > 0 ? "!" : null;
          return (
            <button
              key={n.id}
              className="navbtn"
              onClick={() => setView(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 7,
                border: "none", background: view === n.id ? BLACK : "transparent", color: view === n.id ? WHITE : BLACK,
                fontSize: 13, fontWeight: 500, textAlign: "left", transition: "background 0.12s", position: "relative",
              }}
            >
              <Icon name={n.icon} size={16} color={view === n.id ? ORANGE : GREY} />
              {n.label}
              {badge && (
                <span style={{ marginLeft: "auto", background: badge === "!" ? RED : ORANGE, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px", minWidth: 16, textAlign: "center" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ marginTop: "auto", padding: "14px 10px 0" }}>
          {overdueFollowUps > 0 && (
            <div style={{ background: "#FBEAE6", border: `1px solid ${RED}`, borderRadius: 7, padding: "8px 10px", marginBottom: 12, fontSize: 11.5, color: RED, fontWeight: 600 }}>
              {overdueFollowUps} follow-up{overdueFollowUps > 1 ? "s" : ""} overdue
            </div>
          )}
          <div style={{ fontSize: 10.5, color: GREY, marginBottom: 8, letterSpacing: "0.05em" }}>OVERALL PROGRESS</div>
          <div style={{ height: 5, background: LINE, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((totalDone / totalTasks) * 100)}%`, background: ORANGE, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 11, color: GREY, marginTop: 6 }}>{totalDone} / {totalTasks} tasks done</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "28px 40px", maxWidth: 1080, position: "relative" }}>
        {toast && (
          <div style={{ position: "absolute", top: 20, right: 40, background: BLACK, color: WHITE, fontSize: 12, padding: "9px 16px", borderRadius: 7, boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
            {toast}
          </div>
        )}

        {view === "today" && (
          <TodayView
            currentStep={currentStep} nextTasks={nextTasks} stepProgress={stepProgress}
            toggleTask={toggleTask} completedTasks={completedTasks} roadmap={ROADMAP}
            hotLeadsCount={hotLeadsCount} totalOutstanding={totalOutstanding} overdueFollowUps={overdueFollowUps}
          />
        )}
        {view === "roadmap" && <RoadmapView roadmap={ROADMAP} completedTasks={completedTasks} toggleTask={toggleTask} stepProgress={stepProgress} />}
        {view === "audit" && (
          <AuditView auditInput={auditInput} setAuditInput={setAuditInput} handleAudit={handleAudit} auditResult={auditResult} sendAuditAsLead={sendAuditAsLead} />
        )}
        {view === "leads" && <LeadsView leads={leads} addLead={addLead} updateLead={updateLead} removeLead={removeLead} />}
        {view === "invoices" && (
          <InvoicesView invoices={invoices} addInvoice={addInvoice} updateInvoice={updateInvoice} removeInvoice={removeInvoice} totalOutstanding={totalOutstanding} totalCollected={totalCollected} />
        )}
        {view === "cases" && <CasesView cases={cases} addCase={addCase} updateCase={updateCase} removeCase={removeCase} />}
        {view === "pricing" && <PricingView />}
        {view === "pitch" && <PitchView cases={cases} testimonials={testimonials} updateTestimonial={updateTestimonial} />}
      </div>
    </div>
  );
}

function SectionLabel({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 4 : 0 }}>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: BLACK }}>{children}</div>
    </div>
  );
}

function NibCheckbox({ checked, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      style={{ width: 19, height: 19, minWidth: 19, border: `1.5px solid ${checked ? ORANGE : LINE_STRONG}`, background: checked ? ORANGE : "transparent", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
    >
      {checked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
    </button>
  );
}

function StatCard({ label, value, accent, sub }) {
  return (
    <div style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 10, padding: "16px 18px", background: CARD_BG, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: accent || ORANGE }} />
      <div style={{ fontSize: 11, color: GREY, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: BLACK }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: GREY, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function WhatsAppButton({ message, label, style }) {
  return (
    <a href={waLink(WHATSAPP_NUMBER, message)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
      <button
        className="wabtn"
        style={{
          display: "flex", alignItems: "center", gap: 7, background: "#25D366", color: "#fff", border: "none",
          borderRadius: 7, padding: "9px 16px", fontSize: 13, fontWeight: 600, transition: "background 0.12s", ...style,
        }}
      >
        <Icon name="whatsapp" size={16} color="#fff" />
        {label || "Message on WhatsApp"}
      </button>
    </a>
  );
}

function TodayView({ currentStep, nextTasks, stepProgress, toggleTask, completedTasks, roadmap, hotLeadsCount, totalOutstanding, overdueFollowUps }) {
  const prog = stepProgress(currentStep);
  return (
    <div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 6, letterSpacing: "0.03em" }}>
        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <SectionLabel>Today's focus</SectionLabel>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 22px", maxWidth: 560 }}>
        You're in <strong style={{ color: BLACK }}>{currentStep.label}: {currentStep.title}</strong> — {prog.done} of {prog.total} tasks done ({prog.pct}%).
      </p>

      <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
        <StatCard label="Hot leads" value={hotLeadsCount} accent={RED} sub="need a reply today" />
        <StatCard label="Outstanding" value={`₹${totalOutstanding.toLocaleString("en-IN")}`} accent={AMBER} sub="unpaid invoices" />
        <StatCard label="Overdue follow-ups" value={overdueFollowUps} accent={overdueFollowUps > 0 ? RED : SAGE} sub={overdueFollowUps > 0 ? "chase these now" : "all clear"} />
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
        {roadmap.map((s) => {
          const p = stepProgress(s);
          const isCurrent = s.id === currentStep.id;
          return (
            <div key={s.id} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 9, height: 9, transform: "rotate(45deg)", background: p.pct === 100 ? SAGE : isCurrent ? ORANGE : LINE }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: isCurrent ? BLACK : GREY }}>{s.label}</span>
              </div>
              <div style={{ height: 4, background: LINE, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${p.pct}%`, background: p.pct === 100 ? SAGE : ORANGE, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: "20px 22px", background: CARD_BG }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: GREY, marginBottom: 14, letterSpacing: "0.04em" }}>
          NEXT UP — {nextTasks.length === 0 ? "ALL DONE, MOVE TO NEXT STEP" : `${nextTasks.length} TASKS`}
        </div>
        {nextTasks.length === 0 && (
          <div style={{ fontSize: 13, color: GREY }}>Every task in this step is checked off. Open <strong>Roadmap</strong> to move into the next step.</div>
        )}
        {nextTasks.map((t) => (
          <div key={t.id} className="checkbox-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 8px", borderRadius: 7 }}>
            <NibCheckbox checked={!!completedTasks[t.id]} onClick={() => toggleTask(t.id)} />
            <span style={{ fontSize: 13.5 }}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapView({ roadmap, completedTasks, toggleTask, stepProgress }) {
  return (
    <div>
      <SectionLabel>Roadmap</SectionLabel>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 28px" }}>Step 1 → Step 2 → Step 3. Check off tasks as you go — Today auto-updates.</p>
      <div style={{ display: "flex" }}>
        <div style={{ width: 2, background: LINE, marginRight: 24, position: "relative" }}>
          {roadmap.map((s, i) => {
            const p = stepProgress(s);
            return (
              <div key={s.id} style={{ position: "absolute", top: i === 0 ? 4 : `${i * 33.3}%`, left: -5, width: 12, height: 12, transform: "rotate(45deg)", background: p.pct === 100 ? SAGE : p.pct > 0 ? ORANGE : WHITE, border: `2px solid ${p.pct === 100 ? SAGE : p.pct > 0 ? ORANGE : LINE_STRONG}` }} />
            );
          })}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
          {roadmap.map((s) => {
            const p = stepProgress(s);
            return (
              <div key={s.id}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: ORANGE, fontWeight: 700, letterSpacing: "0.05em" }}>{s.label.toUpperCase()}</span>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 17, marginTop: 2 }}>{s.title}</div>
                  </div>
                  <span style={{ fontSize: 12, color: GREY }}>{p.done}/{p.total}</span>
                </div>
                <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, background: CARD_BG }}>
                  {s.tasks.map((t, idx) => (
                    <div key={t.id} className="checkbox-row" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", borderBottom: idx < s.tasks.length - 1 ? `1px solid ${LINE}` : "none" }}>
                      <NibCheckbox checked={!!completedTasks[t.id]} onClick={() => toggleTask(t.id)} />
                      <span style={{ fontSize: 13.5, textDecoration: completedTasks[t.id] ? "line-through" : "none", color: completedTasks[t.id] ? GREY : BLACK }}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AuditView({ auditInput, setAuditInput, handleAudit, auditResult, sendAuditAsLead }) {
  return (
    <div>
      <SectionLabel>Mini-audit</SectionLabel>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 24px", maxWidth: 560 }}>
        Your lead magnet. An owner pastes their title and description, gets an instant problem list. Share the link
        before you ask for any money — it's how strangers start trusting you.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: 18, background: CARD_BG }}>
            <label style={{ fontSize: 11.5, color: GREY, fontWeight: 600, display: "block", marginBottom: 5 }}>LISTING URL (OPTIONAL)</label>
            <input placeholder="https://airbnb.co.in/rooms/..." value={auditInput.listingUrl} onChange={(e) => setAuditInput((o) => ({ ...o, listingUrl: e.target.value }))} style={{ marginBottom: 14 }} />
            <label style={{ fontSize: 11.5, color: GREY, fontWeight: 600, display: "block", marginBottom: 5 }}>CURRENT TITLE</label>
            <input placeholder="Paste the listing title here" value={auditInput.title} onChange={(e) => setAuditInput((o) => ({ ...o, title: e.target.value }))} style={{ marginBottom: 14 }} />
            <label style={{ fontSize: 11.5, color: GREY, fontWeight: 600, display: "block", marginBottom: 5 }}>CURRENT DESCRIPTION</label>
            <textarea placeholder="Paste the listing description here" value={auditInput.description} onChange={(e) => setAuditInput((o) => ({ ...o, description: e.target.value }))} style={{ minHeight: 130, resize: "vertical", marginBottom: 16 }} />
            <button onClick={handleAudit} style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 7, padding: "10px 20px", fontSize: 13, fontWeight: 700, width: "100%" }}>
              Run free audit
            </button>
          </div>
        </div>

        <div>
          {!auditResult && (
            <div style={{ border: `1px dashed ${LINE_STRONG}`, borderRadius: 10, padding: "40px 20px", textAlign: "center", color: GREY, fontSize: 13, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Results show up here once you run an audit.
            </div>
          )}
          {auditResult && (
            <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: 18, background: CARD_BG }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16 }}>{auditResult.length} issue{auditResult.length !== 1 ? "s" : ""} found</div>
                <span style={{ fontSize: 11, color: GREY }}>free instant audit</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                {auditResult.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", background: "#FBEAE6", color: RED, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>!</div>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{f.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14, fontSize: 12.5, color: GREY, marginBottom: 14 }}>
                Fixing these is exactly what a Basic or Full redesign covers. Save this as a lead to follow up.
              </div>
              <button onClick={sendAuditAsLead} style={{ background: BLACK, color: "#fff", border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, width: "100%" }}>
                Save as hot lead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadsView({ leads, addLead, updateLead, removeLead }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <SectionLabel>Leads</SectionLabel>
        <button onClick={addLead} style={{ background: BLACK, color: WHITE, border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 12.5, fontWeight: 700 }}>+ Add lead</button>
      </div>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 20px" }}>Score leads Hot/Warm/Cold and set a follow-up date — overdue ones are flagged automatically.</p>

      {leads.length === 0 && (
        <div style={{ border: `1px dashed ${LINE_STRONG}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", color: GREY, fontSize: 13 }}>
          No leads yet. Add one, or run a Mini-audit to generate your first hot lead.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {leads.map((l) => {
          const d = daysUntil(l.followUp);
          const overdue = d !== null && d <= 0;
          const sc = SCORE_COLORS[l.score] || SCORE_COLORS.Warm;
          return (
            <div key={l.id} style={{ border: `1px solid ${overdue ? RED : LINE}`, borderRadius: 10, padding: 16, background: CARD_BG }} className="card-hover">
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 0.8fr 0.9fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <input placeholder="Owner / property name" value={l.name} onChange={(e) => updateLead(l.id, "name", e.target.value)} />
                <input placeholder="Location" value={l.location} onChange={(e) => updateLead(l.id, "location", e.target.value)} />
                <input placeholder="Phone / Instagram" value={l.contact} onChange={(e) => updateLead(l.id, "contact", e.target.value)} />
                <select value={l.score || "Warm"} onChange={(e) => updateLead(l.id, "score", e.target.value)} style={{ background: sc.bg, color: sc.text, fontWeight: 700, borderColor: sc.border }}>
                  <option>Hot</option><option>Warm</option><option>Cold</option>
                </select>
                <select value={l.status} onChange={(e) => updateLead(l.id, "status", e.target.value)}>
                  <option>Not contacted</option><option>Enquiry received</option><option>Contacted</option>
                  <option>Replied</option><option>Call booked</option><option>Proposal sent</option><option>Won</option><option>Lost</option>
                </select>
                <button onClick={() => removeLead(l.id)} style={{ background: "none", border: "none", color: GREY, fontSize: 12 }}>Remove</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center" }}>
                <textarea placeholder="Notes" value={l.notes} onChange={(e) => updateLead(l.id, "notes", e.target.value)} style={{ minHeight: 36, resize: "vertical" }} />
                <div>
                  <label style={{ fontSize: 10.5, color: GREY, display: "block", marginBottom: 3 }}>FOLLOW-UP DATE {overdue && <span style={{ color: RED, fontWeight: 700 }}>· OVERDUE</span>}</label>
                  <input type="date" value={l.followUp} onChange={(e) => updateLead(l.id, "followUp", e.target.value)} style={{ borderColor: overdue ? RED : LINE }} />
                </div>
                {l.contact && (
                  <WhatsAppButton
                    message={`Hi ${l.name || "there"}, this is from InkedArtiq Studio — following up on your Airbnb listing.`}
                    label="WhatsApp"
                    style={{ padding: "9px 14px", fontSize: 12.5 }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvoicesView({ invoices, addInvoice, updateInvoice, removeInvoice, totalOutstanding, totalCollected }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <SectionLabel>Invoices</SectionLabel>
        <button onClick={addInvoice} style={{ background: BLACK, color: WHITE, border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 12.5, fontWeight: 700 }}>+ Add invoice</button>
      </div>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 20px" }}>Track who owes what. This logs status only — it doesn't move real money yet.</p>

      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <StatCard label="Outstanding" value={`₹${totalOutstanding.toLocaleString("en-IN")}`} accent={AMBER} />
        <StatCard label="Collected" value={`₹${totalCollected.toLocaleString("en-IN")}`} accent={SAGE} />
        <StatCard label="Total invoices" value={invoices.length} accent={ORANGE} />
      </div>

      {invoices.length === 0 && (
        <div style={{ border: `1px dashed ${LINE_STRONG}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", color: GREY, fontSize: 13 }}>
          No invoices yet. Add one once you've agreed a package with a client.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {invoices.map((inv) => (
          <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.2fr 0.8fr 0.8fr 0.9fr auto", gap: 10, alignItems: "center", border: `1px solid ${LINE}`, borderRadius: 10, padding: 12, background: CARD_BG }}>
            <input placeholder="Client / property name" value={inv.client} onChange={(e) => updateInvoice(inv.id, "client", e.target.value)} />
            <select value={inv.package} onChange={(e) => updateInvoice(inv.id, "package", e.target.value)}>
              <option>Basic redesign</option><option>Full redesign</option><option>Ongoing management</option>
            </select>
            <input placeholder="Amount (₹)" type="number" value={inv.amount} onChange={(e) => updateInvoice(inv.id, "amount", e.target.value)} />
            <input type="date" value={inv.date} onChange={(e) => updateInvoice(inv.id, "date", e.target.value)} />
            <select
              value={inv.status}
              onChange={(e) => updateInvoice(inv.id, "status", e.target.value)}
              style={{
                fontWeight: 700,
                color: inv.status === "Paid" ? SAGE : inv.status === "Unpaid" ? RED : AMBER,
                background: inv.status === "Paid" ? "#EEF3EA" : inv.status === "Unpaid" ? "#FBEAE6" : "#FBF1E2",
                borderColor: inv.status === "Paid" ? SAGE : inv.status === "Unpaid" ? RED : AMBER,
              }}
            >
              <option>Unpaid</option><option>Partially paid</option><option>Paid</option>
            </select>
            <button onClick={() => removeInvoice(inv.id)} style={{ background: "none", border: "none", color: GREY, fontSize: 12 }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CasesView({ cases, addCase, updateCase, removeCase }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <SectionLabel>Case studies</SectionLabel>
        <button onClick={addCase} style={{ background: BLACK, color: WHITE, border: "none", borderRadius: 7, padding: "8px 16px", fontSize: 12.5, fontWeight: 700 }}>+ Add case study</button>
      </div>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 20px" }}>Your Step 1 assignment — 3 Before/After redesigns. Feeds the Pitch page automatically.</p>

      {cases.length === 0 && (
        <div style={{ border: `1px dashed ${LINE_STRONG}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", color: GREY, fontSize: 13 }}>
          No case studies yet. Add your first homestay redesign.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cases.map((c) => (
          <div key={c.id} style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: 16, background: CARD_BG }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input placeholder="Homestay name" value={c.name} onChange={(e) => updateCase(c.id, "name", e.target.value)} style={{ flex: 1 }} />
              <input placeholder="Location" value={c.location} onChange={(e) => updateCase(c.id, "location", e.target.value)} style={{ flex: 1 }} />
              <select value={c.status} onChange={(e) => updateCase(c.id, "status", e.target.value)} style={{ width: 170 }}>
                <option>Not started</option><option>Screenshots done</option><option>Problems identified</option><option>Redesign in progress</option><option>Redesign complete</option>
              </select>
              <button onClick={() => removeCase(c.id)} style={{ background: "none", border: "none", color: GREY, fontSize: 12 }}>Remove</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: GREY, marginBottom: 4, fontWeight: 600 }}>BEFORE</div>
                <textarea value={c.before} onChange={(e) => updateCase(c.id, "before", e.target.value)} style={{ minHeight: 70, resize: "vertical" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: ORANGE, marginBottom: 4, fontWeight: 600 }}>AFTER</div>
                <textarea value={c.after} onChange={(e) => updateCase(c.id, "after", e.target.value)} style={{ minHeight: 70, resize: "vertical" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingView() {
  return (
    <div>
      <SectionLabel>Pricing</SectionLabel>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 28px", maxWidth: 560 }}>
        This is what owners see on your Pitch page. The Full redesign is anchored as the recommended option.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {PACKAGES.map((p) => (
          <div
            key={p.name}
            style={{
              border: p.featured ? `2px solid ${ORANGE}` : `1px solid ${LINE}`,
              borderRadius: 12, padding: "20px 18px", background: CARD_BG, position: "relative",
              display: "flex", flexDirection: "column",
            }}
          >
            {p.featured && (
              <div style={{ position: "absolute", top: -11, left: 18, background: ORANGE, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 5, letterSpacing: "0.03em" }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ fontSize: 10.5, color: GREY, fontWeight: 700, letterSpacing: "0.04em", marginTop: p.featured ? 6 : 0 }}>{p.sub.toUpperCase()}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, marginTop: 4 }}>{p.name}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: p.featured ? ORANGE : BLACK, margin: "10px 0 4px" }}>{p.price}</div>
            <div style={{ fontSize: 12.5, color: GREY, marginBottom: 14, minHeight: 32 }}>{p.desc}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5 }}>
                  <Icon name="calendar" size={0} />
                  <span style={{ color: SAGE, fontWeight: 700 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button style={{ background: p.featured ? ORANGE : "transparent", color: p.featured ? "#fff" : BLACK, border: `1.5px solid ${p.featured ? ORANGE : LINE_STRONG}`, borderRadius: 7, padding: "9px 0", fontSize: 12.5, fontWeight: 700 }}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PitchView({ cases, testimonials, updateTestimonial }) {
  const completedCases = cases.filter((c) => c.after && c.after.trim().length > 0);
  const filledTestimonials = testimonials.filter((t) => t.quote && t.quote.trim().length > 0);
  return (
    <div>
      <SectionLabel>Pitch page preview</SectionLabel>
      <p style={{ fontSize: 13.5, color: GREY, margin: "8px 0 22px" }}>
        Live preview of the owner-facing page — pricing, proof, testimonials, and a WhatsApp CTA all in one place.
      </p>

      <div style={{ border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: BLACK, color: WHITE, padding: "44px 40px" }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: ORANGE, letterSpacing: "0.06em", marginBottom: 10 }}>INKEDARTIQ STUDIO</div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, lineHeight: 1.22, maxWidth: 500 }}>
            Your homestay deserves bookings, not just a listing.
          </div>
          <p style={{ fontSize: 14, color: "#D8D4C9", marginTop: 14, maxWidth: 440 }}>
            We redesign Airbnb listings for Kerala homestays — sharper titles, retouched photos, and descriptions
            that actually convert. Built by a graphic designer, not a template.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <WhatsAppButton message="Hi, I'd like a free mini-audit of my Airbnb listing." label="Get a free audit on WhatsApp" />
            <button style={{ background: "transparent", color: WHITE, border: "1px solid #555", borderRadius: 7, padding: "9px 16px", fontSize: 13, fontWeight: 600 }}>
              See pricing
            </button>
          </div>
        </div>

        <div style={{ padding: "36px 40px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GREY, letterSpacing: "0.04em", marginBottom: 16 }}>RECENT WORK</div>
          {completedCases.length === 0 ? (
            <div style={{ color: GREY, fontSize: 13, fontStyle: "italic" }}>No case studies completed yet — fill in an "After" in Case Studies to show proof here.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 8 }}>
              {completedCases.map((c) => (
                <div key={c.id} style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name || "Untitled homestay"} {c.location && `· ${c.location}`}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 8 }}>
                    <div><div style={{ fontSize: 10, color: GREY, marginBottom: 3, fontWeight: 700 }}>BEFORE</div><div style={{ fontSize: 12.5, color: GREY }}>{c.before || "—"}</div></div>
                    <div><div style={{ fontSize: 10, color: ORANGE, marginBottom: 3, fontWeight: 700 }}>AFTER</div><div style={{ fontSize: 12.5 }}>{c.after}</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GREY, letterSpacing: "0.04em", marginBottom: 16 }}>WHAT HOSTS SAY</div>
            {filledTestimonials.length === 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {testimonials.map((t) => (
                  <div key={t.id} style={{ border: `1px dashed ${LINE_STRONG}`, borderRadius: 10, padding: 14 }}>
                    <textarea placeholder="Paste a real testimonial here once you have one..." value={t.quote} onChange={(e) => updateTestimonial(t.id, "quote", e.target.value)} style={{ minHeight: 60, resize: "vertical", marginBottom: 8, fontSize: 12.5 }} />
                    <input placeholder="Host name" value={t.author} onChange={(e) => updateTestimonial(t.id, "author", e.target.value)} style={{ marginBottom: 6, fontSize: 12.5 }} />
                    <input placeholder="Property" value={t.property} onChange={(e) => updateTestimonial(t.id, "property", e.target.value)} style={{ fontSize: 12.5 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {filledTestimonials.map((t) => (
                  <div key={t.id} style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: 16, background: "#FBF8F3" }}>
                    <div style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 10 }}>"{t.quote}"</div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{t.author || "Host"}</div>
                    {t.property && <div style={{ fontSize: 11, color: GREY }}>{t.property}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: GREY, marginBottom: 12 }}>Want this for your property?</div>
            <WhatsAppButton message="Hi, I'd like to talk about an Airbnb listing redesign." label="Message InkedArtiq on WhatsApp" style={{ margin: "0 auto" }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: GREY }}>
        This preview lives only in this app right now. Replace the WhatsApp number placeholder before sharing —
        and when you're ready for a real domain and real payments, I can help you deploy it properly.
      </div>
    </div>
  );
}
