import { useEffect } from "react";
import { withCookies } from "react-cookie";
import { useNavigate } from "react-router";
import fetchEndpoint from "../util/fetchEndpoint";

function CreateGame(props) {
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

                fetchEndpoint("/api/create")
                .then(props.handleData);
            }}>
                Create a new game
            </button>
        </div>
    );
}

export default withCookies(CreateGame);