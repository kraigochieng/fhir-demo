import { Link } from "react-router-dom";
import "./PageLinks.css";

export default function PageLinks() {
	return (
		<div className="page-links">
			<Link style={{ display: "block" }} to="/catalog">
				Back To Catalog
			</Link>
		</div>
	);
}
