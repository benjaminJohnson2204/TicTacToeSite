import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useCookies, withCookies } from "react-cookie";
import io from "socket.io-client";

function LoggedIn(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState("");
   
    const username = props.cookies.get("username");
    const isNewUser = searchParams.get("isNewUser");
    const navigate = useNavigate();

    return <div className="page">
        <h1 className="title">
                {isNewUser == "true" ? ("Thanks for registering, " + username) : ("Welcome back, " + username)}
        </h1>
        <h2 className="subtitle">
            Choose an option to start playing!
        </h2>
        {error && <h4 className="text-danger">Sorry, you are already in a game!</h4>}
        <div className="row columns">
            <div className="button">
                <button className="btn btn-large btn-primary" onClick={event => {
                    event.preventDefault(); 
                    fetch("create", {
                        credentials : "include"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error || !data.code) {
                            setError(data.error);
                        } else {
                            navigate("/waiting/" + data.code);
                        }
                    });
                }}>
                    Create a new game
                </button>
            </div>
            <div className="button">
                <button className="btn btn-large btn-primary" onClick={event => {
                    event.preventDefault(); 
                    fetch("random", {
                        credentials : "include"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error || !data.game) {
                            setError(data.error);
                        } else {
                            const socket = io("/waiting");
                            socket.emit("join", { 
                                creator : false,
                                id : data.game
                            });
                            socket.disconnect();
                            navigate("/play/" + data.game);
                        }
                    });
                }}>
                    Join a random game
                </button>
            </div>
            <div className="button">
                <form className="input-field" onSubmit={event => {
                    event.preventDefault(); 
                    fetch("/code/" + event.target[0].value, {
                        credentials : "include"
                    })
                    .then(res => res.json())
                    .then(data => {
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
                    });
                }}>
                    <div className="form-group">
                        Join game by code:
                        <input autoComplete="off" id="code" name="code" placeholder="Enter a code" type="text" />
                        <input className="btn btn-large btn-primary m-2" type="submit" value="Join" />
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default withCookies(LoggedIn);