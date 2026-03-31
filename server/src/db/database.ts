import mongoose from "mongoose";
export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    console.log(`Attempting to connect to DB with URI: ${uri}`);
    if (!uri) {
      throw new Error("MONGO_URI is missing");
    }
    await mongoose.connect(uri);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error(`DB Connection Failed: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure code
  }
};
export default connectDB;
