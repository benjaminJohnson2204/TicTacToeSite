const express = require("express");
const router = express.Router();

router.get("/waiting", (req, res) => {
    res.json({ Message : "You are waiting" });
});

module.exports = router