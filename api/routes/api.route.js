const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../../middlewares/auth.middleware");
const {
	createCommentController,
	replyCommentPostController,
} = require("../controllers/comment.controller");
const {
	likeGetController,
	dislikeGetController,
} = require("../controllers/likeDislike.controller");
const { bookmarksGetController } = require("../controllers/bookmark.controller");

router.get("/ping", async (req, res) => {
	const stateMap = {
		0: "disconnected",
		1: "connected",
		2: "connecting",
		3: "disconnecting",
	};

	try {
		if (!mongoose.connection.db || mongoose.connection.readyState !== 1) {
			throw new Error("Database is not connected");
		}

		await mongoose.connection.db.admin().ping();

		return res.status(200).json({
			status: "ok",
			db: {
				state: stateMap[mongoose.connection.readyState] ?? "unknown",
				name: mongoose.connection.name ?? null,
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Database ping failed:", error);
		return res.status(503).json({
			status: "error",
			db: {
				state: "disconnected",
				name: mongoose.connection.name ?? null,
			},
			timestamp: new Date().toISOString(),
		});
	}
});

router.post("/comments/:postId", isAuthenticated, createCommentController);
router.post("/comments/replies/:commentId", isAuthenticated, replyCommentPostController);

router.get("/like/:postId", isAuthenticated, likeGetController);
router.get("/dislike/:postId", isAuthenticated, dislikeGetController);

router.get("/bookmarks/:postId", isAuthenticated, bookmarksGetController);

module.exports = router;
