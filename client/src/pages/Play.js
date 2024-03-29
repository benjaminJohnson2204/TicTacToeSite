import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { withCookies } from "react-cookie";
import Chat from "../components/Chat";
import SiteHeader from "../components/SiteHeader";
import ensureAuthenticated from "../util/ensureAuthenticated";
import fetchEndpoint from "../util/fetchEndpoint";

const socket = io("/play");

function Play(props) {
  const navigate = useNavigate();
  const { gameID } = useParams();

  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [opponentReconnected, setOpponentReconnected] = useState(false);

  // Only emit the join message once. Don't want to make an infinite feedback loop of
  // sending a join message, getting an update, updating, re-rendering, sending a message, etc.
  useEffect(() => {
    fetchEndpoint("/api/user").then((data) => {
      if (data.user) {
        setUser(data.user);

        socket.emit("join", {
          id: gameID,
          username: data.user.username,
        });

        socket.on("opponent disconnected", (message) => {
          setOpponentDisconnected(true);
          setOpponentReconnected(false);
        });

        socket.on("opponent reconnected", (message) => {
          if (message.username !== data.user.username) {
            setOpponentReconnected(true);
            setOpponentDisconnected(false);
          }
        });
      }
    });

    socket.on("game update", (message) => {
      setGame(message);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const auth = async () => {
      await ensureAuthenticated(navigate);
    };
    auth();
  });

  if (!game || !user) {
    return (
      <div className="page">
        <SiteHeader />
        <h1 className="title">Playing Tic-tac-toe</h1>
        <h2 className="subtitle">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <SiteHeader />
      <h1 className="title">
        {game.winnerID ? "Game Over" : "Playing Tic-tac-toe"}
      </h1>
      <h2 className="subtitle">
        {game.winnerID
          ? ""
          : user._id === game.turn
          ? "Your turn"
          : "Opponent's turn"}
      </h2>
      <div className="row columns">
        <div className="button">
          <Chat gameID={gameID} user={user} socket={socket} />
          {game.winnerID === user._id && <h2 className="victor">Winner!</h2>}
          <h1>{user.username} (you)</h1>
          <h2 className="subtitle">
            {
              game.firstPlayer === user._id
                ? "X"
                : "O" /* X always moves first*/
            }
          </h2>
        </div>
        <div className="button">
          {game.winnerID === "tie" && <h2 className="tie">It's a tie!</h2>}
          <table>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr>
                  {game.squares.slice(3 * i, 3 * i + 3).map((square, col) => (
                    <td
                      className="box"
                      onClick={() => {
                        if (!game.winnerID) {
                          socket.emit("move", {
                            gameID: gameID,
                            username: user.username,
                            row: i,
                            col: col,
                          });
                        }
                      }}
                    >
                      {square
                        ? (square === user._id) ^
                          (game.firstPlayer === user._id)
                          ? "O"
                          : "X"
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="button">
          {game.userIDs.includes(game.winnerID) &&
            game.winnerID !== user._id && <h2 className="victor">Winner!</h2>}
          <h1>
            {game.usernames.filter((uname) => uname !== user.username)[0]}{" "}
            (opponent)
          </h1>
          <h2 className="subtitle">
            {game.firstPlayer === user._id ? "O" : "X"}
          </h2>
          {opponentReconnected && (
            <h4 className="text-success">Your opponent has reconnected!</h4>
          )}
          {opponentDisconnected && (
            <h4 className="text-danger">Your opponent has disconnected!</h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default withCookies(Play);
