const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path : path.join(__dirname, ".env")});

const express = require("express");
const cookieParser = require("cookie-parser");
const testRunner = require("../test-runner");

const app = express();
const PORT = process.env.PORT || 3001;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});

const { findUserByUsername, addUser } = require("../db/services/user");
const { addUserToGame, createGame, userInGame, joinRandomGame, findGameByID, insertSquare, switchTurns, checkForWinner, isSquareAvailable, checkForTie } = require("../db/services/game");

app.use(cookieParser());



app.use("/test", require("../routes/waiting"));

app.get("/login", async (req, res) => {
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

app.get("/create", async (req, res) => {
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

app.get("/random", async (req, res) => {
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

app.get("/code/:code", async (req, res) => {
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

app.get("/logout", (req, res) => {
    res.clearCookie("username");
})

io.of("/waiting").on("connection", socket => {
    socket.on("join", message => {
        socket.join(message.id);
        if (!message.creator) {
            socket.to(message.id).emit("join");
        }
    });
});

io.of("/play").on("connection", socket => {
    var usernames = [];

    socket.on("join", async message => {
        usernames.push(message.username);
        socket.join(message.id);
        let game = await findGameByID(message.id);
        io.of("/play").to(message.id).emit("game update", game);
    });
    socket.on("move", async message => {
        let user = await findUserByUsername(message.username);
        let game = await findGameByID(message.gameID);
        if (user._id.toString() !== game.turn || !await isSquareAvailable(message.gameID, message.row, message.col)) { // Make sure it's this user's turn and the square is available
            io.of("/play").to(message.gameID).emit("game update", game);
            return;
        }
        let updatedGame = await insertSquare(message.gameID, user._id, message.row, message.col);
        if (!updatedGame) {
            console.log("Error making a move");
            return;
        }
        let gameSwitchedTurns = await switchTurns(message.gameID);
        let wonGame = await checkForWinner(message.gameID);
        let tiedGame = await checkForTie(message.gameID);
        if (wonGame.winnerID) {
            io.of("/play").to(message.gameID).emit("game update", wonGame);
        } else if (tiedGame.winnerID) {
            io.of("/play").to(message.gameID).emit("game update", tiedGame);
        } else {
            io.of("/play").to(message.gameID).emit("game update", gameSwitchedTurns);
        }
    })
})


if (process.env.NODE_ENV == "development") {
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
    });
} else {
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    })
}


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    setTimeout(() => {
        testRunner.run();
    }, 3500);
});