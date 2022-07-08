import fetchEndpoint from "../util/fetchEndpoint";

export default function JoinGameByCode(props) {
    return (
        <div className="button">
            <form className="input-field" onSubmit={event => {
                event.preventDefault(); 
                fetchEndpoint("/api/code/" + event.target[0].value)
                .then(props.handleData);
            }}>
                <div className="form-group">
                    Join game by code:
                    <input autoComplete="off" id="code" name="code" placeholder="Enter a code" type="text" />
                    <input className="btn btn-large btn-primary m-2" type="submit" value="Join" />
                </div>
            </form>
        </div>
    )
}