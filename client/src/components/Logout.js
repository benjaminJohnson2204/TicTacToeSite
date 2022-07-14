import { useNavigate } from "react-router";
import fetchEndpoint from "../util/fetchEndpoint";

export default function Logout(props) {
    const navigate = useNavigate();

    return (
        <button className="logout-button btn btn-large btn-danger" id="logout-button" onClick={event => {
            event.preventDefault();
            fetchEndpoint("/api/logout")
            .then(data => {
                if (data.result === "success") {
                    navigate("/login");
                } else {
                    console.log("error: could not logout");
                }
            });
        }}>
            Logout
        </button>

    )
}