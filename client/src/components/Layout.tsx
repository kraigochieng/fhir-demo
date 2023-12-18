import { Link, Outlet } from "react-router-dom";

export const Layout = () => {
	return (
		<>
			<p>Layout</p>
			<Link to="/">home</Link>
			<Outlet />
		</>
	);
};
