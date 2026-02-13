"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GlassBadge } from "@/components/ui/glass-badge";
import { GlassAvatar } from "@/components/ui/glass-avatar";
import { mockMeetings, mockTasks, mockMessages, mockUser } from "@/lib/mock-data";
import { format } from "date-fns";

const priorityVariant = {
  LOW: "default" as const,
  MEDIUM: "info" as const,
  HIGH: "warning" as const,
  URGENT: "danger" as const,
};

const statusColors: Record<string, string> = {
  BACKLOG: "bg-slate-400",
  TODO: "bg-blue-400",
  IN_PROGRESS: "bg-amber-400",
  IN_REVIEW: "bg-purple-400",
  DONE: "bg-emerald-400",
};

export default function DashboardPage() {
  const activeTasks = mockTasks.filter((t) => t.status !== "DONE");
  const urgentTasks = mockTasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {mockUser.name.split(" ")[0]}
        </h1>
        <p className="text-white/50 mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")} — Here is your overview.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Tasks", value: activeTasks.length, icon: "✅", color: "from-indigo-500/20 to-indigo-600/5" },
          { label: "Urgent Items", value: urgentTasks.length, icon: "🔥", color: "from-red-500/20 to-red-600/5" },
          { label: "Meetings Today", value: mockMeetings.length, icon: "📅", color: "from-purple-500/20 to-purple-600/5" },
          { label: "Unread Messages", value: mockMessages.length, icon: "💬", color: "from-emerald-500/20 to-emerald-600/5" },
        ].map((stat) => (
          <GlassCard key={stat.label} className={`p-5 bg-gradient-to-br ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Meetings */}
        <GlassCard className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📅</span> Today&apos;s Meetings
          </h2>
          <div className="space-y-3">
            {mockMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{meeting.title}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {format(meeting.startTime, "h:mm a")} – {format(meeting.endTime, "h:mm a")}
                    </p>
                  </div>
                  <GlassBadge variant={meeting.category === "REVIEW" ? "warning" : "info"}>
                    {meeting.category}
                  </GlassBadge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-white/30">📍 {meeting.location}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tasks Due Soon */}
        <GlassCard className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Tasks Due Soon
          </h2>
          <div className="space-y-3">
            {mockTasks
              .filter((t) => t.status !== "DONE")
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[task.status]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <GlassBadge variant={priorityVariant[task.priority]}>
                          {task.priority}
                        </GlassBadge>
                        <span className="text-xs text-white/40">
                          Due {format(task.dueDate, "MMM d")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <GlassAvatar name={task.owner} size="sm" />
                        <span className="text-xs text-white/50">{task.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>

        {/* Latest Messages */}
        <GlassCard className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>💬</span> Latest Messages
          </h2>
          <div className="space-y-3">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <GlassAvatar name={msg.author} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{msg.author}</p>
                      <span className="text-xs text-white/30">
                        {format(msg.createdAt, "h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{msg.content}</p>
                    {msg.replies > 0 && (
                      <p className="text-xs text-indigo-400 mt-2">
                        {msg.replies} {msg.replies === 1 ? "reply" : "replies"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
