import HomeLink from "./HomeLink";
import Logout from "./Logout";

export default function SiteHeader(props) {
    return (
        <div className="site-header">
            <HomeLink />
            <Logout />
        </div>
    );
}