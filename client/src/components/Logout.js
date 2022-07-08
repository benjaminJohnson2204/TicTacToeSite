import { useNavigate } from "react-router";
import fetchEndpoint from "../util/fetchEndpoint";

export default function Logout(props) {
    const navigate = useNavigate();

    return (
        <button className=" col-1 logout-button btn btn-large btn-danger" id="logout-button" onClick={event => {
            console.log("clicked");
            event.preventDefault();
            fetchEndpoint("/api/logout")
            .then(data => {
                console.log("Res: " + data);
                if (data.result === "success") {
                    navigate("/");
                } else {
                    console.log("error: could not logout");
                }
            });
        }}>
            Logout
        </button>

    )
}