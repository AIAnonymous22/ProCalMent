export const mockUser = {
  id: "user_1",
  email: "admin@procurement.gov",
  name: "Sarah Chen",
  role: "ADMIN" as const,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUsers = [
  mockUser,
  { id: "user_2", email: "james@procurement.gov", name: "James Wright", role: "LEADER" as const, avatarUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "user_3", email: "maria@procurement.gov", name: "Maria Santos", role: "LEADER" as const, avatarUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "user_4", email: "david@procurement.gov", name: "David Kim", role: "MEMBER" as const, avatarUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "user_5", email: "emily@procurement.gov", name: "Emily Nguyen", role: "MEMBER" as const, avatarUrl: null, createdAt: new Date(), updatedAt: new Date() },
];

export const mockMeetings = [
  { id: "evt_1", title: "Q2 Budget Review", startTime: new Date(Date.now() + 2 * 3600000), endTime: new Date(Date.now() + 3 * 3600000), category: "MEETING", location: "Conf Room A", attendees: ["Sarah Chen", "James Wright"] },
  { id: "evt_2", title: "Vendor Evaluation", startTime: new Date(Date.now() + 5 * 3600000), endTime: new Date(Date.now() + 6 * 3600000), category: "REVIEW", location: "Virtual", attendees: ["Maria Santos", "David Kim"] },
  { id: "evt_3", title: "Team Standup", startTime: new Date(Date.now() + 8 * 3600000), endTime: new Date(Date.now() + 8.5 * 3600000), category: "MEETING", location: "Conf Room B", attendees: ["All Leadership"] },
];

export const mockTasks = [
  { id: "task_1", title: "Review RFP for cloud services", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: new Date(Date.now() + 2 * 86400000), owner: "Sarah Chen", createdBy: "James Wright" },
  { id: "task_2", title: "Finalize vendor contracts", status: "TODO" as const, priority: "URGENT" as const, dueDate: new Date(Date.now() + 1 * 86400000), owner: "James Wright", createdBy: "Sarah Chen" },
  { id: "task_3", title: "Update procurement policy doc", status: "IN_REVIEW" as const, priority: "MEDIUM" as const, dueDate: new Date(Date.now() + 5 * 86400000), owner: "Maria Santos", createdBy: "Sarah Chen" },
  { id: "task_4", title: "Prepare Q2 spend analysis", status: "BACKLOG" as const, priority: "LOW" as const, dueDate: new Date(Date.now() + 14 * 86400000), owner: "David Kim", createdBy: "James Wright" },
  { id: "task_5", title: "Approve new supplier onboarding", status: "TODO" as const, priority: "HIGH" as const, dueDate: new Date(Date.now() + 3 * 86400000), owner: "Emily Nguyen", createdBy: "Maria Santos" },
  { id: "task_6", title: "Schedule stakeholder interviews", status: "DONE" as const, priority: "MEDIUM" as const, dueDate: new Date(Date.now() - 1 * 86400000), owner: "Sarah Chen", createdBy: "Sarah Chen" },
  { id: "task_7", title: "Draft sustainability requirements", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, dueDate: new Date(Date.now() + 7 * 86400000), owner: "Emily Nguyen", createdBy: "James Wright" },
  { id: "task_8", title: "Audit existing contracts", status: "TODO" as const, priority: "HIGH" as const, dueDate: new Date(Date.now() + 4 * 86400000), owner: "David Kim", createdBy: "Sarah Chen" },
];

export const mockMessages = [
  { id: "msg_1", content: "Hey team, the new vendor shortlist is ready for review. Please take a look before EOD.", author: "Sarah Chen", channel: "general", createdAt: new Date(Date.now() - 1800000), replies: 3 },
  { id: "msg_2", content: "Updated the procurement timeline. Q2 deadlines shifted by one week.", author: "James Wright", channel: "general", createdAt: new Date(Date.now() - 3600000), replies: 1 },
  { id: "msg_3", content: "Can someone review the compliance checklist? I've added new items for the audit.", author: "Maria Santos", channel: "general", createdAt: new Date(Date.now() - 7200000), replies: 5 },
  { id: "msg_4", content: "Reminder: budget approval meeting tomorrow at 10 AM. Bring your department summaries.", author: "David Kim", channel: "general", createdAt: new Date(Date.now() - 14400000), replies: 0 },
];

export const mockCalendarEvents = [
  { id: "cal_1", title: "Q2 Budget Review", start: new Date(2026, 1, 16, 10, 0), end: new Date(2026, 1, 16, 11, 0), category: "MEETING" as const, location: "Conference Room A" },
  { id: "cal_2", title: "Vendor Evaluation Deadline", start: new Date(2026, 1, 18, 17, 0), end: new Date(2026, 1, 18, 17, 0), category: "DEADLINE" as const },
  { id: "cal_3", title: "Policy Review Workshop", start: new Date(2026, 1, 19, 14, 0), end: new Date(2026, 1, 19, 16, 0), category: "REVIEW" as const, location: "Virtual" },
  { id: "cal_4", title: "Leadership Offsite", start: new Date(2026, 1, 22, 9, 0), end: new Date(2026, 1, 22, 17, 0), category: "SOCIAL" as const, location: "Retreat Center" },
  { id: "cal_5", title: "Compliance Audit Prep", start: new Date(2026, 1, 14, 10, 0), end: new Date(2026, 1, 14, 12, 0), category: "REVIEW" as const, location: "Room 302" },
  { id: "cal_6", title: "Daily Standup", start: new Date(2026, 1, 13, 9, 0), end: new Date(2026, 1, 13, 9, 30), category: "MEETING" as const, location: "Virtual" },
  { id: "cal_7", title: "Contract Signing - Acme Corp", start: new Date(2026, 1, 17, 15, 0), end: new Date(2026, 1, 17, 16, 0), category: "DEADLINE" as const, location: "Legal Office" },
  { id: "cal_8", title: "Team Building Lunch", start: new Date(2026, 1, 20, 12, 0), end: new Date(2026, 1, 20, 13, 30), category: "SOCIAL" as const, location: "The Grove Restaurant" },
];

export const mockDocuments = [
  { id: "doc_1", title: "Q1 2026 Procurement Report", description: "Quarterly procurement spending and analysis", fileUrl: "#", fileSize: 2400000, mimeType: "application/pdf", folder: "Reports", tags: ["quarterly", "finance"], uploadedBy: "Sarah Chen", createdAt: new Date(Date.now() - 7 * 86400000) },
  { id: "doc_2", title: "Vendor Evaluation Matrix", description: "Scoring criteria for vendor assessment", fileUrl: "#", fileSize: 450000, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", folder: "Templates", tags: ["vendor", "evaluation"], uploadedBy: "James Wright", createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: "doc_3", title: "Procurement Policy v2.3", description: "Updated procurement policies and procedures", fileUrl: "#", fileSize: 1200000, mimeType: "application/pdf", folder: "Policies", tags: ["policy", "compliance"], uploadedBy: "Maria Santos", createdAt: new Date(Date.now() - 14 * 86400000) },
  { id: "doc_4", title: "Sustainability Guidelines", description: "Environmental procurement standards", fileUrl: "#", fileSize: 800000, mimeType: "application/pdf", folder: "Policies", tags: ["sustainability", "compliance"], uploadedBy: "Emily Nguyen", createdAt: new Date(Date.now() - 5 * 86400000) },
  { id: "doc_5", title: "Budget Template FY2026", description: "Department budget planning template", fileUrl: "#", fileSize: 350000, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", folder: "Templates", tags: ["budget", "template"], uploadedBy: "David Kim", createdAt: new Date(Date.now() - 10 * 86400000) },
  { id: "doc_6", title: "Meeting Notes - Leadership Sync", description: "Notes from Feb 10 sync meeting", fileUrl: "#", fileSize: 120000, mimeType: "application/pdf", folder: "Meeting Notes", tags: ["meetings", "notes"], uploadedBy: "Sarah Chen", createdAt: new Date(Date.now() - 3 * 86400000) },
];

export const mockFolders = [
  { id: "folder_1", name: "Reports", documentCount: 12, parentId: null },
  { id: "folder_2", name: "Templates", documentCount: 8, parentId: null },
  { id: "folder_3", name: "Policies", documentCount: 15, parentId: null },
  { id: "folder_4", name: "Meeting Notes", documentCount: 23, parentId: null },
  { id: "folder_5", name: "Contracts", documentCount: 6, parentId: null },
];
