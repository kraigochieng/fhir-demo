import { Space } from "antd";
import { FhirEncounter } from "../types/fhir/resources";

type props = {
	previousVisit: FhirEncounter;
};
export default function PreviousVisitSummary(props: props) {
	const { previousVisit } = props;
	console.log("prev visit summary", previousVisit);

	const startDate = new Date(previousVisit.period.start);

	const startDateYear = startDate.getFullYear();
	const startDateMonth = startDate.getMonth() + 1; // Months are zero-based, so add 1
	const startDateDay = startDate.getDate();

	const endDate = new Date(previousVisit.period.start);

	const endDateYear = endDate.getFullYear();
	const endDateMonth = endDate.getMonth() + 1; // Months are zero-based, so add 1
	const endDateDay = endDate.getDate();

	return (
		<Space direction="vertical" size="middle">
			<Space direction="vertical" size="small">
				<p>Visit Type</p>
				<p>{previousVisit.class?.display}</p>
			</Space>
			<Space direction="vertical" size="small">
				<p>Start</p>
				<p>{`${startDateYear}-${
					startDateMonth < 10 ? "0" : ""
				}${startDateMonth}-${startDateDay < 10 ? "0" : ""}${startDateDay}`}</p>
				<p>End</p>
				<p>{`${endDateYear}-${endDateMonth < 10 ? "0" : ""}${endDateMonth}-${
					endDateDay < 10 ? "0" : ""
				}${endDateDay}`}</p>
			</Space>
		</Space>
	);
}
