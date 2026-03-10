
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TrendingDown, CreditCard, ArrowRight, DollarSign } from "lucide-react";
import { InterestDistributionCalculator } from "@/components/finance/InterestDistributionCalculator";

export default function DebtInterestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Debt & Interest Payments
        </h1>
        <p className="text-muted-foreground">
          Understanding how PE firms structure debt and create ongoing interest distributions
        </p>
      </div>

      <Alert className="bg-muted border-border">
        <AlertTitle className="text-foreground">Core Concept</AlertTitle>
        <AlertDescription className="text-foreground">
          Most PE firms treat the purchase price like a loan, creating interest payments that flow from 
          your operating company to the holding company where your ownership sits.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="concept" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="concept">The Concept</TabsTrigger>
          <TabsTrigger value="structure">How It Works</TabsTrigger>
          <TabsTrigger value="benefits">Tax Benefits</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="concept" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Understanding PE Debt Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-foreground">
                  Most private equity firms treat the purchase price like a loan when they acquire your company. 
                  This creates a debt structure that generates regular interest payments from the operating company 
                  to the holding company where your ownership stake resides.
                </p>
                
                <Alert>
                  <TrendingDown className="h-4 w-4" />
                  <AlertTitle>Key Misconception</AlertTitle>
                  <AlertDescription>
                    Many sellers think PE firms will dump money into growth immediately. In reality, 
                    they're more focused on debt service and returns. Growth funding must make financial sense for them.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">How It Works:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                    <li>Purchase price becomes debt on the operating company</li>
                    <li>Interest payments flow from OpCo to HoldCo</li>
                    <li>Payments typically made monthly, quarterly, or annually</li>
                    <li>Interest rates usually range from 6-12% annually</li>
                    <li>Distributions are pro rata based on ownership percentage</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Common Misconceptions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                    <li>PE will immediately fund major growth initiatives</li>
                    <li>All profits go toward reinvestment</li>
                    <li>Owners only get paid on exit or earnouts</li>
                    <li>PE firms use their own cash for acquisitions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Flow Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 border border-border p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-foreground mb-3">Typical Payment Flow:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-card border border-border rounded text-foreground">OpCo</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">$100k quarterly interest</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="px-2 py-1 bg-card border border-border rounded text-foreground">HoldCo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm ml-4">
                    <span className="px-2 py-1 bg-accent/20 border border-accent/40 rounded text-foreground">You (25%)</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">$25k distribution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm ml-4">
                    <span className="px-2 py-1 bg-accent/20 border border-accent/40 rounded text-foreground">PE (75%)</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">$75k distribution</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Payment Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                      <li><strong>Monthly:</strong> Steady cash flow, more admin</li>
                      <li><strong>Quarterly:</strong> Most common, balanced approach</li>
                      <li><strong>Annually:</strong> Larger payments, less frequent</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Interest Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                      <li><strong>6-8%:</strong> Conservative, stable businesses</li>
                      <li><strong>8-10%:</strong> Most common range</li>
                      <li><strong>10-12%:</strong> Higher risk or growth-focused</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tax Benefits & Advantages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">For the Operating Company:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                    <li>Interest payments are tax-deductible</li>
                    <li>Reduces corporate tax burden significantly</li>
                    <li>Improves after-tax cash flow</li>
                    <li>Creates legitimate business expense</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">For Owners:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                    <li>Regular income stream post-sale</li>
                    <li>Avoids dividend tax treatment</li>
                    <li>Predictable cash distributions</li>
                    <li>Independent of company performance</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <AlertTitle>Tax Example</AlertTitle>
                <AlertDescription>
                  On a $10M purchase with 8% interest: $800k annual interest is deductible to OpCo. 
                  At 25% tax rate, this saves $200k in corporate taxes annually.
                </AlertDescription>
              </Alert>

              <div className="bg-muted/50 border border-border p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-foreground mb-2">Key Advantages:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                  <li>Payments continue regardless of company performance</li>
                  <li>Separate from earnout or performance bonuses</li>
                  <li>Creates stable income for retired owners</li>
                  <li>Reduces overall tax burden on the transaction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interest Payment Calculator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Calculate your expected interest distributions based on purchase price, interest rate, and ownership percentage.
              </p>
            </CardHeader>
            <CardContent>
              <InterestDistributionCalculator />
            </CardContent>
          </Card>

          <Alert>
            <AlertTitle>Important Notes</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>• Interest payments are separate from any earnout or performance bonuses</p>
              <p>• These payments continue regardless of company performance</p>
              <p>• Your HoldCo must be structured to receive these distributions</p>
              <p>• Work with your tax advisor to optimize the structure for your situation</p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
