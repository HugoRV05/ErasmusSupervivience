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
import { DynamicIcon } from "@/components/ui/DynamicIcon";

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
  const [catIcon, setCatIcon] = useState("LayoutGrid");
  const [catEmoji, setCatEmoji] = useState("🏷️");
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
    addExpenseCategory({ name: catName.trim(), icon: catIcon, emoji: catEmoji, color: catColor });
    setCatName(""); setCatIcon("LayoutGrid"); setCatEmoji("🏷️"); setCatColor("#6366f1");
    setCatDialogOpen(false);
  };

  const handleUpdateCategory = () => {
    if (!editCat || !catName.trim()) return;
    updateExpenseCategory({ id: editCat, name: catName.trim(), icon: catIcon, emoji: catEmoji, color: catColor });
    setEditCat(null); setCatName(""); setCatIcon("LayoutGrid"); setCatEmoji("🏷️"); setCatColor("#6366f1");
  };

  const startEditCat = (id: string) => {
    const cat = expenseCategories.find((c) => c.id === id);
    if (!cat) return;
    setEditCat(id);
    setCatName(cat.name);
    setCatIcon(cat.icon);
    setCatEmoji(cat.emoji || "🏷️");
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
                    <div className="space-y-4 mt-6">
                      <div className="flex gap-3">
                        <Input
                          placeholder="🏷️"
                          value={catEmoji}
                          onChange={(e) => setCatEmoji(e.target.value)}
                          className="w-16 rounded-xl text-center text-lg h-12"
                        />
                        <Input
                          placeholder="Category name"
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="rounded-xl flex-1 h-12"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Icon (Lucide)"
                          value={catIcon}
                          onChange={(e) => setCatIcon(e.target.value)}
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

            <div className="grid grid-cols-1 gap-3">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-4 shadow-sm group transition-all hover:border-primary/30"
                >
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative" style={{ backgroundColor: `${cat.color}20` }}>
                    <div className="absolute inset-0 rounded-xl border border-white/10" />
                    <DynamicIcon name={cat.icon || "Tag"} size={22} style={{ color: cat.color }} className="opacity-40" />
                    <span className="absolute text-xl">{cat.emoji || "🏷️"}</span>
                  </div>
                  
                  {editCat === cat.id ? (
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={catEmoji}
                          onChange={(e) => setCatEmoji(e.target.value)}
                          className="w-12 rounded-lg text-center p-0"
                        />
                        <Input
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="rounded-lg flex-1 h-9"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {PRESET_COLORS.slice(0, 5).map((c) => (
                            <button
                              key={c}
                              onClick={() => setCatColor(c)}
                              className={cn(
                                "h-5 w-5 rounded-full border border-white/20",
                                catColor === c && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                              )}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <Button size="sm" onClick={handleUpdateCategory} className="rounded-lg h-8 px-4 text-xs">
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{cat.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight opacity-60">{cat.icon}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEditCat(cat.id)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteExpenseCategory(cat.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Data Management */}
          <section className="bg-card/60 backdrop-blur-md rounded-3xl p-5 border border-border/50 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col items-center text-center mb-6">
              <Mascot size={100} pose="settings" className="mb-4" />
              <div>
                <h2 className="text-lg font-bold tracking-tight mb-1 inline-flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" /> Data & Customization
                </h2>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Backup your survival data or restore from a file.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="w-full justify-between px-5 h-14 rounded-2xl group transition-all hover:bg-primary/5 hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold">Export Backup</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">JSON</span>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className={cn(
                  "w-full justify-between px-5 h-14 rounded-2xl group transition-all",
                  importSuccess ? "border-green-500 bg-green-50/10" : "hover:bg-primary/5 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                    importSuccess ? "bg-green-500/20" : "bg-primary/10"
                  )}>
                    <Upload className={cn("h-5 w-5", importSuccess ? "text-green-500" : "text-primary")} />
                  </div>
                  <span className="font-semibold">{importSuccess ? "Data Imported!" : "Import Backup"}</span>
                </div>
                <span className="text-xs text-muted-foreground">JSON</span>
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
                className="w-full justify-between px-5 h-14 rounded-2xl group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                    resetConfirm ? "bg-white/20" : "bg-destructive/10"
                  )}>
                    <Trash2 className={cn("h-5 w-5", resetConfirm ? "text-white" : "text-destructive")} />
                  </div>
                  <span className="font-semibold">{resetConfirm ? "Confirm Clear?" : "Clear All Data"}</span>
                </div>
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
