import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { withCookies } from "react-cookie";

const socket = io("/play");

function Play(props) {
    const { gameID } = useParams();
    const [game, setGame] = useState(null);
    const username = props.cookies.get("username");
    const userID = props.cookies.get("userID");

    // Only emit the join message once. Don't want to make an infinite feedback loop of 
    // sending a join message, getting an update, updating, re-rendering, sending a message, etc.
    useEffect(() => {
        socket.emit("join", { 
            id : gameID,
            username : username
        });
        socket.on("game update", message => {
            console.log("game update", message);
            setGame(message);
        });
    }, []);

    if (!game) {
        return (
            <div className="page">
                <h1 className="title">Playing Tic-tac-toe</h1>
                <h2 className="subtitle">Loading...</h2>
            </div>
        );
    }

    return (
        <div className="page">
            <h1 className="title">{game.winnerID ? "Game Over" : "Playing Tic-tac-toe"}</h1>
            <h2 className="subtitle">{game.winnerID ? "" : userID === game.turn ? "Your turn" : "Opponent's turn"}</h2>
                <div className="row columns">
                    <div className="button">
                        {game.winnerID == userID && <h2 className="victor">Winner!</h2>}
                        {username} (you)
                        <h2 className="subtitle">
                            {game.firstPlayer === userID ? "X" : "O" /* X always moves first*/}
                        </h2>
                    </div>
                    <div className="button">
                        {game.winnerID === "tie" && <h2 className="tie">It's a tie!</h2>}
                        <table>
                            <tbody>
                                {[0, 1, 2].map(i => (
                                    <tr>
                                        {game.squares.slice(3 * i, 3 * i + 3).map((square, col) => (
                                            <td className="box" onClick={() => {
                                                if (!game.winnerID) {
                                                    socket.emit("move", {gameID : gameID, username : username, row : i, col : col});
                                                }
                                            }}>
                                                {square ? (((square === userID) ^ (game.firstPlayer === userID)) ? "O" : "X") : ""}
                                                </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="button">
                        {game.userIDs.includes(game.winnerID) && game.winnerID != userID && <h2 className="victor">Winner!</h2>}
                        {game.usernames.filter(uname => uname != username)[0]} (opponent)
                        <h2 className="subtitle">
                            {game.firstPlayer === userID ? "O" : "X"}
                        </h2>
                    </div>
                </div>
        </div>
    )
}

export default withCookies(Play);