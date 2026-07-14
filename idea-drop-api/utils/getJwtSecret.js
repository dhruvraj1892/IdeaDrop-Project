import dotenv from "dotenv";

dotenv.config();

//conver secret into uint8array
export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
