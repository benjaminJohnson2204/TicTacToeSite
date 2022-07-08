import "../App.css"

import { Link, useSearchParams, useNavigate } from "react-router-dom";

import EnterUsername from "../components/EnterUsername";
import { useEffect, useState } from "react";
import { withCookies } from "react-cookie";

function Homepage(props) {
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.cookies.get("username") && props.cookies.get("userID")) {
            navigate("/loggedIn?isNewUser=false");
        }
    });

    return (
        <div className="page">
            <div className="title">
                <h1>Welcome!</h1>
            </div>
            {error && <div className="text-danger">Please enter a username</div>}
            <EnterUsername onSubmit={event => {
                    event.preventDefault(); 
                    fetch("/api/login?username=" + event.target[0].value, {
                        credentials : "include"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            setError(true);
                        } else {
                            navigate("/loggedIn?isNewUser=" + data.isNewUser);
                        }
                    })
                }}/>
        </div>
    );
}

export default withCookies(Homepage);