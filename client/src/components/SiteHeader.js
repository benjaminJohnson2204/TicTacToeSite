import HomeLink from "./HomeLink";
import Logout from "./Logout";

export default function SiteHeader(props) {
    return (
        <div className="row">
            <HomeLink />
            <div className="col-10" />
            <Logout />
        </div>
    );
}