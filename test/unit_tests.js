const chai = require("chai");
const { Status } = require("../db/models/game");
const mongoose = require("mongoose");
const {
  createGame,
  addUserToGame,
  userInGame,
  isSquareAvailable,
  insertSquare,
  switchTurns,
  checkForWinner,
  checkForTie,
  deleteGame,
  findGameByID,
  joinRandomGame,
} = require("../db/services/game");
const { addUser } = require("../db/services/user");
const assert = chai.assert;
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

describe("Database Tests", () => {
  before(() =>
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  );
  after(() => process.exit());

  var user1, user2, game, game2;
  it("Create users", async () => {
    user1 = await addUser("test-1");
    user2 = await addUser("test-2");
    assert.isNotNull(user1);
    assert.isNotNull(user2);
    assert.equal(user1.username, "test-1");
    assert.equal(user2.username, "test-2");
  });

  it("Add users to game", async () => {
    game = await createGame(user1._id.toString());
    assert.equal(game.status, Status.WAITING);

    game = await addUserToGame(game._id, user2._id.toString());
    assert.isOk(game);
    assert.isNotNull(game);
    assert.include(game.userIDs, user1._id.toString());
    assert.include(game.userIDs, user2._id.toString());
    assert.equal(game.status, Status.PLAYING);
    assert.include([user1._id.toString(), user2._id.toString()], game.turn);
  });

  it("Detect that users are in game", async () => {
    let user1Game = await userInGame(user1._id.toString());
    let user2Game = await userInGame(user2._id.toString());
    assert.isOk(user1Game);
    assert.isOk(user2Game);
    assert.isTrue(user1Game.equals(user2Game));
  });

  it("Check that squares are available", async () => {
    for (let i = 0; i < 9; i++) {
      assert.isTrue(
        await isSquareAvailable(game._id, Math.floor(i / 3), i % 3)
      );
    }
  });

  it("Insert square", async () => {
    game = await insertSquare(game._id, game.turn, 0, 0);
    assert.isOk(game);
    assert.equal(game.turn, game.squares[0]);
  });

  it("Switch turns", async () => {
    game = await switchTurns(game._id);
    assert.notEqual(game.turn, game.squares[0]);
  });

  it("Check for winner", async () => {
    game = await insertSquare(game._id, game.turn, 1, 1);
    game = await switchTurns(game._id);
    game = await insertSquare(game._id, game.turn, 0, 1);
    game = await switchTurns(game._id);
    game = await insertSquare(game._id, game.turn, 2, 2);
    game = await switchTurns(game._id);
    game = await insertSquare(game._id, game.turn, 0, 2);
    game = await checkForWinner(game._id);
    assert.isOk(game);
    assert.equal(game.status, Status.FINISHED);
    assert.isOk(game.winnerID);
    assert.equal(game.winnerID, game.turn);
  });

  it("Delete game", async () => {
    game = await deleteGame(game._id);
    assert.isOk(game);
    game = await findGameByID(game._id);
    assert.isNotOk(game);
  });

  it("Create new game", async () => {
    game2 = await createGame(user1._id.toString());
    game2 = await addUserToGame(game2._id, user2._id.toString());
    assert.isOk(game2);
  });

  it("Fill up new game board", async () => {
    game2 = await insertSquare(game2._id, user1._id.toString(), 0, 0);
    game2 = await insertSquare(game2._id, user2._id.toString(), 0, 1);
    game2 = await insertSquare(game2._id, user1._id.toString(), 2, 0);
    game2 = await insertSquare(game2._id, user2._id.toString(), 1, 0);
    game2 = await insertSquare(game2._id, user1._id.toString(), 2, 1);
    game2 = await insertSquare(game2._id, user2._id.toString(), 2, 2);
    game2 = await insertSquare(game2._id, user1._id.toString(), 1, 2);
    game2 = await insertSquare(game2._id, user2._id.toString(), 0, 2);
    game2 = await insertSquare(game2._id, user1._id.toString(), 1, 1);
    assert.isOk(game2);
  });

  it("Game 2 is not won", async () => {
    game2 = await checkForWinner(game2._id);
    assert.isOk(game2);
    assert.isNotOk(game2.winnerID);
  });

  it("Check for tie", async () => {
    game2 = await checkForTie(game2._id);
    assert.isOk(game2);
    assert.equal(game2.status, Status.FINISHED);
    assert.isOk(game2.winnerID);
    assert.equal(game2.winnerID, "tie");
  });

  it("Join random game", async () => {
    game = await createGame(user1._id);
    let randomGame = await joinRandomGame(user2._id);
    assert.isOk(randomGame);
  });
});
