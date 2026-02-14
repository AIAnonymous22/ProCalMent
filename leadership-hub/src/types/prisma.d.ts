/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Stub type declarations for @prisma/client.
 * These are only needed when `prisma generate` has not been run.
 * After running `npx prisma generate`, the real types from .prisma/client
 * will take precedence and provide full type safety.
 */
declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
    user: any;
    session: any;
    inviteCode: any;
    channel: any;
    message: any;
    threadReply: any;
    event: any;
    eventAttendee: any;
    task: any;
    taskDependency: any;
    folder: any;
    document: any;
    tag: any;
    documentTag: any;
  }

  export type Role = "ADMIN" | "LEADER" | "MEMBER";
  export type EventCategory = "MEETING" | "DEADLINE" | "REVIEW" | "SOCIAL" | "OTHER";
  export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}
