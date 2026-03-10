
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ModuleProgress } from '@/components/ModuleProgress';

export default function IndustryMultiplesPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    industry: 'Technology',
    subcategory: 'All Subcategories',
    annualRevenue: 2500000,
    ebitda: 680000,
    ebitdaMargin: 27.2
  });

  const [valuation, setValuation] = useState({
    multiple: 8.7,
    enterpriseValue: 5925714,
    sizeRatio: 'Small (<$1M)'
  });

  // Industry multiples data
  const industryMultiples = {
    'Technology': {
      'All Subcategories': { low: 5.44, median: 8.7, high: 12.5 },
      'SaaS': { low: 6.2, median: 10.5, high: 18.0 },
      'Hardware': { low: 4.5, median: 7.2, high: 10.8 },
      'Services': { low: 5.0, median: 8.0, high: 11.5 }
    },
    'Healthcare': {
      'All Subcategories': { low: 4.8, median: 7.5, high: 11.2 },
      'Medical Devices': { low: 5.5, median: 8.8, high: 13.0 },
      'Services': { low: 4.2, median: 6.8, high: 9.5 }
    },
    'Manufacturing': {
      'All Subcategories': { low: 3.8, median: 6.2, high: 8.5 }
    },
    'Retail': {
      'All Subcategories': { low: 3.2, median: 5.8, high: 7.9 }
    },
    'Services': {
      'All Subcategories': { low: 4.1, median: 6.5, high: 9.2 }
    }
  };

  const calculateValuation = () => {
    const ebitdaValue = parseFloat(formData.ebitda.toString()) || 0;
    const multiple = industryMultiples[formData.industry]?.[formData.subcategory]?.median || 8.7;
    const enterpriseValue = ebitdaValue * multiple;
    
    let sizeRatio = 'Small (<$1M)';
    if (ebitdaValue >= 5000000) sizeRatio = 'Large (>$5M)';
    else if (ebitdaValue >= 1000000) sizeRatio = 'Medium ($1-5M)';
    
    setValuation({
      multiple,
      enterpriseValue,
      sizeRatio
    });
  };

  const handleIndustryChange = (industry: string) => {
    setFormData({
      ...formData, 
      industry, 
      subcategory: 'All Subcategories'
    });
    setTimeout(calculateValuation, 0);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData({...formData, subcategory});
    setTimeout(calculateValuation, 0);
  };

  const getSubcategories = (industry: string) => {
    const categories = industryMultiples[industry];
    if (!categories) return [];
    return Object.keys(categories);
  };

  React.useEffect(() => {
    calculateValuation();
  }, [formData]);

  return (
    <div className="min-h-screen p-6">
      <div>
        <ModuleProgress currentModule={5} />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Industry Multipliers & Valuation
          </h1>
          <p className="text-muted-foreground">
            Calculate your business value based on industry benchmarks and company characteristics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Valuation Constraints */}
            <Card className="bg-primary/10 border border-primary/30">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Valuation Constraints:</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No manual override of calculated multiples</li>
                  <li>• Based on current EBITDA only (no forecasts)</li>
                  <li>• All adjustments follow documented PE methodology</li>
                </ul>
              </CardContent>
            </Card>

            {/* Industry Selection */}
            <Card className="bg-card/50 border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  📊 Industry Selection
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Industry Category</label>
                  <select 
                    value={formData.industry}
                    onChange={(e) => handleIndustryChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                  >
                    {Object.keys(industryMultiples).map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Subcategory (Optional)</label>
                  <select 
                    value={formData.subcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground"
                  >
                    {getSubcategories(formData.industry).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card className="bg-card/50 border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">💰 Financial Metrics</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Annual Revenue</label>
                  <div className="text-2xl font-bold text-foreground">
                    ${formData.annualRevenue.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">EBITDA (Verified)</label>
                  <div className="text-2xl font-bold text-green-500">
                    ${formData.ebitda.toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">EBITDA Margin</label>
                  <div className="text-xl text-foreground">
                    {formData.ebitdaMargin}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Your Valuation */}
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Your Valuation</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Enterprise Value</div>
                  <div className="text-4xl font-bold text-foreground">
                    ${valuation.enterpriseValue.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span className="font-medium text-foreground">Below Market</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Your multiple is in the bottom quartile. 
                    Focus on improving recurring revenue and reducing customer concentration.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center border-t border-border pt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">EBITDA</div>
                    <div className="font-semibold text-foreground">${formData.ebitda.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Multiple</div>
                    <div className="font-semibold text-foreground">{valuation.multiple}x</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Size Band</div>
                    <div className="font-semibold text-foreground">{valuation.sizeRatio}</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => console.log('Export report')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>

            {/* Industry Comparison */}
            <Card className="bg-card/50 border border-border">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Industry Comparison</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Low (25th %ile)</span>
                    <span className="text-xl font-semibold text-foreground">
                      ${(formData.ebitda * (industryMultiples[formData.industry]?.[formData.subcategory]?.low || 5.44)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Median</span>
                    <span className="text-xl font-semibold text-foreground">
                      ${(formData.ebitda * (industryMultiples[formData.industry]?.[formData.subcategory]?.median || 8.7)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">High (75th %ile)</span>
                    <span className="text-xl font-semibold text-foreground">
                      ${(formData.ebitda * (industryMultiples[formData.industry]?.[formData.subcategory]?.high || 12.5)).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Visual indicator bar */}
                <div className="mt-4 relative h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-yellow-500 to-green-500"
                    style={{ width: '100%' }}
                  />
                  <div 
                    className="absolute top-0 h-full w-1 bg-foreground shadow-lg"
                    style={{ left: '25%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/portal/week-3/ebitda-calculator')}
            className="flex items-center gap-2"
          >
            ← Back to EBITDA Calculator
          </Button>
          <Button
            onClick={() => navigate('/portal/week-3/scenario-planning')}
            className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
          >
            Continue to Scenario Planning →
          </Button>
        </div>
      </div>
    </div>
  );
}
