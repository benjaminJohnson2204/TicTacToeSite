import fetchEndpoint from "../util/fetchEndpoint";

export default function CreateGame(props) {
    return (
        <div className="button">
            <button className="btn btn-large btn-primary" onClick={event => {
                event.preventDefault(); 
                fetchEndpoint("/api/create")
                .then(props.handleData);
            }}>
                Create a new game
            </button>
        </div>
    );
}