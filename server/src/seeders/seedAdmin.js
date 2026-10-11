const bcrypt = require("bcrypt");
const User   = require("../users/users.schema.js");
const logger = require("../helpers/winston.helper.js");

// ── Default admin credentials ─────────────────────────────────────────
// Override via .env — never hardcode production credentials
async function seedAdmin() {
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail = process.env.ADMIN_EMAIL || (isProduction ? null : "admin@campus.com");
  const adminPassword = process.env.ADMIN_PASSWORD || (isProduction ? null : "Abcd@123");

  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the production environment.");
  }

  try {
    const adminFirstname = process.env.ADMIN_FIRSTNAME || "Campus";
    const adminLastname = process.env.ADMIN_LASTNAME || "Admin";

    // Check if admin already exists — don't duplicate
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      //logger.info(`Admin already exists: ${ADMIN_EMAIL}`);
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    await User.create({
      firstname: adminFirstname,
      lastname:  adminLastname,
      email:     adminEmail,
      password:  hashed,
      role:      "admin",
      isBlocked: false,
    });

    logger.info(` Admin account created: ${adminEmail}`);

  } catch (error) {
    logger.error("❌ Failed to seed admin:", error.message);
  }
}

module.exports = seedAdmin;