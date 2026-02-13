/**
 * CLI tool to list all invite codes and their status.
 *
 * Usage: npx tsx scripts/list-invites.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const invites = await prisma.inviteCode.findMany({
    include: {
      createdBy: { select: { name: true } },
      redeemedBy: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`\n📋 Invite Codes (${invites.length} total)\n`);
  console.log("─".repeat(80));

  for (const inv of invites) {
    const expired = inv.expiresAt < new Date();
    const status = inv.redeemedById
      ? `✅ Redeemed by ${inv.redeemedBy?.name} (${inv.redeemedBy?.email})`
      : expired
      ? "❌ Expired"
      : "🟢 Available";

    console.log(`  Code:    ${inv.code}`);
    console.log(`  Status:  ${status}`);
    console.log(`  Created: ${inv.createdAt.toLocaleDateString()} by ${inv.createdBy.name}`);
    console.log(`  Expires: ${inv.expiresAt.toLocaleDateString()}`);
    console.log("─".repeat(80));
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
