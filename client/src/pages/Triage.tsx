import TriageForm from "../components/forms/TriageForm";

export default function Triage() {
	console.log(localStorage.getItem("inProgressVisitId"));
	return (
		<div className="page">
			<TriageForm />
		</div>
	);
}
