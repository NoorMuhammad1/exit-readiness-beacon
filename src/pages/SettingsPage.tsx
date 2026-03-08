
import React, { useState } from 'react';
import { Settings, User, Building2, Users, CreditCard, Plus, Trash2, Mail, Shield, Crown, Eye, Check } from "lucide-react";
import { useCompanyProfile } from '@/lib/companyProfile';

// ─── Types & Storage ────────────────────────────────────────────────
interface TeamMember { id: string; name: string; email: string; role: 'owner' | 'member' | 'advisor'; status: 'active' | 'pending'; addedAt: string; }
interface AccountSettings { displayName: string; email: string; }

const TEAM_KEY = 'pe-ready-team-v1';
const ACCOUNT_KEY = 'pe-ready-account-v1';
function loadTeam(): TeamMember[] { try { const r = localStorage.getItem(TEAM_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveTeam(m: TeamMember[]) { localStorage.setItem(TEAM_KEY, JSON.stringify(m)); }
function loadAccount(): AccountSettings { try { const r = localStorage.getItem(ACCOUNT_KEY); return r ? JSON.parse(r) : { displayName: '', email: '' }; } catch { return { displayName: '', email: '' }; } }
function saveAccount(a: AccountSettings) { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(a)); }

const roleConfig = {
  owner:   { label: 'Owner',   desc: 'Full control, billing, and team management', icon: Crown,  cls: 'text-amber-300 bg-amber-400/10 border-amber-400/30' },
  member:  { label: 'Member',  desc: 'Can view and edit all modules',              icon: Shield, cls: 'text-purple-300 bg-purple-400/10 border-purple-400/30' },
  advisor: { label: 'Advisor', desc: 'View-only access (free seat)',               icon: Eye,    cls: 'text-zinc-300 bg-zinc-400/10 border-zinc-400/30' },
};

const plans = [
  { name: 'Solo', price: '$29', features: ['1 user', 'All modules', 'CSV exports', 'Email support'], current: true },
  { name: 'Team', price: '$99', features: ['Up to 5 users', 'Everything in Solo', 'Shared data', 'Priority support'], popular: true },
  { name: 'Business', price: '$249', features: ['Unlimited users', 'Everything in Team', 'Custom branding', 'Dedicated manager'] },
];

const industries = ['Technology / SaaS', 'Healthcare', 'Manufacturing / Industrial', 'Financial Services', 'Consumer / Retail', 'Business Services', 'Education', 'Food & Beverage', 'Construction', 'Distribution', 'Energy', 'Real Estate', 'Other'];

// ─── Styled primitives ──────────────────────────────────────────────
const inputCls = "w-full h-12 px-4 rounded-xl bg-black/80 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/20 transition-all disabled:opacity-30";
const selectCls = "w-full h-12 px-4 rounded-xl bg-black/80 border border-white/10 text-white text-sm outline-none focus:border-purple-400/60 appearance-none cursor-pointer";

function Inp({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.15em]">{label}</label>
      <input {...props} className={`${inputCls} ${props.className || ''}`} />
    </div>
  );
}

function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-[0.15em]">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
        <option value="" className="bg-black text-white/40">Select...</option>
        {options.map(o => <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>)}
      </select>
    </div>
  );
}

function BlackCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-black border border-white/[0.08] p-7 ${className}`}>{children}</div>;
}

function Hint({ icon: Icon, text }: { icon: React.ElementType; text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
      <Icon className="h-4 w-4 text-purple-400 shrink-0" />
      <p className="text-xs text-white/40">{text}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const r = roleConfig[role as keyof typeof roleConfig];
  if (!r) return null;
  const Icon = r.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${r.cls}`}>
      <Icon className="h-3.5 w-3.5" />{r.label}
    </span>
  );
}

// ─── Main ───────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [tab, setTab] = useState('account');
  const [account, setAccount] = useState<AccountSettings>(loadAccount);
  const { profile, update: updateProfile } = useCompanyProfile();
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', role: 'member' as const });

  const setAcct = (f: keyof AccountSettings, v: string) => { const n = { ...account, [f]: v }; setAccount(n); saveAccount(n); };
  const addMember = () => {
    if (!draft.name.trim() || !draft.email.trim()) return;
    const u = [...team, { id: Date.now().toString(), name: draft.name.trim(), email: draft.email.trim(), role: draft.role, status: 'pending' as const, addedAt: new Date().toISOString() }];
    setTeam(u); saveTeam(u); setDraft({ name: '', email: '', role: 'member' }); setShowAdd(false);
  };
  const removeMember = (id: string) => { const u = team.filter(m => m.id !== id); setTeam(u); saveTeam(u); };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-full -m-6 relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0c0416 30%, #050208 60%, #000000 100%)' }}>

      {/* Big purple glow - top center */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.25) 0%, rgba(126, 34, 206, 0.1) 35%, transparent 65%)' }} />

      {/* Decorative arc line */}
      <svg className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none opacity-20" viewBox="0 0 1200 600" fill="none">
        <ellipse cx="600" cy="300" rx="550" ry="280" stroke="url(#arcGrad)" strokeWidth="1" />
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1200" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-4xl mx-auto px-8 py-14">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <Settings className="h-7 w-7 text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-3">Settings</h1>
          <p className="text-base text-white/30">Manage your account, organization, team, and billing.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-sm">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                }`}>
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ ACCOUNT ══════════ */}
        {tab === 'account' && (
          <div className="space-y-5">
            <BlackCard>
              <h3 className="text-xl font-bold text-white mb-1">Profile</h3>
              <p className="text-sm text-white/30 mb-6">Your personal account information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Inp label="Display Name" value={account.displayName} onChange={e => setAcct('displayName', e.target.value)} placeholder="Your name" />
                <Inp label="Email Address" type="email" value={account.email} onChange={e => setAcct('email', e.target.value)} placeholder="you@company.com" />
              </div>
            </BlackCard>

            <BlackCard>
              <h3 className="text-xl font-bold text-white mb-1">Password</h3>
              <p className="text-sm text-white/30 mb-6">Change your account password</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Inp label="Current Password" type="password" placeholder="Enter current password" disabled />
                <Inp label="New Password" type="password" placeholder="Enter new password" disabled />
              </div>
              <p className="text-xs text-white/20 mt-5">Available once authentication is connected.</p>
            </BlackCard>

            <BlackCard className="border-red-500/15">
              <h3 className="text-xl font-bold text-red-400 mb-1">Danger Zone</h3>
              <p className="text-sm text-white/30 mb-5">Irreversible actions for your account</p>
              <div className="flex items-center justify-between p-5 rounded-xl bg-red-500/5 border border-red-500/10">
                <div>
                  <p className="text-sm font-semibold text-white/80">Delete Account</p>
                  <p className="text-xs text-white/25">Permanently remove your account and all data</p>
                </div>
                <button disabled className="px-5 py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-semibold opacity-50 cursor-not-allowed">
                  Delete Account
                </button>
              </div>
            </BlackCard>
          </div>
        )}

        {/* ══════════ ORGANIZATION ══════════ */}
        {tab === 'organization' && (
          <div className="space-y-5">
            <BlackCard>
              <h3 className="text-xl font-bold text-white mb-1">Company Details</h3>
              <p className="text-sm text-white/30 mb-6">Shared with Company Profile — auto-fills across all modules</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Inp label="Company Name" value={profile.companyName} onChange={e => updateProfile({ companyName: e.target.value })} placeholder="Acme Corp" />
                <Sel label="Industry" value={profile.industry} onChange={v => updateProfile({ industry: v })}
                  options={industries.map(i => ({ value: i, label: i }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <Inp label="City" value={profile.city} onChange={e => updateProfile({ city: e.target.value })} placeholder="Miami" />
                <Inp label="State" value={profile.state} onChange={e => updateProfile({ state: e.target.value })} placeholder="FL" />
                <Inp label="Year Founded" type="number" value={profile.yearFounded || ''} onChange={e => updateProfile({ yearFounded: parseInt(e.target.value) || 0 })} placeholder="2010" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <Inp label="Employee Count" type="number" value={profile.employeeCount || ''} onChange={e => updateProfile({ employeeCount: parseInt(e.target.value) || 0 })} placeholder="50" />
                <Sel label="Business Model" value={profile.businessModel} onChange={v => updateProfile({ businessModel: v })}
                  options={[
                    { value: 'saas', label: 'SaaS / Subscription' },
                    { value: 'recurring_services', label: 'Recurring Services' },
                    { value: 'transaction', label: 'Transaction / Usage-Based' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ]} />
              </div>
            </BlackCard>
            <Hint icon={Building2} text={<>Changes sync automatically with <span className="text-purple-400 font-medium">Company Profile</span> and all connected modules.</>} />
          </div>
        )}

        {/* ══════════ TEAM ══════════ */}
        {tab === 'team' && (
          <div className="space-y-5">
            <BlackCard>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Team Members</h3>
                  <p className="text-sm text-white/30">
                    {team.length === 0 ? 'Add team members to collaborate on your exit readiness journey' : `${team.length} member${team.length !== 1 ? 's' : ''} on your team`}
                  </p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/25">
                  <Plus className="h-4 w-4" /> Add Member
                </button>
              </div>

              {showAdd && (
                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-5 mb-6">
                  <p className="text-sm font-bold text-purple-300">New Team Member</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Inp label="Name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Jane Smith" />
                    <Inp label="Email" type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} placeholder="jane@company.com" />
                    <Sel label="Role" value={draft.role} onChange={v => setDraft({ ...draft, role: v as TeamMember['role'] })}
                      options={[{ value: 'member', label: 'Member — edit access' }, { value: 'advisor', label: 'Advisor — view only (free)' }]} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={addMember} disabled={!draft.name.trim() || !draft.email.trim()}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Add to Team
                    </button>
                    <button onClick={() => setShowAdd(false)}
                      className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm hover:bg-white/10 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {team.length === 0 && !showAdd ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                    <Users className="h-8 w-8 text-white/10" />
                  </div>
                  <p className="text-sm text-white/30">No team members yet</p>
                  <p className="text-xs text-white/15 mt-1">Click "Add Member" to get started</p>
                </div>
              ) : team.length > 0 && (
                <div className="space-y-3">
                  {team.map(m => {
                    return (
                      <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-300">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{m.name}</p>
                            <p className="text-xs text-white/25 mt-0.5 flex items-center gap-1.5"><Mail className="h-3 w-3" />{m.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RoleBadge role={m.role} />
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            m.status === 'active' ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30' : 'text-yellow-300 bg-yellow-400/10 border-yellow-400/30'
                          }`}>{m.status === 'active' ? 'Active' : 'Pending'}</span>
                          <button onClick={() => removeMember(m.id)} className="p-2 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </BlackCard>

            <BlackCard>
              <h3 className="text-lg font-bold text-white mb-5">Roles Explained</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(roleConfig).map(([k, r]) => (
                  <div key={k} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <RoleBadge role={k} />
                    <p className="text-xs text-white/30 mt-3 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </BlackCard>
            <Hint icon={Mail} text="Invitations will be sent once authentication is connected. Team members are saved locally for now." />
          </div>
        )}

        {/* ══════════ BILLING ══════════ */}
        {tab === 'billing' && (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white mb-1">Choose Your Plan</h2>
              <p className="text-sm text-white/30">You are currently on the Solo plan</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {plans.map(p => (
                <div key={p.name} className={`relative rounded-2xl p-7 flex flex-col ${
                  p.current
                    ? 'bg-black border-2 border-purple-500/40 shadow-[0_0_60px_rgba(147,51,234,0.15)]'
                    : 'bg-black border border-white/[0.08] hover:border-purple-500/20 transition-colors'
                }`}>
                  {p.current && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-purple-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-purple-600/30">
                      Current
                    </span>
                  )}
                  {'popular' in p && p.popular && !p.current && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/5 border border-white/15 text-white/40 text-[11px] font-bold tracking-wider uppercase">
                      Popular
                    </span>
                  )}
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">{p.name}</p>
                  <div className="mt-2 mb-6">
                    <span className="text-5xl font-bold text-white">{p.price}</span>
                    <span className="text-sm text-white/20 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-white/40">
                        <Check className="h-4 w-4 text-purple-400 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <button disabled className={`w-full mt-7 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    p.current
                      ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                      : 'bg-white/[0.03] border border-white/[0.08] text-white/25 cursor-not-allowed'
                  }`}>
                    {p.current ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>

            <BlackCard>
              <h3 className="text-lg font-bold text-white mb-1">Payment Method</h3>
              <p className="text-sm text-white/30 mb-5">Manage your payment information</p>
              <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <CreditCard className="h-5 w-5 text-white/25" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/50">No payment method on file</p>
                    <p className="text-xs text-white/20">Add a payment method to upgrade your plan</p>
                  </div>
                </div>
                <button disabled className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/25 text-sm font-semibold cursor-not-allowed">
                  Add Card
                </button>
              </div>
            </BlackCard>
            <Hint icon={CreditCard} text="Billing will be enabled in a future update. All plans and pricing shown are illustrative." />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
