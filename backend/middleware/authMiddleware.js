import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "인증 토큰이 없어" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ message: "토큰이 유효하지 않습니다." });
  }
};

export default authMiddleware;
