const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { requireAuth } = require('../auth');
const { asyncHandler } = require("./utils");
const { Question } = db;
const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll();
    res.render("questions", { questions });
  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const question = await Question.findByPk(questionId);

    console.log(question.views);
    question.views++;
    question.save();
    res.render("questionsContent", { question });
  })
);

router.get(
  "/newQuestion",
    requireAuth,
  asyncHandler(async (req, res) => {
    res.render("questionForm");
  })
);

router.post(
  "/newQuestion",
    requireAuth,
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const { userId } = req.session.auth;
    await Question.create({
      title,
      content,
      userId,
    });
    res.redirect("/questions");
  })
);

module.exports = router;
