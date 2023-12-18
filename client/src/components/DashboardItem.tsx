import { Link } from "react-router-dom";

type props = {
	title: string;
	link: string;
};

export const DashboardItem = (props: props) => {
	return (
		<Link to={props.link}>
			<p>{props.title}</p>
		</Link>
	);
};
