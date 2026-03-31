import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "@db/database";
import User from "@models/user/userModel";
import { UserRole } from "@models/user/userRoleEnum";
import bcrypt from "bcrypt";

dotenv.config({ path: "./.env" });

const adminSeed = async () => {
  const name = process.env.ADMIN_NAME || "Admin User";
  const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: UserRole.ADMIN,
    });
    await newUser.save();
    console.log(`Admin user created for ${email}`);
    return;
  }

  console.log(`Admin user already exists for ${email}`);
};

const runAdminSeed = async () => {
  try {
    await connectDB();
    await adminSeed();
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

void runAdminSeed();

export default adminSeed;
