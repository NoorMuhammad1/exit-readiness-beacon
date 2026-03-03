import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Target, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VehicleAssetTracker, { VehicleAsset } from "@/components/VehicleAssetTracker";

// Custom debounce hook to avoid lodash dependency
const useDebounce = (callback: () => void, delay: number, deps: any[]) => {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
};

// Custom add-back item interface
interface CustomItem {
  id: string;
  title: string;
  amount: number;
  notes: string;
  category: string;
}

const QuickWinsModule = {
  title: "Quick Wins Checklist",
  purpose: "Help founders identify and document the five most common, high-impact add-backs that can instantly boost EBITDA and valuation. Designed to drive early momentum in the PE Ready journey.",
  introContent: {
    hook: "What if I told you there's $500K+ hiding in your P&L right now — and PE buyers already know where to find it?",
    reality: "Most owners leave millions on the table by failing to document non-operating, discretionary, or one-time expenses that PE firms will normalize. This module shows you exactly where to look and how to prove it."
  },
  checklistItems: [
    {
      id: "owner-comp",
      title: "Owner Compensation Normalization",
      suggestedRange: [200000, 500000],
      description: "Document your total owner compensation vs. what you'd pay a market-rate CEO.",
      details: "Include W-2 salary, distributions, personal benefits, retirement contributions, car allowance, etc.",
      action: "Benchmark using Robert Half, Payscale, or BLS; attach comp study to this line item."
    },
    {
      id: "personal-vehicle",
      title: "Personal Vehicle & Travel",
      suggestedRange: [50000, 150000],
      description: "Remove all personal vehicle, travel, and insurance expenses from OpEx.",
      details: "Company-paid SUVs, family flights, personal fuel, etc.",
      action: "Estimate business-use %, upload vehicle log or credit card summary."
    },
    {
      id: "one-time-fees",
      title: "One-Time Professional Fees",
      suggestedRange: [75000, 200000],
      description: "Back out legal, consulting, or accounting fees that won't recur post-sale.",
      details: "Lawsuits, sale prep costs, unusual CPA projects",
      action: "Highlight line items from GL or P&L with short explanation."
    },
    {
      id: "family-payroll",
      title: "Family Member Payroll",
      suggestedRange: [100000, 300000],
      description: "Identify relatives on payroll who don't contribute to operations.",
      details: "Spouses, kids, siblings on staff for tax or legacy reasons",
      action: "List name, relationship, compensation, and actual duties performed."
    },
    {
      id: "discretionary",
      title: "Discretionary & Lifestyle Expenses",
      suggestedRange: [50000, 200000],
      description: "Strip out lifestyle-based spending that doesn't support operations.",
      details: "Country club, season tickets, charitable giving, personal subscriptions",
      action: "Review travel, meals, dues, and software categories. Flag & annotate."
    }
  ]
};

export default function QuickWinsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [multiple, setMultiple] = useState(5);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [vehicleAssets, setVehicleAssets] = useState<VehicleAsset[]>([]);

  const getMidpoint = (range: number[]) => Math.round((range[0] + range[1]) / 2);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  // Add custom item functions
  const addCustomItem = () => {
    const newItem: CustomItem = {
      id: `custom-${Date.now()}`,
      title: '',
      amount: 0,
      notes: '',
      category: 'Discretionary Personal'
    };
    setCustomItems(prev => [...prev, newItem]);
  };

  const updateCustomItem = (id: string, field: keyof CustomItem, value: string | number) => {
    setCustomItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  const saveProgress = async () => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("quick_wins_progress").upsert({
        user_id: user.id,
        completed_items: completedItems as any,
        values: values as any,
        notes: notes as any,
        multiple,
        custom_items: customItems as any,
        vehicle_assets: vehicleAssets as any,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (err) {
      toast.error("Failed to save progress");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Auto-save with debounce
  useDebounce(saveProgress, 1000, [completedItems, values, notes, multiple, customItems, vehicleAssets]);

  useEffect(() => {
    if (!user) return;
    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("quick_wins_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        const initialValues = Object.fromEntries(
          QuickWinsModule.checklistItems.map(item => [
            item.id,
            data?.values?.[item.id] ?? getMidpoint(item.suggestedRange)
          ])
        );
        
        setCompletedItems((data?.completed_items as string[]) || []);
        setNotes((data?.notes as Record<string, string>) || {});
        setValues(initialValues);
        setMultiple(data?.multiple || 5);
        setCustomItems((data?.custom_items as any as CustomItem[]) || []);
        setVehicleAssets((data?.vehicle_assets as any as VehicleAsset[]) || []);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  const toggleExpanded = (id: string) => 
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  
  const toggleCompleted = (id: string) => 
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  // Calculate totals
  const vehicleAssetsTotal = vehicleAssets.reduce((sum, asset) => sum + (asset.personalCost || 0), 0);
  const coreAddBacks = Object.values(values).reduce((sum, v) => sum + v, 0);
  const customAddBacks = customItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalAddBacks = coreAddBacks + customAddBacks + vehicleAssetsTotal;
  const valuationIncrease = totalAddBacks * multiple;
  const totalItems = QuickWinsModule.checklistItems.length + customItems.filter(item => item.title && item.amount > 0).length;
  const completedCoreItems = completedItems.length;
  const completedCustomItems = customItems.filter(item => item.title && item.amount > 0).length;
  const completionPercent = totalItems > 0 ? Math.round(((completedCoreItems + completedCustomItems) / totalItems) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{QuickWinsModule.title}</CardTitle>
          <CardDescription className="text-base">
            {QuickWinsModule.purpose}
          </CardDescription>
          <div className="pt-2">
            <p className="text-muted-foreground">{QuickWinsModule.introContent.reality}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Core Items */}
          {QuickWinsModule.checklistItems.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const isCompleted = completedItems.includes(item.id);
            const currentValue = values[item.id] || getMidpoint(item.suggestedRange);

            return (
              <Card
                key={item.id}
                className="bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleCompleted(item.id)}
                      className="mt-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      {isCompleted ? 
                        <CheckCircle2 className="h-5 w-5" /> : 
                        <Circle className="h-5 w-5" />
                      }
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Collapse</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Expand</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="ml-8 space-y-4 pt-2 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Details:</strong> {item.details}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Action Required:</strong> {item.action}
                        </p>
                      </div>
                     </div>

                     {/* Vehicle Asset Tracker for Personal Vehicle & Travel */}
                     {item.id === "personal-vehicle" && (
                       <div className="mt-6 pt-4 border-t border-border/50">
                         <VehicleAssetTracker 
                           vehicleAssets={vehicleAssets}
                           onUpdateAssets={setVehicleAssets}
                         />
                       </div>
                     )}
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Estimated Add-Back Amount
                        </label>
                        <Input
                          type="number"
                          value={currentValue}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              [item.id]: Number(e.target.value) || 0
                            })
                          }
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Suggested range: {formatCurrency(item.suggestedRange[0])} - {formatCurrency(item.suggestedRange[1])}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Implementation Notes
                        </label>
                        <Textarea
                          value={notes[item.id] || ""}
                          onChange={(e) =>
                            setNotes({
                              ...notes,
                              [item.id]: e.target.value
                            })
                          }
                          placeholder="Document your implementation approach..."
                          rows={3}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
            );
          })}

          {/* Custom Add-Backs Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Custom Add-Backs</h3>
              <Button
                onClick={addCustomItem}
                className="flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Custom Add-Back
              </Button>
            </div>

            {customItems.length > 0 && (
              <div className="space-y-4">
                {customItems.map((item) => (
                  <Card key={item.id} className="bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Title
                          </label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateCustomItem(item.id, 'title', e.target.value)}
                            placeholder="e.g., Horse Boarding"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <Select 
                            value={item.category} 
                            onValueChange={(value) => updateCustomItem(item.id, 'category', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Discretionary Personal">Discretionary Personal</SelectItem>
                              <SelectItem value="One-Time Events">One-Time Events</SelectItem>
                              <SelectItem value="Family/Personal">Family/Personal</SelectItem>
                              <SelectItem value="Professional Services">Professional Services</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Annual Amount
                          </label>
                          <Input
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => updateCustomItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={() => deleteCustomItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-1">
                          Notes
                        </label>
                        <Textarea
                          value={item.notes}
                          onChange={(e) => updateCustomItem(item.id, 'notes', e.target.value)}
                          placeholder="Additional details or justification..."
                          className="w-full"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {customItems.length === 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-2">No custom add-backs yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add items like horse boarding, boat maintenance, private school tuition, etc.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Impact Calculator Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm sticky top-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span>Impact Calculator</span>
              {saving && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
            </h3>
            
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium mb-2">
                  EBITDA Multiple
                </label>
                <Input
                  type="number"
                  value={multiple}
                  onChange={(e) => setMultiple(Number(e.target.value) || 5)}
                  min="1"
                  max="20"
                  step="0.1"
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Core Add-Backs:</span>
                  <span className="font-medium">{formatCurrency(coreAddBacks)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vehicle Assets:</span>
                  <span className="font-medium">{formatCurrency(vehicleAssetsTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Custom Add-Backs:</span>
                  <span className="font-medium">{formatCurrency(customAddBacks)}</span>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Add-Backs:</span>
                    <span className="font-bold">{formatCurrency(totalAddBacks)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Multiple:</span>
                  <span className="font-medium">{multiple}x</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-border/50 pt-3">
                  <span>Valuation Increase:</span>
                  <span className="text-primary">{formatCurrency(valuationIncrease)}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                   {completedCoreItems} core + {completedCustomItems} custom items completed
                 </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}