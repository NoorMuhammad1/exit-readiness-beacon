
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

interface OwnershipSplit {
  id: string;
  name: string;
  percentage: number;
}

export const InterestDistributionCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(10000000);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [paymentFrequency, setPaymentFrequency] = useState<string>('quarterly');
  const [ownershipSplits, setOwnershipSplits] = useState<OwnershipSplit[]>([
    { id: '1', name: 'You (Seller)', percentage: 25 },
    { id: '2', name: 'PE Firm', percentage: 75 }
  ]);

  const calculations = useMemo(() => {
    const annualInterest = (purchasePrice * interestRate) / 100;
    const periodsPerYear = paymentFrequency === 'monthly' ? 12 : paymentFrequency === 'quarterly' ? 4 : 1;
    const interestPerPeriod = annualInterest / periodsPerYear;
    
    const distributions = ownershipSplits.map(split => ({
      ...split,
      amount: (interestPerPeriod * split.percentage) / 100
    }));

    return {
      annualInterest,
      interestPerPeriod,
      distributions,
      periodsPerYear
    };
  }, [purchasePrice, interestRate, paymentFrequency, ownershipSplits]);

  const updateOwnershipPercentage = (id: string, percentage: number) => {
    setOwnershipSplits(prev => 
      prev.map(split => 
        split.id === id ? { ...split, percentage } : split
      )
    );
  };

  const addOwnershipSplit = () => {
    const newId = (ownershipSplits.length + 1).toString();
    setOwnershipSplits(prev => [
      ...prev,
      { id: newId, name: `Owner ${newId}`, percentage: 0 }
    ]);
  };

  const removeOwnershipSplit = (id: string) => {
    if (ownershipSplits.length > 2) {
      setOwnershipSplits(prev => prev.filter(split => split.id !== id));
    }
  };

  const totalPercentage = ownershipSplits.reduce((sum, split) => sum + split.percentage, 0);
  const isValidPercentage = totalPercentage === 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Purchase Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="purchase-price" className="text-xs text-muted-foreground">
              Total acquisition amount
            </Label>
            <Input
              id="purchase-price"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Interest Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="interest-rate" className="text-xs text-muted-foreground">
              Annual percentage rate
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Payment Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="payment-frequency" className="text-xs text-muted-foreground">
              How often payments are made
            </Label>
            <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Ownership Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ownership Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ownershipSplits.map((split, index) => (
            <div key={split.id} className="flex items-center gap-3">
              <Input
                value={split.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setOwnershipSplits(prev => 
                    prev.map(s => s.id === split.id ? { ...s, name: newName } : s)
                  );
                }}
                className="flex-1"
                placeholder="Owner name"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={split.percentage}
                  onChange={(e) => updateOwnershipPercentage(split.id, Number(e.target.value))}
                  className="w-20"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              {ownershipSplits.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOwnershipSplit(split.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={addOwnershipSplit}>
              Add Owner
            </Button>
            <div className={`text-sm ${isValidPercentage ? 'text-success' : 'text-destructive'}`}>
              Total: {totalPercentage}% {!isValidPercentage && '(Must equal 100%)'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interest Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Interest:</span>
              <span className="font-semibold">{formatCurrency(calculations.annualInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Per {paymentFrequency.slice(0, -2)} Payment:</span>
              <span className="font-semibold">{formatCurrency(calculations.interestPerPeriod)}</span>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              Based on {formatCurrency(purchasePrice)} at {interestRate}% annual rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isValidPercentage ? (
              <div className="space-y-3">
                {calculations.distributions.map((dist) => (
                  <div key={dist.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{dist.name}</div>
                      <div className="text-xs text-muted-foreground">{dist.percentage}% ownership</div>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(dist.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Adjust ownership percentages to equal 100%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Schedule Preview */}
      {isValidPercentage && (
        <Card>
          <CardHeader>
            <CardTitle>Next 4 Payment Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Period</th>
                    <th className="text-right py-2">Total Interest</th>
                    {calculations.distributions.map(dist => (
                      <th key={dist.id} className="text-right py-2">{dist.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map(period => (
                    <tr key={period} className="border-b">
                      <td className="py-2">{paymentFrequency === 'monthly' ? `Month ${period}` : 
                                           paymentFrequency === 'quarterly' ? `Q${period}` : 
                                           `Year ${period}`}</td>
                      <td className="text-right">{formatCurrency(calculations.interestPerPeriod)}</td>
                      {calculations.distributions.map(dist => (
                        <td key={dist.id} className="text-right">
                          {formatCurrency(dist.amount)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
