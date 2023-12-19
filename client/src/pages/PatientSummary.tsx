import { useEffect, useState } from "react";
import { server } from "../axiosInstances";
import { baseUrl, encounterUrl, patientUrl, snomedUrl } from "../urls";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
	CodeableConceptType,
	FhirEncounter,
	FhirPatient,
} from "../types/fhir/resources";
import { Form, Button, Modal, Select, Space } from "antd";
import PageLinks from "../components/PageLinks";
import PreviousVisitSummary from "../components/PreviousVisitSummary";

export default function PatientSummary() {
	const { patientId } = useParams();
	// Set locastorage
	localStorage.setItem("patientId", patientId);
	console.log("patientId", patientId);

	const [patient, setPatient] = useState<FhirPatient>();
	const patientVisitSearchParameter = `${snomedUrl}|308335008`;
	const triageSearchParameter = `${snomedUrl}|225390008`;
	const [inProgressVisit, setInProgressVisit] = useState<FhirEncounter | null>(
		null,
	);
	const [previousVisits, setPreviousVisits] = useState([]);
	const [triage, setTriage] = useState<FhirEncounter | null>(null);
	const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

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

	async function getPatient() {
		try {
			let response = await server.get(`${patientUrl}/${patientId}`);
			console.log("patient start");
			console.log(response.data);
			console.log("patient end");
			setPatient(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	async function getInProgressVisitForPatient() {
		console.log("in progess call");
		try {
			console.log("in progess inside try call");
			let response = await server.get(
				`${encounterUrl}?patient=${patientId}&status=in-progress&type=${patientVisitSearchParameter}`,
			);

			if (response.data.total > 0) {
				console.log("in progess inside try inside if call");
				setInProgressVisit((prevInProgressVisit) => {
					return response.data.total > 0
						? response.data.entry[0].resource
						: prevInProgressVisit;
				});

				localStorage.setItem(
					"inProgressVisitId",
					response.data.entry[0].resource.id,
				);
			}

			// console.log("active visit start");
			// console.log(response.data.entry[0].resource);
			// console.log("active visit end");
		} catch (error) {
			console.error(error);
		}
	}

	async function getPreviousVisitsForPatient() {
		console.log("prevoise call");
		try {
			let response = await server.get(
				`${encounterUrl}?patient=${patientId}&status=finished&type=${patientVisitSearchParameter}`,
			);

			console.log("previous visits", response.data);
			if (response.data.total > 0) {
				console.log("previous visits start");
				console.log(response.data.entry);
				console.log("previous visits end");
				setPreviousVisits([...response.data.entry]);
				console.log("previous visits state", previousVisits);
				response.data.entry.map((visitEntry) => {
					console.log("visit entry", visitEntry.resource);
					setPreviousVisits((previousVisits) => [
						...previousVisits,
						visitEntry.resource,
					]);
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function getTriage() {
		try {
			console.log("checking in porgress visit in triage", inProgressVisit);
			// The code here is duplicated, the in progress visit is not updating...
			let inProgressVisitResponse = await server.get(
				`${encounterUrl}?patient=${patientId}&status=in-progress&type=${patientVisitSearchParameter}`,
			);

			if (inProgressVisitResponse.data.total > 0) {
				let response = await server.get(
					`${encounterUrl}?type=${triageSearchParameter}&part-of=Encounter/${inProgressVisitResponse.data.entry[0].resource.id}`,
				);

				if (response.data.total > 0) {
					setTriage(response.data.entry[0].resource);
					console.log("triage start");
					console.log(response.data.entry[0].resource);
					console.log("triage end");
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	function handleVisitFormFinish(values) {
		console.log(values);

		const startVisit: FhirEncounter = {
			resourceType: "Encounter",
			status: "in-progress",
			class: JSON.parse(values.class),
			subject: {
				reference: `Patient/${patientId}`,
			},
			period: {
				start: isoCurrentDate,
			},
			type: [
				{
					coding: [
						{
							system: "http://snomed.info/sct",
							code: "308335008",
							display: "Patient encounter procedure",
						},
					],
					text: "Patient Visit",
				},
			],
		};

		server
			.post(`${baseUrl}Encounter`, startVisit)
			.then((response) => {
				console.log(response.data);
				window.location.reload();
			})
			.catch((error) => console.error(error));

		setIsVisitModalOpen(false);
	}

	async function handleCheckoutVisit() {
		try {
			let inProgressVisitResponse = await server.get(
				`${encounterUrl}?patient=${patientId}&status=in-progress&type=${patientVisitSearchParameter}`,
			);

			let inProgressVisit: FhirEncounter =
				inProgressVisitResponse.data.entry[0].resource;

			console.log(inProgressVisit);
			let finishedVisit: FhirEncounter = {
				resourceType: "Encounter",
				id: inProgressVisit.id,
				status: "finished",
				class: inProgressVisit.class,
				subject: inProgressVisit.subject,
				period: {
					start: inProgressVisit.period.start,
					end: isoCurrentDate,
				},
				type: inProgressVisit.type,
			};

			let finishedVisitResponse = await server.put(
				`${baseUrl}Encounter/${inProgressVisit.id}`,
				finishedVisit,
			);

			console.log(finishedVisitResponse.data);

			// Reload
			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const asyncEffect = async () => {
			try {
				await getPatient();
				await getInProgressVisitForPatient();
				await getTriage();
				await getPreviousVisitsForPatient();
			} catch (error) {
				console.error(error);
			}
		};

		asyncEffect();
	}, []);

	return (
		<div className="page">
			<PageLinks />
			<div style={{ display: "flex", justifyContent: "center" }}>
				{inProgressVisit ? (
					<Button onMouseUp={() => handleCheckoutVisit()}>
						Check out of visit
					</Button>
				) : (
					<Button onMouseUp={() => setIsVisitModalOpen(true)}>
						Start Visit
					</Button>
				)}
			</div>
			{/* <p>Patient Id: {patientId}</p> */}
			<Space direction="vertical" size="middle">
				<Space direction="vertical" size="small">
					<h3>Name</h3>
					<p>{patient?.name[0].text}</p>
				</Space>
				<Space direction="vertical" size="small">
					<h3>Gender</h3>
					<p>{patient?.gender}</p>
				</Space>
				<Space direction="vertical" size="small">
					<h2>Previous Visits</h2>
					<div>
						{previousVisits.length == 0 ? (
							<p>No previous visits</p>
						) : (
							<div>
								<p>
									<i>
										There is an issue, currently the bare object is being
										displayed
									</i>
								</p>

								<code>{JSON.stringify(previousVisits)}</code>
							</div>
						)}
					</div>
				</Space>
				{inProgressVisit && (
					<>
						<h2>Done</h2>
						<div>
							{!triage && <p>None is completed</p>}
							{triage && triage.status == "finished" && <p>Triage Completed</p>}
						</div>
						<h2>To Do</h2>
						<div>
							{triage && <p>All are done</p>}
							{!triage && (
								<Link
									to={{
										pathname: "/triage",
									}}
								>
									Go To Triage
								</Link>
							)}
						</div>
					</>
				)}
			</Space>
			<Modal
				title="Type Of Visit"
				open={isVisitModalOpen}
				onCancel={() => setIsVisitModalOpen(false)}
				onOk={() => setIsVisitModalOpen(false)}
				footer={null}
			>
				<Form name="visitForm" onFinish={handleVisitFormFinish}>
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
					<Button htmlType="submit">Start Visit</Button>
				</Form>
			</Modal>
		</div>
	);
}
