import fetchEndpoint from "../util/fetchEndpoint";

export default function JoinRandomGame(props) {
    return (
        <div className="button">
            <button className="btn btn-large btn-primary" onClick={event => {
                event.preventDefault(); 
                fetchEndpoint("/api/random")
                .then(props.handleData);
            }}>
                Join a random game
            </button>
        </div>
    );
}