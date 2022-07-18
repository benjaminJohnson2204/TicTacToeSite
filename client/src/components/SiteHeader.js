import HomeLink from "./HomeLink";
import SourceCodeLink from "./SourceCodeLink";
import Logout from "./Logout";

export default function SiteHeader(props) {
    return (
        <div className="site-header">
            {props.homeDisabled ? null : <HomeLink />}
            <SourceCodeLink />
            {props.logoutDisabled ? null : <Logout />}
        </div>
    );
}