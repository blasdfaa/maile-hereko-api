import UserModel from "../model/UserModel.js";

export const findUser = async (query) => {
  return UserModel.findOne(query).lean();
};
