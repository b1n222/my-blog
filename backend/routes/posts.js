import express from "express";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
    });
    const post = await newPost.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버오류");
  }
});

export default router;
