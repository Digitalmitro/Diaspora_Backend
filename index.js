import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
dotenv.config();
connectDb();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/cms", cmsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 Welcome to Diaspora Server" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running at port http://localhost:${PORT}`);
});
