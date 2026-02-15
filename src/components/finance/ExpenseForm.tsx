import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FinanceBranchFilter } from "./FinanceBranchFilter";

const EXPENSE_CATEGORIES = [
  { value: "cogs", label: "Cost of Goods Sold (COGS)" },
  { value: "salaries", label: "Salaries & Wages" },
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

interface ExpenseFormProps {
  onSaved: () => void;
}

export function ExpenseForm({ onSaved }: ExpenseFormProps) {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!branchId || !category || !amount) {
      toast.error("Please fill in Branch, Category, and Amount");
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("finance_expenses" as any).insert({
        branch_id: branchId,
        category,
        amount: parseFloat(amount),
        expense_date: expenseDate,
        description: description || null,
        created_by: user?.id || null,
      });
      if (error) throw error;
      toast.success("Expense added successfully");
      setCategory("");
      setAmount("");
      setDescription("");
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border-2 border-dashed border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 text-center font-medium text-sm" style={{ background: "linear-gradient(to right, #e5e7eb, white 40%, white 60%, #e5e7eb)" }}>
        Add Expense
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Branch</Label>
          <FinanceBranchFilter value={branchId} onChange={setBranchId} />
        </div>
        <div>
          <Label className="text-xs">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Amount (SAR)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-9" placeholder="0.00" />
        </div>
        <div>
          <Label className="text-xs">Date</Label>
          <Input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="h-9" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Description (optional)</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Notes..." />
        </div>
        <div className="col-span-2">
          <Button onClick={handleSave} disabled={saving} size="sm" className="w-full gap-1">
            <Plus className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Add Expense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
