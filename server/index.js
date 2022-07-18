const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path : path.join(__dirname, ".env")});

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const testRunner = require("../test-runner");

const app = express();
const PORT = process.env.PORT || 3001;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});

const { findUserByUsername, addUser, findUserByID } = require("../db/services/user");
const { addUserToGame, createGame, userInGame, joinRandomGame, findGameByID, insertSquare, switchTurns, checkForWinner, isSquareAvailable, checkForTie } = require("../db/services/game");

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "../client/build")));


app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());


app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : true,
    saveUninitialized : true,
    cookie : { secure : false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    let user = await findUserByID(id);
    done(null, user);
})

passport.use(new LocalStrategy(
    async (username, password, done) => {
        let user = await findUserByUsername(username);
        if (!user) {
            return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false);
        }
        return done(null, user);
    }
))

app.use("/api", require("./routes"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});


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




server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    setTimeout(() => {
        testRunner.run();
    }, 3500);
});
