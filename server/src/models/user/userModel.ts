import mongoose from "mongoose";
import { UserRole } from "./userRoleEnum";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: UserRole.BUYER },
});
const User = mongoose.model("User", userSchema);

export default User;
