const { User } = require("../models/user");
const { Game, Status } = require("../models/game");
const { findUserByUsername } = require("./user");

const flipACoin = () => Math.random() < 0.5;

const findGamesByUser = async (userID, filters) => {
    try {
        let games = await Game.find({...filters, userIDs : userID}).exec();
        return games;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const findGameByID = async gameID => {
    try {
        let game = await Game.findById(gameID).exec();
        if (game) {
            return game;
        } else {
            console.log("Game does not exist");
        }
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const joinRandomGame = async (userID) => {
    try {
        let randomGame = await Game.findOne({ status : Status.WAITING}).exec();
        let joinedGame = await addUserToGame(randomGame._id, userID);
        while (!joinedGame) { // Keep trying to find an available game
            randomGame = await Game.findOne({ status : Status.WAITING}).exec();
            joinedGame = await addUserToGame(randomGame._id, userID);
        }
        return joinedGame;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const userInGame = async (userID) => {
    try {
        let usersGames = await findGamesByUser(userID, {
            $or : [{status : Status.PLAYING}, {status : Status.WAITING}]
        });
        return usersGames[0];
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const createGame = async (userID) => {
    try {
        let user = await User.findById(userID).exec();
        let game = new Game({
            userIDs : [userID],
            usernames : [user.username],
            status : Status.WAITING,
            squares : [null, null, null, null, null, null, null, null, null],
            firstPlayer : userID,
            turn : userID
        });
        await game.save();
        return game;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const addUserToGame = async (gameID, userID) => {
    try {
        let user = await User.findById(userID).exec();
        let game = await findGameByID(gameID);
        if (game.status !== Status.WAITING) { // Another user is already trying to join
            console.log("Someone is already trying to join this game");
            return false;
        }
        game.status = Status.PLAYING;
        await game.save(); // Don't let other users try to join at the same time

        game.userIDs.push(userID);
        game.usernames.push(user.username);
        if (flipACoin()) {
            game.firstPlayer = userID;
            game.turn = userID;
        }
        await game.save();
        if (game) {
            return game;
        } else {
            console.log("Game does not exist");
        }
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const isSquareAvailable = async (gameID, row, col) => {
    try {
        let game = await findGameByID(gameID);
        return !game.squares[3 * row + col];
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const insertSquare = async (gameID, userID, row, col) => {
    try {
        let game = await findGameByID(gameID);
        if (!game) {
            return false;
        }
        game.squares[3 * row + col] = userID;
        await game.save();
        return game;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const switchTurns = async gameID => {
    try {
        let game = await findGameByID(gameID);
        game.turn = game.userIDs.filter(userID => userID != game.turn)[0];
        await game.save();
        return game;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const checkForWinner = async gameID => {
    try {
        let game = await findGameByID(gameID);
        let winner = null;
        for (let i = 0; i < 3; i++) {
            // Rows
            if (game.squares[3 * i] == game.squares[3 * i + 1] && game.squares[3 * i] == game.squares[3 * i + 2]) {
                winner = game.squares[3 * i];
                break;
            }
            // Columns
            if (game.squares[i] == game.squares[3 + i] && game.squares[i] == game.squares[6 + i]) {
                winner = game.squares[i];
                break;
            }
        }
        // Diagonals
        if (game.squares[0] == game.squares[4] && game.squares[0] == game.squares[8]) {
            winner = game.squares[0];
        } else if (game.squares[2] == game.squares[4] && game.squares[2] == game.squares[6]) {
            winner = game.squares[4];
        }
        if (winner) {
            game.winnerID = winner;
            game.status = Status.FINISHED;
        }
        await game.save();
        return game;
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
}

const checkForTie = async gameID => {
    let game = await findGameByID(gameID);
    if (game.squares.filter(square => !square).length == 0) {// If the board is full 
        game.winnerID = "tie";
        game.status = Status.FINISHED;
        await game.save();
    }
    return game;
}

const setGameWinner = async (gameID, winner) => {
    try {
        let game = await Game.findByIdAndUpdate(gameID, {winnerID : winner, status : Status.FINISHED}).exec();
        if (game) {
            return game;
        } else {
            console.log("Game does not exist");
        }
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
};

const deleteGame = async (gameID) => {
    try {
        return await Game.findByIdAndDelete(gameID).exec();
    } catch (error) {
        console.error(error.message);
        console.trace();
        return false;
    }
}

module.exports = {
    findGamesByUser, findGameByID, joinRandomGame, userInGame, insertSquare, isSquareAvailable, switchTurns, checkForTie, checkForWinner, createGame, addUserToGame, setGameWinner, deleteGame
};