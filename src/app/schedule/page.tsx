"use client";

import { useState, useEffect } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash2, Check, MapPin, Clock } from "lucide-react";
import { cn, getTodayDayOfWeek } from "@/lib/utils";
import { DayOfWeek, ScheduleEvent } from "@/types";
import { EVENT_COLORS, REMINDER_CATEGORIES } from "@/lib/constants";
import { Mascot } from "@/components/ui/Mascot";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const {
    scheduleEvents, addScheduleEvent, deleteScheduleEvent,
    reminders, addReminder, toggleReminder, deleteReminder,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "reminders">("schedule");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayDayOfWeek() as DayOfWeek);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [addReminderOpen, setAddReminderOpen] = useState(false);

  // Event form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDay, setEventDay] = useState<DayOfWeek>(selectedDay);
  const [eventStart, setEventStart] = useState("09:00");
  const [eventEnd, setEventEnd] = useState("10:00");
  const [eventLocation, setEventLocation] = useState("");
  const [eventColor, setEventColor] = useState(EVENT_COLORS[0]);

  // Reminder form
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderCategory, setReminderCategory] = useState(REMINDER_CATEGORIES[0].label);
  const [reminderEmoji, setReminderEmoji] = useState(REMINDER_CATEGORIES[0].emoji);

  useEffect(() => setMounted(true), []);

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;
    addScheduleEvent({
      title: eventTitle.trim(),
      day: eventDay,
      startTime: eventStart,
      endTime: eventEnd,
      location: eventLocation.trim() || undefined,
      color: eventColor,
    });
    setEventTitle(""); setEventLocation("");
    setAddEventOpen(false);
  };

  const handleAddReminder = () => {
    if (!reminderTitle.trim()) return;
    addReminder({
      title: reminderTitle.trim(),
      date: reminderDate || new Date().toISOString().split("T")[0],
      category: reminderCategory,
      emoji: reminderEmoji,
    });
    setReminderTitle(""); setReminderDate("");
    setAddReminderOpen(false);
  };

  const dayEvents = scheduleEvents
    .filter((e) => e.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const today = getTodayDayOfWeek();

  if (!mounted) return null;

  return (
    <AnimatedPage>
      <PageShell title="Schedule" subtitle={today}>
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-5">
          {(["schedule", "reminders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border",
                activeTab === tab
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {tab === "schedule" ? "📚 Classes" : "📌 Reminders"}
            </button>
          ))}
        </div>

        {activeTab === "schedule" ? (
          <>
            {/* Day Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide mb-4">
              {DAYS.map((day) => {
                const hasEvents = scheduleEvents.some((e) => e.day === day);
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border",
                      selectedDay === day
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-card text-muted-foreground",
                      day === today && selectedDay !== day && "border-primary/30"
                    )}
                  >
                    <span>{day.slice(0, 3)}</span>
                    {hasEvents && (
                      <span className="mt-1 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="space-y-3 mb-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 items-start rounded-xl border border-border/50 bg-card p-4"
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.startTime} – {event.endTime}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteScheduleEvent(event.id)}
                    className="p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {dayEvents.length === 0 && (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                  <Mascot size={150} pose="happy" />
                  <p className="text-sm mt-4 font-medium">No classes on {selectedDay}</p>
                </div>
              )}
            </div>

            {/* Add Event */}
            <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full rounded-xl gap-2">
                  <Plus className="h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-sm max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Class name"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="rounded-xl"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Day</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS.map((d) => (
                        <button
                          key={d}
                          onClick={() => setEventDay(d)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                            eventDay === d
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          )}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Start</label>
                      <Input type="time" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">End</label>
                      <Input type="time" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="rounded-xl" />
                    </div>
                  </div>
                  <Input
                    placeholder="Location (optional)"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="rounded-xl"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Color</label>
                    <div className="flex gap-2">
                      {EVENT_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEventColor(c)}
                          className={cn(
                            "h-7 w-7 rounded-full border-2 transition",
                            eventColor === c ? "border-foreground scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddEvent} className="w-full rounded-xl" disabled={!eventTitle.trim()}>
                    Add Class
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            {/* Reminders */}
            <div className="space-y-2 mb-4">
              {reminders
                .sort((a, b) => Number(a.done) - Number(b.done))
                .map((rem) => (
                  <div
                    key={rem.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 transition-all",
                      rem.done ? "border-border/30 opacity-50" : "border-border/50 bg-card"
                    )}
                  >
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                        rem.done
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {rem.done && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <span className="text-lg">{rem.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", rem.done && "line-through text-muted-foreground")}>
                        {rem.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{rem.category} • {rem.date}</p>
                    </div>
                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

              {reminders.length === 0 && (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                  <Mascot size={150} pose="scholar" />
                  <p className="text-sm mt-4 font-medium">No reminders yet</p>
                </div>
              )}
            </div>

            {/* Add Reminder */}
            <Sheet open={addReminderOpen} onOpenChange={setAddReminderOpen}>
              <Button
                variant="outline"
                onClick={() => setAddReminderOpen(true)}
                className="w-full rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" /> Add Reminder
              </Button>
              <SheetContent side="bottom" className="rounded-t-3xl pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
                <SheetHeader>
                  <SheetTitle>New Reminder</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Reminder title"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="rounded-xl"
                  />
                  <Input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="rounded-xl"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {REMINDER_CATEGORIES.map((cat) => (
                        <button
                          key={cat.label}
                          onClick={() => { setReminderCategory(cat.label); setReminderEmoji(cat.emoji); }}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition",
                            reminderCategory === cat.label
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          )}
                        >
                          <span>{cat.emoji}</span> {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddReminder} className="w-full rounded-xl" disabled={!reminderTitle.trim()}>
                    Save Reminder
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </PageShell>
    </AnimatedPage>
  );
}
