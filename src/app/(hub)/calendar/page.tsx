"use client";

import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassModal } from "@/components/ui/glass-modal";
import { GlassInput } from "@/components/ui/glass-input";
import { mockCalendarEvents } from "@/lib/mock-data";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

const categoryColors: Record<string, { bg: string; text: string; badge: "info" | "danger" | "warning" | "success" | "default" }> = {
  MEETING: { bg: "bg-indigo-500/20", text: "text-indigo-300", badge: "info" },
  DEADLINE: { bg: "bg-red-500/20", text: "text-red-300", badge: "danger" },
  REVIEW: { bg: "bg-amber-500/20", text: "text-amber-300", badge: "warning" },
  SOCIAL: { bg: "bg-emerald-500/20", text: "text-emerald-300", badge: "success" },
  OTHER: { bg: "bg-slate-500/20", text: "text-slate-300", badge: "default" },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const filteredEvents = useMemo(() => {
    if (!filterCategory) return mockCalendarEvents;
    return mockCalendarEvents.filter((e) => e.category === filterCategory);
  }, [filterCategory]);

  const eventsForDate = (date: Date) =>
    filteredEvents.filter((e) => isSameDay(e.start, date));

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Calendar</h1>
          <p className="text-white/50 mt-1">Shared events and deadlines</p>
        </div>
        <GlassButton onClick={() => setShowNewEvent(true)}>+ New Event</GlassButton>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <GlassButton
          variant={filterCategory === null ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilterCategory(null)}
        >
          All
        </GlassButton>
        {Object.entries(categoryColors).map(([cat, colors]) => (
          <GlassButton
            key={cat}
            variant={filterCategory === cat ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
          >
            <span className={`w-2 h-2 rounded-full ${colors.bg.replace("/20", "")}`} />
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </GlassButton>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar grid */}
        <GlassCard className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <GlassButton variant="ghost" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              ← Prev
            </GlassButton>
            <h2 className="text-xl font-semibold text-white">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <GlassButton variant="ghost" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              Next →
            </GlassButton>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-white/40 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayEvents = eventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative min-h-[80px] p-2 rounded-xl text-left transition-all duration-200
                    ${!isSameMonth(day, currentDate) ? "opacity-30" : ""}
                    ${isToday(day) ? "ring-2 ring-indigo-400/50" : ""}
                    ${isSelected ? "bg-white/15 border border-white/20" : "hover:bg-white/5 border border-transparent"}
                  `}
                >
                  <span className={`text-sm font-medium ${isToday(day) ? "text-indigo-300" : "text-white/70"}`}>
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-[10px] truncate rounded px-1 py-0.5 ${categoryColors[evt.category].bg} ${categoryColors[evt.category].text}`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-white/40">+{dayEvents.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Side panel */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a day"}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-white/40">No events</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((evt) => (
                  <div key={evt.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{evt.title}</p>
                      <GlassBadge variant={categoryColors[evt.category].badge}>
                        {evt.category}
                      </GlassBadge>
                    </div>
                    <p className="text-xs text-white/40 mt-1">
                      {format(evt.start, "h:mm a")} – {format(evt.end, "h:mm a")}
                    </p>
                    {evt.location && (
                      <p className="text-xs text-white/30 mt-1">📍 {evt.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Upcoming</h3>
            <div className="space-y-2">
              {mockCalendarEvents
                .filter((e) => e.start >= new Date())
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 4)
                .map((evt) => (
                  <div key={evt.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${categoryColors[evt.category].bg.replace("/20", "")}`} />
                    <span className="text-white/70 truncate flex-1">{evt.title}</span>
                    <span className="text-white/30 text-xs">{format(evt.start, "MMM d")}</span>
                  </div>
                ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* New Event Modal */}
      <GlassModal open={showNewEvent} onClose={() => setShowNewEvent(false)} title="New Event">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowNewEvent(false); }}>
          <GlassInput label="Title" placeholder="Event title" required />
          <div className="grid grid-cols-2 gap-3">
            <GlassInput label="Start" type="datetime-local" required />
            <GlassInput label="End" type="datetime-local" required />
          </div>
          <GlassInput label="Location" placeholder="Conference room or virtual link" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Category</label>
            <select className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
              <option value="MEETING">Meeting</option>
              <option value="DEADLINE">Deadline</option>
              <option value="REVIEW">Review</option>
              <option value="SOCIAL">Social</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <GlassButton variant="ghost" type="button" onClick={() => setShowNewEvent(false)}>Cancel</GlassButton>
            <GlassButton type="submit">Create Event</GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
