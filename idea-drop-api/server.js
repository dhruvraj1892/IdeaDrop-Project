import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//arquivos de routes
import ideaRouter from "./routes/ideaRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

//BD em mongo
import connectDB from "./config/db.js";
import dns from 'dns';

// Change DNS
dns.setServers(['1.1.1.1', '8.8.8.8']);
dotenv.config(); //para ler arquivo .env

const app = express(); //para condigurar API
const PORT = process.env.PORT || 8000; //usar variável de ambiente por segurança

//conecta com a BD em mongo
connectDB();

//CORS Config
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
); //middleware para evitar problemas do UI ser em um servidor e API em outro
app.use(express.json()); //para vir o body de requests
app.use(express.urlencoded({ extended: true })); //para receber url encoded
app.use(cookieParser()); //para gerenciar cookies

//routes
app.use("/api/ideas", ideaRouter);
app.use("/api/auth", authRouter);

//Not found treatment
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});
//gerenciamento de erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
