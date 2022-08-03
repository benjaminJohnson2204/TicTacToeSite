const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const {
  findUserByUsername,
  addUser,
  findUserByID,
} = require("../db/services/user");
const {
  addUserToGame,
  createGame,
  userInGame,
  joinRandomGame,
  findGameByID,
  insertSquare,
  switchTurns,
  checkForWinner,
  isSquareAvailable,
  checkForTie,
  deleteGame,
  findGamesByUser,
} = require("../db/services/game");
const { Status } = require("../db/models/game");

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/invalid");
};

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/api/invalid" }),
  (req, res) => {
    res.cookie("isNewUser", false, { maxAge: 600_000 });
    res.json({ result: "success" });
  }
);

router.get("/invalid", (req, res) => {
  res.json({ result: "failure" });
});

router.post(
  "/register",
  async (req, res, next) => {
    if (req.body.password != req.body.confirm) {
      res.json({ error: "passwords don't match" });
      return;
    }
    const hash = bcrypt.hashSync(req.body.password, 12);
    let user = await findUserByUsername(req.body.username);
    if (user) {
      res.json({ error: "username already taken" });
      return;
    }
    let addedUser = await addUser(req.body.username, hash);
    if (addedUser) {
      req.login(addedUser, (error) => {
        if (error) {
          console.log(error);
          return next(error);
        }
        return next(null, addedUser);
      });
    } else {
      res.json({ error: "could not register user" });
    }
  },
  passport.authenticate("local"),
  (req, res) => {
    res.cookie("isNewUser", true, { maxAge: 600_000 });
    res.json({ result: "success" });
  }
);

router.get("/authenticated", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

router.get("/user", ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.get("/games", ensureAuthenticated, async (req, res) => {
  let games = await findGamesByUser(req.user._id, { status: Status.FINISHED });
  let result = [];
  for (let game of games) {
    let opponent = await findUserByID(
      game.userIDs.filter((userID) => userID !== req.user._id)[0]
    );
    let winner;
    if (game.winnerID === "tie") {
      winner = "Tie";
    } else {
      winner = await findUserByID(game.winnerID);
    }
    let squares = game.squares.map((id) =>
      id === null ? "" : id === game.firstPlayer ? "X" : "O"
    );
    let data = {
      squares: squares,
      opponent: opponent.username,
      winner: winner.username || winner,
    };

    result.push(data);
  }
  res.json({ games: result });
});

router.get("/create", ensureAuthenticated, async (req, res) => {
  let inGame = await userInGame(req.user._id);
  if (inGame) {
    res.json({ error: "Sorry, you are already in a game" });
  } else {
    let game = await createGame(req.user._id);
    if (game) {
      res.json({ code: game._id });
    } else {
      res.json({ error: "Could not create game" });
    }
  }
});

router.get("/random", ensureAuthenticated, async (req, res) => {
  let inGame = await userInGame(req.user._id);
  if (inGame) {
    res.json({ error: "Sorry, you are already in a game!" });
  } else {
    let game = await joinRandomGame(req.user._id);
    if (game) {
      res.json({ game: game._id });
    } else {
      res.json({ error: "Sorry, there are no available games" });
    }
  }
});

router.get("/code/:code", ensureAuthenticated, async (req, res) => {
  let inGame = await userInGame(req.user._id);
  if (inGame) {
    res.json({ error: "Sorry, you are already in a game!" });
  } else {
    let game = await addUserToGame(req.params.code, req.user._id);
    if (game) {
      res.json({ game: game._id });
    } else {
      res.json({ error: "Could not join game" });
    }
  }
});

router.get("/cancel", ensureAuthenticated, async (req, res) => {
  let game = await userInGame(req.user._id);
  game = await deleteGame(game._id);
  if (game) {
    res.json({ result: "success" });
  } else {
    res.json({ result: "error" });
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("isNewUser");
    req.logout({}, (error) => {
      if (error) {
        console.error(error.message);
        res.json({ result: "error" });
      } else {
        res.json({ result: "success" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.json({ result: "error" });
  }
});

module.exports = router;
