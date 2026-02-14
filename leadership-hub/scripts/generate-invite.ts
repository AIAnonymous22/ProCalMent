/**
 * CLI tool to generate invite codes.
 *
 * Usage:
 *   npx tsx scripts/generate-invite.ts [count] [--days <expiry_days>]
 *
 * Examples:
 *   npx tsx scripts/generate-invite.ts          # generates 1 code, 30-day expiry
 *   npx tsx scripts/generate-invite.ts 5        # generates 5 codes
 *   npx tsx scripts/generate-invite.ts 3 --days 7  # 3 codes, 7-day expiry
 */

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let count = 1;
  let expiryDays = 30;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--days" && args[i + 1]) {
      expiryDays = parseInt(args[i + 1], 10);
      i++;
    } else if (!isNaN(parseInt(args[i], 10))) {
      count = parseInt(args[i], 10);
    }
  }

  // Find an admin user to attribute the codes to
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("❌ No admin user found. Run `npx prisma db seed` first.");
    process.exit(1);
  }

  console.log(`\n🔑 Generating ${count} invite code(s) with ${expiryDays}-day expiry...\n`);

  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = `LH-${uuidv4().split("-").slice(0, 2).join("-").toUpperCase()}`;
    await prisma.inviteCode.create({
      data: {
        code,
        createdById: admin.id,
        expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
      },
    });
    codes.push(code);
  }

  console.log("Generated invite codes:\n");
  codes.forEach((code, i) => {
    console.log(`  ${i + 1}. ${code}`);
  });

  console.log(`\nExpires: ${new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
