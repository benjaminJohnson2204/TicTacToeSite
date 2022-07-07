import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function EnterUsername(props) {
    return (
        <form className="input-field" onSubmit={props.onSubmit}>
        <div className="form-group">
            <div>Please enter your username (or create a new username) to get started</div>
            <input autocomplete="off" id="username" name="username" type="text" />
            <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
        </form>
    )
}