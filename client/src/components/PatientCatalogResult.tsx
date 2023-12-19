import { FhirPatient } from "../types/fhir/resources";
import { Link } from "react-router-dom";
import "./PatientCatalogResult.css";

type props = {
	patient: FhirPatient;
};

export default function PatientCatalogResult(props: props) {
	const { patient } = props;
	console.log(patient.id);
	return (
		<Link
			className="patient-catalog-result-container"
			to={`/catalog/${patient.id}`}
			state={`${patient.id}`}
		>
			{patient.name.map((name, index) => (
				<p key={index}>Name: {name.text}</p>
			))}
			<p> Gender: {patient.gender}</p>
			<p>Telephone Number: {patient.telecom}</p>
		</Link>
	);
}
