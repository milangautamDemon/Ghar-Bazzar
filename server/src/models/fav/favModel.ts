import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  propertyId: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});
const Favourite = mongoose.model("Favourite", favSchema);

export default Favourite;
