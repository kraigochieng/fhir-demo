import PageLinks from "../components/PageLinks";
import TriageForm from "../components/forms/TriageForm";
import { Link } from "react-router-dom";

export default function Triage() {
	const patientId = localStorage.getItem("patientId");

	console.log(localStorage.getItem("inProgressVisitId"));
	return (
		<div className="page">
			<PageLinks />
			<Link
				to={{
					pathname: `/catalog/${patientId}`,
				}}
				style={{
					padding: "5px",
					border: "solid 1px var(--blue)",
					borderRadius: "5px",
				}}
			>
				Back to Summary
			</Link>
			<TriageForm />
		</div>
	);
}
