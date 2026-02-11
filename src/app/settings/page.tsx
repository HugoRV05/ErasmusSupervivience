"use client";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { PageShell } from "@/components/layout/PageShell";
import { AnimatedPage } from "@/components/layout/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Upload, Trash2, Plus, Edit2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppData } from "@/types";
import { Mascot } from "@/components/ui/Mascot";

export default function SettingsPage() {
  const {
    exportData, importData, resetAllData,
    expenseCategories, addExpenseCategory, updateExpenseCategory, deleteExpenseCategory,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editCat, setEditCat] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("📝");
  const [catColor, setCatColor] = useState("#6366f1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erasmus-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data: AppData = JSON.parse(ev.target?.result as string);
        importData(data);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
      return;
    }
    resetAllData();
    setResetConfirm(false);
  };

  const handleAddCategory = () => {
    if (!catName.trim()) return;
    addExpenseCategory({ name: catName.trim(), emoji: catEmoji, color: catColor });
    setCatName(""); setCatEmoji("📝"); setCatColor("#6366f1");
    setCatDialogOpen(false);
  };

  const handleUpdateCategory = () => {
    if (!editCat || !catName.trim()) return;
    updateExpenseCategory({ id: editCat, name: catName.trim(), emoji: catEmoji, color: catColor });
    setEditCat(null); setCatName(""); setCatEmoji("📝"); setCatColor("#6366f1");
  };

  const startEditCat = (id: string) => {
    const cat = expenseCategories.find((c) => c.id === id);
    if (!cat) return;
    setEditCat(id);
    setCatName(cat.name);
    setCatEmoji(cat.emoji);
    setCatColor(cat.color);
  };

  const PRESET_COLORS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
    "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6",
  ];

  if (!mounted) return null;

  return (
    <AnimatedPage>
      <PageShell title="Settings">
        <div className="space-y-6">
          {/* Expense Categories */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Expense Categories
              </h2>
              <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-sm">
                  <DialogHeader>
                    <DialogTitle>New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-3">
                      <Input
                        value={catEmoji}
                        onChange={(e) => setCatEmoji(e.target.value)}
                        className="w-16 text-center text-xl rounded-xl"
                        maxLength={4}
                      />
                      <Input
                        placeholder="Category name"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="rounded-xl flex-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setCatColor(c)}
                            className={cn(
                              "h-7 w-7 rounded-full border-2 transition",
                              catColor === c ? "border-foreground scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleAddCategory} className="w-full rounded-xl" disabled={!catName.trim()}>
                      Create Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3"
                >
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-lg">{cat.emoji}</span>
                  {editCat === cat.id ? (
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        value={catEmoji}
                        onChange={(e) => setCatEmoji(e.target.value)}
                        className="w-12 text-center rounded-lg"
                        maxLength={4}
                      />
                      <Input
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="rounded-lg flex-1"
                      />
                      <div className="flex gap-1">
                        {PRESET_COLORS.slice(0, 4).map((c) => (
                          <button
                            key={c}
                            onClick={() => setCatColor(c)}
                            className={cn(
                              "h-5 w-5 rounded-full border",
                              catColor === c ? "border-foreground" : "border-transparent"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <Button size="sm" onClick={handleUpdateCategory} className="rounded-lg text-xs">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium">{cat.name}</span>
                      <button onClick={() => startEditCat(cat.id)} className="p-1 text-muted-foreground hover:text-foreground">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteExpenseCategory(cat.id)} className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Data Management */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <Mascot size={80} pose="thinking" />
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Data Management
                </h2>
                <p className="text-xs text-muted-foreground">
                  Backup your survival data or restore from a file.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full justify-start gap-3 h-12 rounded-xl"
              >
                <Download className="h-4 w-4" />
                Export Backup (.json)
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className={cn(
                  "w-full justify-start gap-3 h-12 rounded-xl",
                  importSuccess && "border-green-500 text-green-500"
                )}
              >
                <Upload className="h-4 w-4" />
                {importSuccess ? "✓ Data imported!" : "Import Backup"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />

              <Button
                onClick={handleReset}
                variant={resetConfirm ? "destructive" : "outline"}
                className="w-full justify-start gap-3 h-12 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
                {resetConfirm ? "Tap again to confirm reset" : "Reset All Data"}
              </Button>
            </div>
          </section>

          {/* App Info */}
          <section className="text-center pb-8">
            <p className="text-xs text-muted-foreground">
              Erasmus Survival v1.0 • Made with ❤️
            </p>
          </section>
        </div>
      </PageShell>
    </AnimatedPage>
  );
}
