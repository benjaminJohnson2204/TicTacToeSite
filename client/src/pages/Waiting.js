import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client"


const socket = io("/waiting");


export default function Waiting(props) {

    const { code } = useParams();
    const navigate = useNavigate();
    socket.emit("join", { 
        creator : true,
        id : code
    });
    socket.on("join", message => {
        socket.disconnect();
        navigate("/play/" + code);
    });

    return (
        <div className="page">
            <h1 className="title">
                Waiting...
            </h1>
            <div className="text">
                Your game code is {code}. Give it to a friend so they can join your game, or wait for a random to join
            </div>
        </div>
    )
}