import { Link } from "react-router-dom";

export default function HomeLink(props) {
  return (
    <Link className="homelink-button btn btn-large btn-info" to="/">
      Home
    </Link>
  );
}
