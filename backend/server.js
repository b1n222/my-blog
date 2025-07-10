// backend/server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // auth.js를 잘 불러오고 있는지
import postRoutes from "./routes/posts.js"; // 새로 추가!

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어 순서 확인
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL], // 나중에 우리 리액트 앱 주소
    credentials: true, // ⭐️ 이 옵션이 반드시 true여야 쿠키를 주고받을 수 있음!
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB에 성공적으로 연결되었습니다."))
  .catch((err) => console.error(err));

// API 라우트 연결 확인
app.use("/api/auth", authRoutes); // 이 부분이
//
// 정확한지

app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is live!");
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
