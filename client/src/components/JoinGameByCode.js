import { withCookies } from "react-cookie";
import { useNavigate } from "react-router";
import ensureAuthenticated from "../util/ensureAuthenticated";
import fetchEndpoint from "../util/fetchEndpoint";

function JoinGameByCode(props) {
  const navigate = useNavigate();

  return (
    <div className="button">
      <form
        className="input-field"
        onSubmit={async (event) => {
          event.preventDefault();

          await ensureAuthenticated(navigate);

          fetchEndpoint("/api/code/" + event.target[0].value).then(
            props.handleData
          );
        }}
      >
        <div className="form-group">
          Join game by code:
          <input
            autoComplete="off"
            id="code"
            name="code"
            placeholder="Enter a code"
            type="text"
          />
          <input
            className="btn btn-large btn-primary m-2"
            type="submit"
            value="Join"
          />
        </div>
      </form>
    </div>
  );
}

export default withCookies(JoinGameByCode);
