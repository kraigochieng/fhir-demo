import { Link } from "react-router-dom";
import "./DashboardItem.css";

type props = {
	title: string;
	link: string;
};

export const DashboardItem = (props: props) => {
	return (
		<div className="dashboard-item-container">
			<Link to={props.link}>
				<p className="dashboard-item-title">{props.title}</p>
			</Link>
		</div>
	);
};
