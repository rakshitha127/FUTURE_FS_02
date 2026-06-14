import { useEffect, useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquarePlus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UsersRound
} from 'lucide-react';
import { apiRequest, getToken, removeToken, saveToken } from './api.js';

const statuses = ['new', 'contacted', 'converted'];

const emptyLeadForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website Contact Form',
  service: 'Website / App Development',
  priority: 'medium',
  estimatedValue: '',
  nextFollowUp: '',
  message: ''
};

function formatMoney(value = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(date) {
  if (!date) return 'Not scheduled';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function getInitials(name = 'Lead') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'admin12345' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      saveToken(data.token);
      onLogin(data.admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-lockup">
          <span className="brand-icon"><ShieldCheck size={24} /></span>
          <div>
            <p className="eyebrow">Secure admin workspace</p>
            <h1>ClientFlow CRM</h1>
          </div>
        </div>
        <p className="auth-copy">Manage every website inquiry, follow-up, and conversion from one clean business dashboard.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in securely'}
          </button>
        </form>
      </section>
    </main>
  );
}

function StatCard({ label, value, icon, helper }) {
  return (
    <article className="stat-card">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
    </article>
  );
}

function LeadForm({ onCreated }) {
  const [form, setForm] = useState(emptyLeadForm);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          estimatedValue: Number(form.estimatedValue) || 0
        })
      });
      setForm(emptyLeadForm);
      setMessage('Lead added successfully.');
      onCreated();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Quick capture</p>
          <h2>Add a new lead</h2>
        </div>
        <button className="secondary-button" type="submit"><Plus size={18} /> Create lead</button>
      </div>

      <div className="form-grid">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
        <input placeholder="Service needed" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
        <input placeholder="Estimated value" type="number" min="0" value={form.estimatedValue} onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })} />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.nextFollowUp} onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value })} />
      </div>
      <textarea placeholder="What does this lead need?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

function LeadCard({ lead, active, onClick }) {
  return (
    <button className={`lead-card ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="avatar">{getInitials(lead.name)}</span>
      <span className="lead-card-main">
        <strong>{lead.name}</strong>
        <small>{lead.company || lead.email}</small>
        <span>{lead.service || 'Website / App Development'}</span>
      </span>
      <span className={`priority-dot ${lead.priority || 'medium'}`}>{lead.priority || 'medium'}</span>
    </button>
  );
}

function PipelineBoard({ leads, selectedLead, onSelect }) {
  return (
    <section className="pipeline-board">
      {statuses.map((status) => {
        const columnLeads = leads.filter((lead) => lead.status === status);
        const columnValue = columnLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

        return (
          <div className="pipeline-column" key={status}>
            <div className="pipeline-heading">
              <div>
                <h3>{status}</h3>
                <p>{columnLeads.length} leads</p>
              </div>
              <strong>{formatMoney(columnValue)}</strong>
            </div>

            {columnLeads.map((lead) => (
              <button
                key={lead._id}
                className={`pipeline-card ${selectedLead?._id === lead._id ? 'active' : ''}`}
                onClick={() => onSelect(lead._id)}
              >
                <span className="pipeline-card-top">
                  <strong>{lead.name}</strong>
                  <span className={`priority-dot ${lead.priority || 'medium'}`}>{lead.priority || 'medium'}</span>
                </span>
                <small>{lead.company || lead.email}</small>
                <span>{lead.service || 'Website / App Development'}</span>
                <b>{formatMoney(lead.estimatedValue || 0)}</b>
              </button>
            ))}
          </div>
        );
      })}
    </section>
  );
}

function LeadDetails({ lead, onStatusChange, onNoteAdded, onDelete }) {
  const [note, setNote] = useState('');

  async function addNote(event) {
    event.preventDefault();
    if (!note.trim()) return;
    await onNoteAdded(lead._id, note);
    setNote('');
  }

  return (
    <section className="details-panel">
      <div className="details-header">
        <div className="details-title">
          <span className="avatar large">{getInitials(lead.name)}</span>
          <div>
            <p className="eyebrow">Lead profile</p>
            <h2>{lead.name}</h2>
            <p>{lead.company || 'No company added'}</p>
          </div>
        </div>
        <button className="icon-button danger" onClick={() => onDelete(lead._id)} title="Delete lead">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="detail-metrics">
        <div><span>Status</span><strong className={`status-pill ${lead.status}`}>{lead.status}</strong></div>
        <div><span>Value</span><strong>{formatMoney(lead.estimatedValue || 0)}</strong></div>
        <div><span>Priority</span><strong className={`priority-text ${lead.priority || 'medium'}`}>{lead.priority || 'medium'}</strong></div>
      </div>

      <div className="contact-stack">
        <p><Mail size={16} /> {lead.email}</p>
        <p><Phone size={16} /> {lead.phone || 'No phone added'}</p>
        <p><CalendarClock size={16} /> Follow up: {formatDate(lead.nextFollowUp)}</p>
      </div>

      <label>
        Move pipeline stage
        <select value={lead.status} onChange={(event) => onStatusChange(lead._id, event.target.value)}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </label>

      <div className="message-box">
        <strong>{lead.service || 'Project requirement'}</strong>
        <p>{lead.message || 'No message added.'}</p>
        <small>Source: {lead.source || 'Website Contact Form'}</small>
      </div>

      <form className="note-form" onSubmit={addNote}>
        <label>
          Follow-up note
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Example: Send proposal, call again Friday, or confirm project scope." />
        </label>
        <button className="primary-button" type="submit">
          <MessageSquarePlus size={18} /> Add note
        </button>
      </form>

      <div className="notes-list">
        <h3>Timeline</h3>
        {(lead.notes || []).length === 0 && <p className="muted">No notes yet.</p>}
        {(lead.notes || []).map((item) => (
          <article key={item._id} className="note-item">
            <p>{item.text}</p>
            <small>{new Date(item.createdAt).toLocaleString()} by {item.createdBy}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ admin, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, new: 0, contacted: 0, converted: 0, highPriority: 0, pipelineValue: 0 });
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  async function loadLeads() {
    setLoading(true);
    const params = new URLSearchParams({ status, search });
    const data = await apiRequest(`/leads?${params.toString()}`);
    setLeads(data.leads);
    setAnalytics(data.analytics);

    if (!selectedLeadId && data.leads[0]) {
      setSelectedLeadId(data.leads[0]._id);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadLeads().catch(() => setLoading(false));
  }, [status, search]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead._id === selectedLeadId) || leads[0],
    [leads, selectedLeadId]
  );

  const conversionRate = analytics.total ? Math.round((analytics.converted / analytics.total) * 100) : 0;

  async function updateStatus(id, nextStatus) {
    await apiRequest(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus })
    });
    await loadLeads();
  }

  async function addNote(id, text) {
    await apiRequest(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    await loadLeads();
  }

  async function deleteLead(id) {
    await apiRequest(`/leads/${id}`, { method: 'DELETE' });
    setSelectedLeadId('');
    await loadLeads();
  }

  function handleLogout() {
    removeToken();
    onLogout();
  }

  function selectPage(nextPage) {
    setPage(nextPage);
    if (nextPage === 'pipeline') {
      setStatus('all');
    }
  }

  const pageTitle = {
    dashboard: 'Lead Management Dashboard',
    leads: 'Lead Queue',
    pipeline: 'Sales Pipeline'
  };

  const pageCopy = {
    dashboard: 'Track inquiries, follow-ups, pipeline value, and conversions.',
    leads: 'Search, qualify, and update every incoming opportunity.',
    pipeline: 'Move leads from first inquiry to converted client.'
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon"><Sparkles size={21} /></span>
          <div>
            <strong>ClientFlow</strong>
            <small>Mini CRM</small>
          </div>
        </div>
        <nav>
          <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => selectPage('dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
          <button className={`nav-item ${page === 'leads' ? 'active' : ''}`} onClick={() => selectPage('leads')}><UsersRound size={18} /> Leads</button>
          <button className={`nav-item ${page === 'pipeline' ? 'active' : ''}`} onClick={() => selectPage('pipeline')}><TrendingUp size={18} /> Pipeline</button>
        </nav>
        <div className="sidebar-footer">
          <small>Signed in as</small>
          <strong>{admin?.name || 'Admin'}</strong>
          <button className="ghost-button" onClick={handleLogout}><LogOut size={17} /> Logout</button>
        </div>
      </aside>

      <section className="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">Business command center</p>
            <h1>{pageTitle[page]}</h1>
            <p className="topbar-copy">{pageCopy[page]}</p>
          </div>
        </header>

        {page === 'dashboard' && (
          <>
            <section className="stats-grid">
              <StatCard label="Total leads" value={analytics.total} helper="All captured inquiries" icon={<UsersRound size={22} />} />
              <StatCard label="Pipeline value" value={formatMoney(analytics.pipelineValue || 0)} helper="Estimated opportunity" icon={<BadgeIndianRupee size={22} />} />
              <StatCard label="High priority" value={analytics.highPriority || 0} helper="Needs fast attention" icon={<CircleDot size={22} />} />
              <StatCard label="Conversion rate" value={`${conversionRate}%`} helper={`${analytics.converted} converted`} icon={<CheckCircle2 size={22} />} />
            </section>

            <LeadForm onCreated={loadLeads} />
          </>
        )}

        <section className="workspace">
          <div className="lead-list-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{page === 'pipeline' ? 'Pipeline board' : 'Lead queue'}</p>
                <h2>{page === 'pipeline' ? 'Track deal stages' : 'Manage opportunities'}</h2>
              </div>
              {page === 'dashboard' && (
                <div className="view-toggle">
                  <button className="active" onClick={() => selectPage('leads')}>List</button>
                  <button onClick={() => selectPage('pipeline')}>Pipeline</button>
                </div>
              )}
            </div>

            {page !== 'pipeline' && (
              <div className="filters">
                <label className="search-field">
                  <Search size={17} />
                  <input placeholder="Search name, email, company..." value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            )}

            {loading && <p className="muted">Loading leads...</p>}
            {!loading && leads.length === 0 && <p className="empty-state">No leads found. Add your first lead from the capture form.</p>}

            {!loading && page !== 'pipeline' && (
              <div className="lead-list">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    active={selectedLead?._id === lead._id}
                    onClick={() => setSelectedLeadId(lead._id)}
                  />
                ))}
              </div>
            )}

            {!loading && page === 'pipeline' && (
              <PipelineBoard leads={leads} selectedLead={selectedLead} onSelect={setSelectedLeadId} />
            )}
          </div>

          {selectedLead && (
            <LeadDetails
              lead={selectedLead}
              onStatusChange={updateStatus}
              onNoteAdded={addNote}
              onDelete={deleteLead}
            />
          )}
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      if (!getToken()) {
        setChecking(false);
        return;
      }

      try {
        const data = await apiRequest('/auth/me');
        setAdmin(data.admin);
      } catch {
        removeToken();
      } finally {
        setChecking(false);
      }
    }

    checkSession();
  }, []);

  if (checking) {
    return <main className="loading-screen">Checking secure session...</main>;
  }

  return admin ? <Dashboard admin={admin} onLogout={() => setAdmin(null)} /> : <Login onLogin={setAdmin} />;
}
