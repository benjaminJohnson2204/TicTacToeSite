const mongoose = require("mongoose");

const Status = {
  WAITING: 0,
  PLAYING: 1,
  FINISHED: 2,
};

const gameSchema = new mongoose.Schema({
  userIDs: [String],
  usernames: [String],
  status: Number,
  squares: [String],
  firstPlayer: String,
  turn: String,
  winnerID: String,
});
const Game = mongoose.model("Game", gameSchema);

module.exports = {
  Status,
  Game,
};
