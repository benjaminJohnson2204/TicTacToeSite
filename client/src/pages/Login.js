import "../App.css";

import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import fetchEndpoint from "../util/fetchEndpoint";
import SiteHeader from "../components/SiteHeader";

function Login(props) {
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEndpoint("/api/authenticated").then((data) => {
      if (data.authenticated) {
        navigate("/");
      }
    });
  });

  return (
    <div className="page">
      <SiteHeader homeDisabled={true} logoutDisabled={true} />
      <div className="title">
        <h1>Login</h1>
      </div>
      <div className="text-danger">{error}</div>
      <form
        className="input-field"
        onSubmit={(event) => {
          event.preventDefault();
          fetch("/api/login", {
            credentials: "include",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: event.target[0].value,
              password: event.target[1].value,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.result === "success") {
                navigate("/");
              } else {
                setError("Invalid username and/or password");
              }
            });
        }}
      >
        <div className="form-group">
          <input
            autoComplete="off"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <input
            autoComplete="off"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <input className="btn btn-primary" type="submit" value="Submit" />
      </form>
      New to the site?{" "}
      {
        <Link className="link" to="/register">
          Register here
        </Link>
      }
    </div>
  );
}

export default withCookies(Login);
