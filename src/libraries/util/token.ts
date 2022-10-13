import jwt from "jsonwebtoken";
import config from "../../../config/config.json";

const createToken = async (payload: string | Buffer | object) => {
  return await jwt.sign(payload, config.secret, { expiresIn: "9h" });
};

const decodeToken = async (token: string, callback: any) => {
  return await jwt.verify(token, config.secret, callback);
};


export {createToken, decodeToken};