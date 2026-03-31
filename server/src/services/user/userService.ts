import User from "@models/user/userModel";

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export default { getUserById };
