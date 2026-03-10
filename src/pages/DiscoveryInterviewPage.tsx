
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Target, AlertTriangle, TrendingUp, Shield, Lightbulb, Download, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface InterviewData {
  id: string;
  executiveName: string;
  role: string;
  department: string;
  interviewDate: string;
  responses: Record<string, string>;
}

export default function DiscoveryInterviewPage() {
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [currentInterview, setCurrentInterview] = useState<InterviewData>({
    id: '',
    executiveName: '',
    role: '',
    department: '',
    interviewDate: '',
    responses: {}
  });

  const handleResponseChange = (questionId: string, value: string) => {
    setCurrentInterview(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));
  };

  const handleSaveInterview = () => {
    if (!currentInterview.executiveName || !currentInterview.role) {
      toast.error('Please fill in executive name and role');
      return;
    }

    const interviewToSave: InterviewData = {
      ...currentInterview,
      id: currentInterview.id || Date.now().toString()
    };

    const existingIndex = interviews.findIndex(i => i.id === interviewToSave.id);
    if (existingIndex >= 0) {
      const updatedInterviews = [...interviews];
      updatedInterviews[existingIndex] = interviewToSave;
      setInterviews(updatedInterviews);
      toast.success('Interview updated successfully');
    } else {
      setInterviews(prev => [...prev, interviewToSave]);
      toast.success('Interview saved successfully');
    }
  };

  const handleStartNewInterview = () => {
    setCurrentInterview({
      id: '',
      executiveName: '',
      role: '',
      department: '',
      interviewDate: '',
      responses: {}
    });
    toast.success('Started new interview');
  };

  const handleExportInterviews = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalInterviews: interviews.length,
      interviews: interviews
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discovery-interviews-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Interviews exported successfully');
  };

  return (
    <div className="p-6">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Discovery Interview</h1>
              <p className="text-muted-foreground mt-2">
                Systematic interviews with your management team to uncover operational insights
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interview Setup */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Interview Details</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="executiveName">Executive Name</Label>
              <Input 
                id="executiveName"
                placeholder="John Smith"
                value={currentInterview.executiveName}
                onChange={(e) => setCurrentInterview({...currentInterview, executiveName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Role/Title</Label>
              <Input 
                id="role"
                placeholder="VP of Operations"
                value={currentInterview.role}
                onChange={(e) => setCurrentInterview({...currentInterview, role: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select 
                value={currentInterview.department}
                onValueChange={(value) => setCurrentInterview({...currentInterview, department: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="sales">Sales & Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="technology">Technology/IT</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="customer">Customer Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Input 
                id="interviewDate"
                type="date"
                value={currentInterview.interviewDate}
                onChange={(e) => setCurrentInterview({...currentInterview, interviewDate: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Discovery Questions */}
      <div className="space-y-6">
        
        {/* Section 1: Current State Assessment */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Current State Assessment</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="q1">1. What are the top 3 challenges in your department right now?</Label>
              <Textarea 
                id="q1"
                rows={4}
                placeholder="Be specific about operational, resource, or process challenges..."
                value={currentInterview.responses.q1 || ''}
                onChange={(e) => handleResponseChange('q1', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="q2">2. What's working well that we should preserve or expand?</Label>
              <Textarea 
                id="q2"
                rows={3}
                placeholder="Identify strengths and successful initiatives..."
                value={currentInterview.responses.q2 || ''}
                onChange={(e) => handleResponseChange('q2', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q3">3. Rate your department's current performance (1-10)</Label>
              <Select 
                value={currentInterview.responses.q3 || ''}
                onValueChange={(value) => handleResponseChange('q3', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} - {n <= 3 ? 'Critical Issues' : n <= 6 ? 'Needs Improvement' : n <= 8 ? 'Good' : 'Excellent'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Bottlenecks & Dependencies */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold">Bottlenecks & Dependencies</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="q4">4. What's the biggest bottleneck slowing your department down?</Label>
              <Textarea 
                id="q4"
                rows={3}
                placeholder="Identify specific processes, approvals, resources, or dependencies..."
                value={currentInterview.responses.q4 || ''}
                onChange={(e) => handleResponseChange('q4', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q5">5. What dependencies on other departments create friction?</Label>
              <Textarea 
                id="q5"
                rows={3}
                placeholder="Cross-functional issues, communication gaps, handoff problems..."
                value={currentInterview.responses.q5 || ''}
                onChange={(e) => handleResponseChange('q5', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q6">6. If you could eliminate one process or procedure, what would it be?</Label>
              <Textarea 
                id="q6"
                rows={3}
                placeholder="Identify redundant or low-value activities..."
                value={currentInterview.responses.q6 || ''}
                onChange={(e) => handleResponseChange('q6', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Growth Opportunities */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold">Growth Opportunities</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="q7">7. What untapped opportunities do you see in your area?</Label>
              <Textarea 
                id="q7"
                rows={3}
                placeholder="New markets, process improvements, technology, partnerships..."
                value={currentInterview.responses.q7 || ''}
                onChange={(e) => handleResponseChange('q7', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q8">8. What would you do with unlimited budget for 90 days?</Label>
              <Textarea 
                id="q8"
                rows={3}
                placeholder="Prioritize investments that would create lasting impact..."
                value={currentInterview.responses.q8 || ''}
                onChange={(e) => handleResponseChange('q8', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q9">9. What quick wins could we achieve in the next 30 days?</Label>
              <Textarea 
                id="q9"
                rows={3}
                placeholder="Low-hanging fruit that would boost morale or efficiency..."
                value={currentInterview.responses.q9 || ''}
                onChange={(e) => handleResponseChange('q9', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Risk Assessment */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold">Risk Assessment</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="q10">10. What keeps you up at night about the business?</Label>
              <Textarea 
                id="q10"
                rows={3}
                placeholder="Major risks, vulnerabilities, or concerns..."
                value={currentInterview.responses.q10 || ''}
                onChange={(e) => handleResponseChange('q10', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q11">11. What would happen if you left tomorrow?</Label>
              <Textarea 
                id="q11"
                rows={3}
                placeholder="Knowledge gaps, succession issues, documentation needs..."
                value={currentInterview.responses.q11 || ''}
                onChange={(e) => handleResponseChange('q11', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q12">12. What competitor moves worry you most?</Label>
              <Textarea 
                id="q12"
                rows={3}
                placeholder="Competitive threats and market dynamics..."
                value={currentInterview.responses.q12 || ''}
                onChange={(e) => handleResponseChange('q12', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Strategic Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold">Strategic Input</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="q13">13. If you were CEO, what would you change immediately?</Label>
              <Textarea 
                id="q13"
                rows={3}
                placeholder="Strategic pivots, cultural changes, structural adjustments..."
                value={currentInterview.responses.q13 || ''}
                onChange={(e) => handleResponseChange('q13', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q14">14. What's the company's biggest blind spot?</Label>
              <Textarea 
                id="q14"
                rows={3}
                placeholder="What leadership might not see or understand..."
                value={currentInterview.responses.q14 || ''}
                onChange={(e) => handleResponseChange('q14', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="q15">15. What would make this company more valuable to a buyer?</Label>
              <Textarea 
                id="q15"
                rows={3}
                placeholder="Specific improvements that would increase enterprise value..."
                value={currentInterview.responses.q15 || ''}
                onChange={(e) => handleResponseChange('q15', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button 
                onClick={handleSaveInterview}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Interview
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  handleSaveInterview();
                  handleStartNewInterview();
                }}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save & Start New Interview
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportInterviews}
                disabled={interviews.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Interviews
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Dashboard */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Interview Summary</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{interviews.length}</div>
                <div className="text-sm text-muted-foreground">Interviews Completed</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {interviews.reduce((count, interview) => {
                    const responses = Object.values(interview.responses).filter(r => r.trim().length > 0);
                    return count + responses.length;
                  }, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Responses</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {interviews.filter(i => Object.keys(i.responses).length >= 10).length}
                </div>
                <div className="text-sm text-muted-foreground">Complete Interviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
