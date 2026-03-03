import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Calendar, Shield } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What exactly should I expect from this $5,000 assessment?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Plain English Translation</span>: We translate complex legal and financial jargon into terms you actually understand
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Preparation Timeline</span>: We help you understand what needs to happen when, so you're not scrambling at the last minute
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Hidden Cost Awareness</span>: We explain the real costs coming your way - not just the obvious fees
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Post-Closing Reality</span>: We prepare you for what life actually looks like after the deal closes
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Process Guidance</span>: We explain what it means when lawyers, bankers, and buyers say certain things
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Cost-Benefit Mathematics</span>: We help you understand the real math behind decisions that could cost or save you millions
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm italic text-foreground-muted">
              This is educational preparation, not financial or legal advice - just founder-to-founder translation of what these deals actually mean.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "How confidential is this process?",
      answer: "Absolutely confidential. All participants sign mutual NDAs before any information is shared. We've worked with 100+ companies and have never had a confidentiality breach. Your sensitive business data is encrypted and stored securely, with access limited only to your dedicated assessment team."
    },
    {
      question: "What size companies do you typically work with?",
      answer: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Tuck-in/Rollup Transactions</span>: Companies valued between $400,000 - $1.5 million for strategic add-on acquisitions
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Equity Purchase Deals</span>: Companies valued between $5 million - $20 million for direct private equity acquisition
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm text-foreground-secondary">
              <span className="font-semibold">Timeline Expectations:</span> We work with sellers who have a 1-2 year coaching timeline or immediate sale readiness, with most maintaining a 1-3 year exit strategy. Private equity hold periods typically run 5-7 years until the second transaction.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "How is this different from hiring an investment banker?",
      answer: (
        <div className="space-y-4">
          <p className="font-semibold text-foreground">
            The difference between us and an investment banker is like comparing an apple to a screwdriver - they're not even remotely the same thing.
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Investment bankers are the true professionals</span> - if you've retained one, you need to listen to them. They live in a world of Excel sheets and data, using vernacular and phrases that most sellers don't completely understand.
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">We're here to help you find</span> what you've hidden in the corners or what others may be hiding from you. We focus on the nuts and bolts of a transaction and little things that can make a massive improvement on your sale strategy.
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">We're not the right fit for everybody</span>, but we've never seen a deal that we weren't able to assist in better positioning and posturing.
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border/30 bg-muted/30 p-3 rounded-md">
            <p className="text-sm text-foreground-secondary font-semibold">
              <span className="text-destructive">Important:</span> Under no circumstances are we giving legal advice or acting as investment bankers. We provide business optimization and preparation services only.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "What if I'm not ready to exit for 2-3 years?",
      answer: (
        <div className="space-y-4">
          <p className="font-semibold text-foreground">
            Perfect timing. This is exactly when you should be thinking about this - not when you're ready to exit.
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Transaction Timeline Reality:</span> After you sign a letter of intent, it's going to take anywhere from 5 to 11 months or longer to close the deal. Nobody's ever ready when they think they're ready.
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">The Planning Paradox:</span> This is about planning ahead and knowing that you could be ready for sale when you are actually ready to sell - not scrambling at the last minute.
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Post-Sale Employment Reality:</span> When you sell your business, they're commonly going to want you to stick around for 3 to 5 years. So if you're planning to be "ready" in five years, you're already a year late.
              </div>
            </div>
            
            <div className="flex gap-3">
              <span className="text-accent font-bold">•</span>
              <div>
                <span className="font-bold">Cost of Being Unprepared:</span> Not being prepared and not being ready costs hundreds of thousands of dollars on an average transaction. This assessment acts as insurance against these costly mistakes.
              </div>
            </div>
            
          </div>
          
          <div className="pt-3 border-t border-border/30 bg-accent/10 p-3 rounded-md">
            <p className="text-sm text-foreground-secondary font-semibold">
              <span className="text-accent">Bottom Line:</span> This is common sense business planning, not premature exit planning. The best time to prepare for a transaction is years before you need it.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "Do you guarantee results?",
      answer: (
        <div className="space-y-4">
          <p className="text-foreground font-semibold">
            Death and taxes - that's the only thing in life that's guaranteed.
          </p>
          
          <p className="text-foreground">
            We will work hard for you. We believe we will add value. We believe we will show you things that you don't already know - as long as you're open and vulnerable and willing to go through the process of understanding what these deals take.
          </p>
          
          <p className="text-foreground">
            Outside of that, there is no guarantee.
          </p>
          
          <div className="pt-3 border-t border-border/30 bg-accent/10 p-3 rounded-md">
            <p className="text-sm text-foreground-secondary font-semibold">
              What we <span className="text-accent">do</span> guarantee: Our commitment to working hard, providing honest assessment, and giving maximum effort to help you understand and navigate the complexities of these transactions.
            </p>
          </div>
        </div>
      )
    },
    {
      question: "What documents do I need to provide?",
      answer: (
        <div>
          <p className="mb-3">You don't actually need to provide anything upfront, but here's what we'd need to get started:</p>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li>Financial statements (3 years)</li>
            <li>P&L statements (3 years)</li>
            <li>Tax returns (3 years)</li>
          </ul>
          <p className="mb-2">We may also need:</p>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li>Org charts</li>
            <li>Customer data</li>
            <li>Operational metrics</li>
            <li>Management reports</li>
          </ul>
          <p>We'll provide a detailed checklist after our initial call.</p>
        </div>
      )
    }
  ];

  const contactOptions = [
    {
      icon: Calendar,
      title: "Schedule a Call",
      description: "15-minute intro call to discuss your situation",
      action: "Book Call",
      urgent: true
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <p className="text-foreground-secondary text-lg">
              Get answers to common questions about our PE Ready assessment process.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Accordion */}
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="glass-card border-border/50 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground-secondary leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              <Card className="glass-card border-border/50 sticky top-8 z-50 backdrop-blur-sm bg-background/95 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-accent" />
                    Still Have Questions?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border transition-luxury hover:border-accent/30 ${
                        option.urgent ? 'bg-accent/10 border-accent/20' : 'bg-background-hover border-border/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          option.urgent ? 'bg-accent/20' : 'bg-background-card'
                        }`}>
                          <option.icon className={`h-4 w-4 ${
                            option.urgent ? 'text-accent' : 'text-foreground-secondary'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm mb-1">
                            {option.title}
                          </h4>
                          <p className="text-foreground-secondary text-xs mb-3">
                            {option.description}
                          </p>
                          <Button 
                            size="sm" 
                            className={`w-full text-xs ${
                              option.urgent 
                                ? 'bg-accent hover:bg-accent/90 button-shadow' 
                                : 'bg-background-card hover:bg-background-hover border border-border/50'
                            }`}
                            onClick={() => window.open('https://calendly.com/your-username/15min', '_blank')}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                </CardContent>
              </Card>

              {/* Trust Signal */}
              <Card className="glass-card border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-2">24 Hour</div>
                  <div className="text-sm text-foreground-secondary mb-4">
                    Response guarantee for all inquiries
                  </div>
                  <div className="text-xs text-foreground-muted">
                    Confidential consultation • No sales pressure • Honest assessment
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;