import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE = "leadership_hub_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: string) {
  const session = await prisma.session.create({
    data: {
      id: uuidv4(),
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE / 1000,
    path: "/",
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE);
  }
}
