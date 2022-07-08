const router = require("express").Router();
const { findUserByUsername, addUser } = require("./db/services/user");
const { addUserToGame, createGame, userInGame, joinRandomGame, findGameByID, insertSquare, switchTurns, checkForWinner, isSquareAvailable, checkForTie } = require("./db/services/game");

router.get("/login", async (req, res) => {
    if (req.query.username) {
        let user = await findUserByUsername(req.query.username);
        if (user) {
            res.cookie("username", user.username, {maxAge : 3600_000});
            res.cookie("userID", user._id.toString(), {maxAge : 3600_000});
            res.json({ "isNewUser" : false, "user" : user })
        } else {
            user = await addUser(req.query.username);
            res.cookie("username", user.username, {maxAge : 3600_000});
            res.cookie("userID", user._id.toString(), {maxAge : 3600_000});
            res.json({ "isNewUser" : true, "user" : user })
        }
    } else {
        res.json({ "error" : true });
    }
});

router.get("/create", async (req, res) => {
    let user = await findUserByUsername(req.cookies.username);
    let inGame = await userInGame(user._id);
    if (inGame) {
        res.json({ "error" : "already in game" });
    } else {
        let game = await createGame(user._id);
        if (game) {
            res.json({ "code" : game._id });
        } else {
            res.json({ "error" : "Could not create game" });
        }
    }
});

router.get("/random", async (req, res) => {
    let user = await findUserByUsername(req.cookies.username);
    let inGame = await userInGame(user._id);
    if (inGame) {
        res.json({ "error" : "already in game" });
    } else {
        let game = await joinRandomGame(user._id);
        if (game) {
            res.json({ "game" : game._id });
        } else {
            res.json({ "error" : "Could not create game" });
        }
    }
});

router.get("/code/:code", async (req, res) => {
    let user = await findUserByUsername(req.cookies.username);
    let inGame = await userInGame(user._id);
    if (inGame) {
        res.json({ "error" : "already in game" });
    } else {
        let game = await addUserToGame(req.params.code, user._id);
        if (game) {
            res.json({ "game" : game._id });
        } else {
            res.json({ "error" : "Could not create game" });
        }
    }
});

router.get("/logout", (req, res) => {
    try {
        res.clearCookie("username");
        res.json({ "result" : "success"});
    } catch (error) {
        console.error(error.message);
        res.json({ "result" : "error"});;
    }
});

module.exports = router;