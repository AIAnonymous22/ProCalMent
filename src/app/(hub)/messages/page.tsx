"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassAvatar } from "@/components/ui/glass-avatar";
import { GlassBadge } from "@/components/ui/glass-badge";
import { mockMessages, mockUser, mockUsers } from "@/lib/mock-data";
import { format } from "date-fns";

interface ThreadMessage {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

const mockThreads: Record<string, ThreadMessage[]> = {
  msg_1: [
    { id: "r1_1", content: "Great, I will review it right after the standup.", author: "James Wright", createdAt: new Date(Date.now() - 1500000) },
    { id: "r1_2", content: "Added my comments on the Acme Corp section.", author: "Maria Santos", createdAt: new Date(Date.now() - 1200000) },
    { id: "r1_3", content: "Thanks team! Let's finalize by 3 PM.", author: "Sarah Chen", createdAt: new Date(Date.now() - 600000) },
  ],
  msg_2: [
    { id: "r2_1", content: "Got it, updating my project plans accordingly.", author: "Emily Nguyen", createdAt: new Date(Date.now() - 3000000) },
  ],
  msg_3: [
    { id: "r3_1", content: "I will take Section A.", author: "David Kim", createdAt: new Date(Date.now() - 6000000) },
    { id: "r3_2", content: "Section B is done on my end.", author: "James Wright", createdAt: new Date(Date.now() - 5400000) },
    { id: "r3_3", content: "Should we schedule a walkthrough?", author: "Emily Nguyen", createdAt: new Date(Date.now() - 4800000) },
    { id: "r3_4", content: "Yes, I will send a calendar invite.", author: "Maria Santos", createdAt: new Date(Date.now() - 4200000) },
    { id: "r3_5", content: "Perfect, looking forward to it.", author: "Sarah Chen", createdAt: new Date(Date.now() - 3600000) },
  ],
};

const channels = [
  { id: "general", name: "General", description: "Main leadership channel", unread: 3 },
  { id: "procurement", name: "Procurement", description: "Procurement updates", unread: 0 },
  { id: "strategy", name: "Strategy", description: "Strategic planning", unread: 1 },
  { id: "vendors", name: "Vendors", description: "Vendor management", unread: 0 },
];

export default function MessagesPage() {
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newReply, setNewReply] = useState("");

  const currentChannel = channels.find((c) => c.id === selectedChannel);
  const threadMessages = selectedThread ? mockThreads[selectedThread] || [] : [];
  const selectedMsg = mockMessages.find((m) => m.id === selectedThread);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-white/50 mt-1">Team communication hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ minHeight: "calc(100vh - 240px)" }}>
        {/* Channels sidebar */}
        <GlassCard className="lg:col-span-3 p-4">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">
            Channels
          </h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => { setSelectedChannel(channel.id); setSelectedThread(null); }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${selectedChannel === channel.id ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"}
                `}
              >
                <span className="flex items-center gap-2">
                  <span className="text-white/30">#</span>
                  {channel.name}
                </span>
                {channel.unread > 0 && (
                  <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">
              Members
            </h3>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 px-2 py-1.5">
                  <div className="relative">
                    <GlassAvatar name={user.name} size="sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
                  </div>
                  <span className="text-sm text-white/70">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Messages area */}
        <GlassCard className="lg:col-span-5 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-white/40">#</span>
              <h2 className="font-semibold text-white">{currentChannel?.name}</h2>
            </div>
            <p className="text-xs text-white/40 mt-0.5">{currentChannel?.description}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`group rounded-xl p-3 transition-colors ${
                  selectedThread === msg.id ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <GlassAvatar name={msg.author} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{msg.author}</span>
                      <span className="text-xs text-white/30">{format(msg.createdAt, "h:mm a")}</span>
                    </div>
                    <p className="text-sm text-white/70 mt-1">{msg.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {msg.replies > 0 && (
                        <button
                          onClick={() => setSelectedThread(selectedThread === msg.id ? null : msg.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          {msg.replies} {msg.replies === 1 ? "reply" : "replies"} →
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedThread(msg.id)}
                        className="text-xs text-white/30 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewMessage("");
              }}
              className="flex items-center gap-2"
            >
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${currentChannel?.name}`}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
              <GlassButton type="submit" size="sm" disabled={!newMessage.trim()}>
                Send
              </GlassButton>
            </form>
          </div>
        </GlassCard>

        {/* Thread panel */}
        <GlassCard className="lg:col-span-4 flex flex-col">
          {selectedThread && selectedMsg ? (
            <>
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white text-sm">Thread</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {threadMessages.length + 1} messages
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Original message */}
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="flex items-start gap-3">
                    <GlassAvatar name={selectedMsg.author} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{selectedMsg.author}</span>
                        <span className="text-xs text-white/30">{format(selectedMsg.createdAt, "h:mm a")}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{selectedMsg.content}</p>
                    </div>
                  </div>
                </div>

                {/* Thread replies */}
                {threadMessages.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3 pl-2">
                    <GlassAvatar name={reply.author} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{reply.author}</span>
                        <span className="text-xs text-white/30">{format(reply.createdAt, "h:mm a")}</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewReply("");
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Reply to thread..."
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                  />
                  <GlassButton type="submit" size="sm" disabled={!newReply.trim()}>
                    Reply
                  </GlassButton>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm text-white/40">Select a message to view its thread</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
