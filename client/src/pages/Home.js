import { Link, useNavigate } from "react-router-dom";
import { useEffect ,useState } from "react";
import { withCookies } from "react-cookie";
import io from "socket.io-client";
import CreateGame from "../components/CreateGame";
import JoinRandomGame from "../components/JoinRandomGame";
import JoinGameByCode from "../components/JoinGameByCode";
import SiteHeader from "../components/SiteHeader";
import fetchEndpoint from "../util/fetchEndpoint";
import ensureAuthenticated from "../util/ensureAuthenticated";

function Home(props) {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
   
    const isNewUser = props.cookies.get("isNewUser");
    const navigate = useNavigate();

    useEffect(() => {        
        const auth = async() => {
            await ensureAuthenticated(navigate);
            if (!user) {
                let data = await fetchEndpoint("/api/user");
                if (data.user) {
                    setUser(data.user);
                }
            }
        };
        auth();
    });

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
        <SiteHeader homeDisabled={true}/>
        <h1 className="title">
                {!user ? "Loading..." : isNewUser === "true" ? ("Thanks for registering, " + user.username) : ("Welcome back, " + user.username)}
        </h1>
        <h2 className="subtitle">
            Choose an option to start playing!
        </h2>
        <h4 className="text-danger">{error}</h4>
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
        <div>
            <Link className="btn btn-large btn-warning m-5" to="/games">View your game history</Link>
        </div>
    </div>
}

export default withCookies(Home);