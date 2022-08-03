import { useState, useEffect } from "react";
import fetchEndpoint from "../util/fetchEndpoint";
import SiteHeader from "../components/SiteHeader";
import ensureAuthenticated from "../util/ensureAuthenticated";
import { useNavigate } from "react-router";

export default function CompletedGames(props) {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ensureAuthenticated(navigate);

    fetchEndpoint("/api/games").then((data) => {
      setGames(data.games);
    });
  }, []);

  return (
    <div className="page">
      <SiteHeader />
      <h1 className="title">Your games</h1>
      <table>
        <thead>
          <tr>
            <td className="subtitle">Opponent</td>
            <td className="subtitle">Winner</td>
            <td className="subtitle">Final Game State</td>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr>
              <td>{game.opponent}</td>
              <td className={game.winner === "Tie" ? "tie" : ""}>
                {game.winner}
              </td>
              <td>
                <table className="mini-table">
                  <tbody>
                    {[0, 1, 2].map((i) => (
                      <tr>
                        {game.squares
                          .slice(3 * i, 3 * i + 3)
                          .map((square, col) => (
                            <td className="mini-box">{square}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
