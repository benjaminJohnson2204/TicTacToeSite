import { Link } from "react-router-dom"

export default function HomeLink(props) {
    return (
        <Link className="col-1 btn btn-large btn-info" to="/">
            Home
        </Link>
    );
}