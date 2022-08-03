import { withCookies } from "react-cookie";
import { useNavigate } from "react-router";
import fetchEndpoint from "../util/fetchEndpoint";
import ensureAuthenticated from "../util/ensureAuthenticated";

function CreateGame(props) {
  const navigate = useNavigate();

  return (
    <div className="button">
      <button
        className="btn btn-large btn-primary"
        onClick={async (event) => {
          event.preventDefault();

          await ensureAuthenticated(navigate);

          fetchEndpoint("/api/create").then(props.handleData);
        }}
      >
        Create a new game
      </button>
    </div>
  );
}

export default withCookies(CreateGame);
