import { prisma } from "@/lib/db/prisma";

export async function subscribeDb(email: string, source?: string): Promise<{ email: string }> {
  const row = await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { unsubscribedAt: null, ...(source ? { source } : {}) },
    create: { email, source },
  });
  return { email: row.email };
}
