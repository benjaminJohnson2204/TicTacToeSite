import { withCookies } from "react-cookie";
import { useNavigate } from "react-router";
import ensureAuthenticated from "../util/ensureAuthenticated";
import fetchEndpoint from "../util/fetchEndpoint";

function JoinRandomGame(props) {
    const navigate = useNavigate();

    ensureAuthenticated(navigate);

    return (
        <div className="button">
            <button className="btn btn-large btn-primary" onClick={event => {
                event.preventDefault(); 
                ensureAuthenticated(navigate);

                fetchEndpoint("/api/random")
                .then(props.handleData);
            }}>
                Join a random game
            </button>
        </div>
    );
}

export default withCookies(JoinRandomGame);