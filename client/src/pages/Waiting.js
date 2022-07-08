import { useEffect } from "react";
import { withCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client"
import SiteHeader from "../components/SiteHeader";


const socket = io("/waiting");


function Waiting(props) {

    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.cookies.get("username") || !props.cookies.get("userID")) {
            navigate("/");
        }

        socket.emit("join", { 
            creator : true,
            id : code
        });

        socket.on("join", message => {
            if (!props.cookies.get("username") || !props.cookies.get("userID")) {
                navigate("/");
            } else {
                navigate("/play/" + code);
            }
        });
    });

    return (
        <div className="page">
            <SiteHeader />
            <h1 className="title">
                Waiting...
            </h1>
            <div className="text">
                Your game code is {code}. Give it to a friend so they can join your game, or wait for a random to join
            </div>
        </div>
    )
}

export default withCookies(Waiting);