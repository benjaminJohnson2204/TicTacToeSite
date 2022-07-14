import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchEndpoint from "../util/fetchEndpoint";

export default function Register(props) {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEndpoint("/api/authenticated")
        .then(data => {
            if (data.authenticated) {
                navigate("/");
            }
        })
    }, []);

    return (
        <div className="page">
            <div className="title">
                <h1>Register</h1>
            </div>
            {error && <div className="text-danger">{error}</div>}
            <form className="input-field" onSubmit={event => {
                event.preventDefault(); 
                fetch("/api/register", {
                    credentials : "include",
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        username : event.target[0].value, 
                        password : event.target[1].value,
                        confirm : event.target[2].value
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        navigate("/");
                    }
                })
            }}>
                <div className="form-group">
                    <input autoComplete="off" id="username" name="username" type="text" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <input autoComplete="off" id="password" name="password" type="password" placeholder="Password"/>
                </div>
                <div className="form-group">
                    <input autoComplete="off" id="confirm" name="confirm" type="password" placeholder="Confirm Password"/>
                </div>
                <input className="btn btn-primary" type="submit" value="Submit" />
            </form>
            Already have an account? {<Link to="/login">Login</Link>}
        </div>
    );
}