import { withCookies } from "react-cookie";
import { useNavigate } from "react-router";
import fetchEndpoint from "../util/fetchEndpoint";

function JoinRandomGame(props) {
    const navigate = useNavigate();

    if (!props.cookies.get("username") || !props.cookies.get("userID")) {
        navigate("/");
    }

    return (
        <div className="button">
            <button className="btn btn-large btn-primary" onClick={event => {
                event.preventDefault(); 
                if (!props.cookies.get("username") || !props.cookies.get("userID")) {
                    navigate("/");
                }

                fetchEndpoint("/api/random")
                .then(props.handleData);
            }}>
                Join a random game
            </button>
        </div>
    );
}

export default withCookies(JoinRandomGame);