/**
 * First super admin for local/staging. Run: npm run db:seed
 *
 * Default email uses @mail.com (valid address). If you typed
 * "konik.superadmin.mail.com", the correct email form is below — override with
 * SEED_SUPERADMIN_EMAIL in .env if you need a different mailbox.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL =
  process.env.SEED_SUPERADMIN_EMAIL ?? "konik.superadmin@mail.com";
const PASSWORD =
  process.env.SEED_SUPERADMIN_PASSWORD ?? "Password@123";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    create: {
      email: EMAIL,
      name: "KONIK Super Admin",
      password: passwordHash,
      role: "USER",
      staffRole: "SUPER_ADMIN",
    },
    update: {
      password: passwordHash,
      staffRole: "SUPER_ADMIN",
      name: "KONIK Super Admin",
    },
  });

  console.log("[seed] Super admin upserted:", user.email);
  console.log("[seed] Sign in at /auth/staff/login then open /admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
