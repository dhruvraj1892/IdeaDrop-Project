import express from "express";
const router = express.Router();
import Idea from "../models/Idea.js";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

// @route GET /api/ideas
// @description Get all ideas
// @access public
// @query _limit (optional limit for ideas returned)
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit); //pega o url query param _limit
    const query = Idea.find().sort({ createdAt: -1 }); //pega as ideas ordenadas pela data de criação descendente
    if (!isNaN(limit)) {
      query.limit(limit);
    }
    const ideas = await query.exec();
    res.json(ideas);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route GET /api/ideas/:id
// @description Get single idea
// @access public
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //checa se id existe na BD
      res.status(404);
      throw new Error("Idea not found");
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    res.json(idea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route POST /api/ideas
// @description Create new idea
// @access private
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};
    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }
    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
            ? tags
            : [],
      user: req.user.id,
    });
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route DELETE /api/ideas/:id
// @description Delete single idea
// @access public
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //checa se id existe na BD
      res.status(404);
      throw new Error("Idea not found");
    }
    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    //check if user owns idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorize to delete this idea");
    }
    res.json({ message: "Idea deleted successfuly" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route PUT /api/ideas/:id
// @description Update single idea
// @access public
router.put("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //checa se id existe na BD
      res.status(404);
      throw new Error("Idea not found");
    }

    //checa dono da idea
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    //check if user owns idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorize to modify this idea");
    }

    const { title, summary, description, tags } = req.body || {};
    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }
    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    const updatedIdea = await idea.save();
    res.json({ updatedIdea, message: "Idea updated successfuly" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
