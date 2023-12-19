import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

export const Layout = () => {
	return (
		<div id="layout">
			<div id="layout-top-section">
				<p id="layout-title">KENYA EMR</p>
				<div id="layout-links">
					<Link to="/" className="layout-link">
						Home
					</Link>
				</div>
			</div>
			<Outlet />
		</div>
	);
};
