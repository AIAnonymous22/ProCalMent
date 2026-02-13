import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@procurement.gov";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345678";
  const adminName = process.env.ADMIN_NAME || "Sarah Chen";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create initial invite codes
  const inviteCount = parseInt(process.env.INITIAL_INVITE_COUNT || "5", 10);
  const codes: string[] = [];

  for (let i = 0; i < inviteCount; i++) {
    const code = uuidv4().split("-")[0].toUpperCase();
    await prisma.inviteCode.create({
      data: {
        code,
        createdById: admin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
    codes.push(code);
  }

  console.log(`\n✅ Created ${inviteCount} invite codes:\n`);
  codes.forEach((code, i) => console.log(`   ${i + 1}. ${code}`));

  // Create default channel
  await prisma.channel.upsert({
    where: { name: "general" },
    update: {},
    create: {
      name: "general",
      description: "Main leadership channel",
    },
  });

  // Create additional channels
  const channels = [
    { name: "procurement", description: "Procurement updates and discussions" },
    { name: "strategy", description: "Strategic planning and initiatives" },
    { name: "vendors", description: "Vendor management and evaluations" },
  ];

  for (const ch of channels) {
    await prisma.channel.upsert({
      where: { name: ch.name },
      update: {},
      create: ch,
    });
  }

  console.log(`\n✅ Channels created: general, procurement, strategy, vendors`);

  // Create default folders
  const folders = ["Reports", "Templates", "Policies", "Meeting Notes", "Contracts"];
  for (const name of folders) {
    await prisma.folder.create({ data: { name } }).catch(() => {});
  }

  console.log(`✅ Document folders created: ${folders.join(", ")}`);
  console.log("\n🎉 Seeding complete!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
