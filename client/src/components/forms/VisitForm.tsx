import { Form, Select } from "antd";
import { CodeableConceptType } from "../../types/fhir/resources";

export default function VisitForm() {
	const encounterClassesSystemUrl =
		"http://terminology.hl7.org/CodeSystem/v3-ActCode";

	const currentDate = new Date();
	const isoCurrentDate = currentDate.toISOString();

	const encounterClasses: CodeableConceptType[] = [
		{
			system: encounterClassesSystemUrl,
			code: "IMP",
			display: "inpatient encounter",
		},
		{
			system: encounterClassesSystemUrl,
			code: "AMB",
			display: "ambulatory",
		},
		{
			system: encounterClassesSystemUrl,
			code: "EMER",
			display: "emergency",
		},
	];

	return (
		<Form>
			<Form.Item
				label="Type of Visit"
				name="class"
				rules={[
					{
						required: true,
						message: "Please input type of visit",
					},
				]}
			>
				<Select
					options={encounterClasses.map(
						(encounterClass: CodeableConceptType) => ({
							value: JSON.stringify(encounterClass),
							label: encounterClass.display,
						}),
					)}
				/>
			</Form.Item>
		</Form>
	);
}
