import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MessageSquare, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function ScheduleConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredTime: '',
    timeZone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Consultation request:', formData);
    
    setIsSubmitted(true);
    toast({
      title: "Consultation Requested",
      description: "We'll contact you within 24 hours to schedule your strategy session.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-4xl font-bold text-foreground">Request Received!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your interest in a consultation. We'll review your request and contact you within 24 hours.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">Our team will review your business profile and exit goals</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">We'll contact you to schedule a 60-minute strategy session</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">Together, we'll develop your personalized exit roadmap</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/portal" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Portal Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Schedule Your Exit Strategy Consultation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Let's discuss your personalized exit strategy and how to maximize your business value
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consultation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Request a Consultation
            </CardTitle>
            <CardDescription>
              Fill out this form and we'll contact you within 24 hours to schedule your session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select onValueChange={(value) => handleInputChange('timeZone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific (PST/PDT)</SelectItem>
                      <SelectItem value="MST">Mountain (MST/MDT)</SelectItem>
                      <SelectItem value="CST">Central (CST/CDT)</SelectItem>
                      <SelectItem value="EST">Eastern (EST/EDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your business, exit timeline, or any specific questions you have..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Request Consultation
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">60-Minute Strategy Session</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive review of your business and exit goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Personalized Exit Roadmap</h4>
                    <p className="text-sm text-muted-foreground">Custom timeline and action steps for your situation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Value Optimization Plan</h4>
                    <p className="text-sm text-muted-foreground">Specific strategies to maximize your sale price</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Next Steps & Resources</h4>
                    <p className="text-sm text-muted-foreground">Clear action items and supporting materials</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Questions We'll Cover
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• What's your business really worth today?</li>
                <li>• Which exit strategy fits your goals?</li>
                <li>• What improvements would maximize value?</li>
                <li>• How long should you plan for the process?</li>
                <li>• What are potential buyers looking for?</li>
                <li>• How can you minimize taxes and maximize proceeds?</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/portal/week-2/scenarios" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Scenario Planning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}