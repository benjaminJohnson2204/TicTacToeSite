import { useEffect } from "react";
import { withCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client"
import SiteHeader from "../components/SiteHeader";
import ensureAuthenticated from "../util/ensureAuthenticated";
import fetchEndpoint from "../util/fetchEndpoint";


const socket = io("/waiting");


function Waiting(props) {

    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {        
        const auth = async() => {
            await ensureAuthenticated(navigate);
        };
        auth();
    })

    useEffect(() => {
        socket.emit("join", { 
            creator : true,
            id : code
        });
        socket.on("join", async message => {
            await ensureAuthenticated(navigate);
            navigate("/play/" + code);
        });
    }, []);

    return (
        <div className="page">
            <SiteHeader />
            <h1 className="title">
                Waiting...
            </h1>
            <div className="text">
                Your game code is {code}. Give it to a friend so they can join your game, or wait for a random to join
            </div>
            <div className="button">
                <button className="btn btn-large btn-warning" onClick={event => {
                    event.preventDefault();
                    fetchEndpoint("/api/cancel")
                    .then(data => {
                        if (data.result === "success") {
                            navigate("/");
                        } else {
                            console.log("Error: cannot cancel game");
                        }
                    })
                }}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default withCookies(Waiting);