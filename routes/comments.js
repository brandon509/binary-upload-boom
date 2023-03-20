const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post('/new/:postId', ensureAuth, commentsController.newComment)
router.delete('/delete/:commentId', ensureAuth, commentsController.deleteComment)

module.exports = router