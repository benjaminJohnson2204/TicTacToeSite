import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useCookies, withCookies } from "react-cookie";
import io from "socket.io-client";
import CreateGame from "../components/CreateGame";
import JoinRandomGame from "../components/JoinRandomGame";
import JoinGameByCode from "../components/JoinGameByCode";

function LoggedIn(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState("");
   
    const username = props.cookies.get("username");
    const isNewUser = searchParams.get("isNewUser");
    const navigate = useNavigate();

    const joinGame = data => {
        if (data.error || !data.game) {
            setError(data.error);
        } else {
            const socket = io("/waiting");
            socket.emit("join", { 
                creator : false,
                id : data.game 
            });
            navigate("/play/" + data.game);
        }
    };

    return <div className="page">
        <h1 className="title">
                {isNewUser == "true" ? ("Thanks for registering, " + username) : ("Welcome back, " + username)}
        </h1>
        <h2 className="subtitle">
            Choose an option to start playing!
        </h2>
        {error && <h4 className="text-danger">Sorry, you are already in a game!</h4>}
        <div className="row columns">
            <CreateGame handleData={data => {
                    if (data.error || !data.code) {
                        setError(data.error);
                    } else {
                        navigate("/waiting/" + data.code);
                    }
                }}/>
            <JoinRandomGame handleData={joinGame}/>
            <JoinGameByCode handleData={joinGame}/>
            
        </div>
    </div>
}

export default withCookies(LoggedIn);