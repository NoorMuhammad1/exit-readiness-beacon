
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, User, Building2, Users, CreditCard, Plus, Trash2, Mail, Shield, Crown, Eye, Check } from "lucide-react";
import { useCompanyProfile } from '@/lib/companyProfile';

// ─── Types ──────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'member' | 'advisor';
  status: 'active' | 'pending';
  addedAt: string;
}

interface AccountSettings {
  displayName: string;
  email: string;
}

// ─── Storage ────────────────────────────────────────────────────────
const TEAM_KEY = 'pe-ready-team-v1';
const ACCOUNT_KEY = 'pe-ready-account-v1';

function loadTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTeam(members: TeamMember[]) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(members));
}

function loadAccount(): AccountSettings {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : { displayName: '', email: '' };
  } catch { return { displayName: '', email: '' }; }
}

function saveAccount(account: AccountSettings) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

// ─── Role helpers ───────────────────────────────────────────────────
const roleLabels: Record<string, string> = {
  owner: 'Owner',
  member: 'Member',
  advisor: 'Advisor',
};

const roleDescriptions: Record<string, string> = {
  owner: 'Full control, billing, and team management',
  member: 'Can view and edit all modules',
  advisor: 'View-only access (free seat)',
};

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown className="h-3.5 w-3.5" />,
  member: <Shield className="h-3.5 w-3.5" />,
  advisor: <Eye className="h-3.5 w-3.5" />,
};

const roleBadgeStyles: Record<string, string> = {
  owner: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  member: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  advisor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

// ─── Plans ──────────────────────────────────────────────────────────
const plans = [
  {
    name: 'Solo',
    price: '$29',
    period: '/month',
    features: ['1 user', 'All 4 weeks', 'All modules', 'CSV exports', 'Email support'],
    current: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    features: ['Up to 5 users', 'Everything in Solo', 'Shared company data', 'Team collaboration', 'Priority support'],
    current: false,
  },
  {
    name: 'Business',
    price: '$249',
    period: '/month',
    features: ['Unlimited users', 'Everything in Team', 'Custom branding', 'API access', 'Dedicated success manager'],
    current: false,
  },
];

// ─── Industry options (shared with Company Profile) ─────────────────
const industryOptions = [
  'Technology / SaaS', 'Healthcare', 'Manufacturing / Industrial',
  'Financial Services', 'Consumer / Retail', 'Business Services',
  'Education', 'Food & Beverage', 'Construction', 'Distribution',
  'Energy', 'Real Estate', 'Other'
];

// ─── Main Component ─────────────────────────────────────────────────
const SettingsPage = () => {
  // Account state
  const [account, setAccount] = useState<AccountSettings>(loadAccount);

  // Organization — reads from shared Company Profile store
  const { profile, update: updateProfile } = useCompanyProfile();

  // Team state
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member' as const });

  // Persist account changes
  const updateAccount = (field: keyof AccountSettings, value: string) => {
    const next = { ...account, [field]: value };
    setAccount(next);
    saveAccount(next);
  };

  // Team actions
  const addMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      status: 'pending',
      addedAt: new Date().toISOString(),
    };
    const updated = [...team, member];
    setTeam(updated);
    saveTeam(updated);
    setNewMember({ name: '', email: '', role: 'member' });
    setShowAddForm(false);
  };

  const removeMember = (id: string) => {
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    saveTeam(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Settings className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account, organization, team, and billing</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Organization</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Account Tab ───────────────────────────────────────── */}
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>Your personal account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={account.displayName}
                    onChange={e => updateAccount('displayName', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={account.email}
                    onChange={e => updateAccount('email', e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" disabled />
                </div>
              </div>
              <Button variant="outline" disabled>
                Update Password
              </Button>
              <p className="text-xs text-muted-foreground">Password changes will be available once authentication is connected.</p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Organization Tab ──────────────────────────────────── */}
        <TabsContent value="organization" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Details</CardTitle>
              <CardDescription>
                This information is shared with your Company Profile and auto-fills across modules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Company Name</Label>
                  <Input
                    id="orgName"
                    value={profile.companyName}
                    onChange={e => updateProfile({ companyName: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgIndustry">Industry</Label>
                  <Select
                    value={profile.industry}
                    onValueChange={val => updateProfile({ industry: val })}
                  >
                    <SelectTrigger id="orgIndustry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgCity">City</Label>
                  <Input
                    id="orgCity"
                    value={profile.city}
                    onChange={e => updateProfile({ city: e.target.value })}
                    placeholder="Miami"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgState">State</Label>
                  <Input
                    id="orgState"
                    value={profile.state}
                    onChange={e => updateProfile({ state: e.target.value })}
                    placeholder="FL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgFounded">Year Founded</Label>
                  <Input
                    id="orgFounded"
                    type="number"
                    value={profile.yearFounded || ''}
                    onChange={e => updateProfile({ yearFounded: parseInt(e.target.value) || 0 })}
                    placeholder="2010"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgEmployees">Employee Count</Label>
                  <Input
                    id="orgEmployees"
                    type="number"
                    value={profile.employeeCount || ''}
                    onChange={e => updateProfile({ employeeCount: parseInt(e.target.value) || 0 })}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgBusinessModel">Business Model</Label>
                  <Select
                    value={profile.businessModel}
                    onValueChange={val => updateProfile({ businessModel: val })}
                  >
                    <SelectTrigger id="orgBusinessModel">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS / Subscription</SelectItem>
                      <SelectItem value="recurring_services">Recurring Services</SelectItem>
                      <SelectItem value="transaction">Transaction / Usage-Based</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <Building2 className="h-4 w-4 text-accent shrink-0" />
            <p className="text-xs text-muted-foreground">
              Changes here sync automatically with your <span className="text-accent font-medium">Company Profile</span> and all connected modules.
            </p>
          </div>
        </TabsContent>

        {/* ── Team Tab ──────────────────────────────────────────── */}
        <TabsContent value="team" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <CardDescription>
                    {team.length === 0
                      ? 'Add team members to collaborate on your exit readiness journey'
                      : `${team.length} member${team.length !== 1 ? 's' : ''} on your team`}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Member Form */}
              {showAddForm && (
                <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-4">
                  <p className="text-sm font-medium">New Team Member</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Name</Label>
                      <Input
                        id="memberName"
                        value={newMember.name}
                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberEmail">Email</Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={newMember.email}
                        onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                        placeholder="jane@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberRole">Role</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={val => setNewMember({ ...newMember, role: val as TeamMember['role'] })}
                      >
                        <SelectTrigger id="memberRole">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member — edit access</SelectItem>
                          <SelectItem value="advisor">Advisor — view only (free)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addMember} disabled={!newMember.name.trim() || !newMember.email.trim()}>
                      Add to Team
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Team List */}
              {team.length === 0 && !showAddForm ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No team members yet</p>
                  <p className="text-xs mt-1">Click "Add Member" to invite your first team member</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {team.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-sm font-medium text-accent">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`text-xs flex items-center gap-1 ${roleBadgeStyles[member.role]}`}
                        >
                          {roleIcons[member.role]}
                          {roleLabels[member.role]}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            member.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {member.status === 'active' ? 'Active' : 'Pending'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                          onClick={() => removeMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Roles Explained</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(roleLabels).map(([key, label]) => (
                  <div key={key} className="p-3 rounded-lg border bg-card space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs flex items-center gap-1 ${roleBadgeStyles[key]}`}>
                        {roleIcons[key]}
                        {label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{roleDescriptions[key]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <Mail className="h-4 w-4 text-accent shrink-0" />
            <p className="text-xs text-muted-foreground">
              Invitations will be sent once authentication is connected. For now, team members are saved locally.
            </p>
          </div>
        </TabsContent>

        {/* ── Billing Tab ──────────────────────────────────────── */}
        <TabsContent value="billing" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>You are currently on the Solo plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <div
                    key={plan.name}
                    className={`relative p-4 rounded-lg border space-y-3 ${
                      plan.current
                        ? 'border-accent bg-accent/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    {plan.current && (
                      <Badge className="absolute -top-2 right-3 bg-accent text-white text-xs">
                        Current
                      </Badge>
                    )}
                    <div>
                      <p className="text-lg font-bold">{plan.name}</p>
                      <p className="text-2xl font-bold">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Upgrade
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No payment method on file</p>
                    <p className="text-xs text-muted-foreground">Add a payment method to upgrade your plan</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Add Card
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <CreditCard className="h-4 w-4 text-accent shrink-0" />
            <p className="text-xs text-muted-foreground">
              Billing will be enabled in a future update. All plans and pricing shown are illustrative.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
