import { useEffect, useState } from "react";
import { server } from "../axiosInstances";
import { encounterUrl, patientUrl, snomedUrl } from "../urls";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
	CodeableConceptType,
	FhirEncounter,
	FhirPatient,
} from "../types/fhir/resources";
import { Button, Modal } from "antd";
import VisitForm from "../components/forms/VisitForm";

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
	const [previousVisits, setPreviousVisits] = useState<FhirEncounter[]>([]);
	const [triage, setTriage] = useState<FhirEncounter | null>(null);
	const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
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

			console.log("active visit start");
			console.log(response.data.entry[0].resource);
			console.log("active visit end");
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

			if (response.data.total > 0) {
				console.log("previous visits start");
				console.log(response.data.entry);
				console.log("previous visits end");
				response.data.entry.map((visitEntry) => {
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
		<div>
			<Link to="/catalog">Back To Catalog</Link>
			{inProgressVisit ? (
				<Button>Check out of visit</Button>
			) : (
				<Button onClick={() => setIsVisitModalOpen(true)}>Start Visit</Button>
			)}
			<p>Patient Id: {patientId}</p>
			<p>Gender: {patient?.gender}</p>
			<h2>Previous Visits</h2>
			<div>
				{previousVisits ? (
					<p>No previous visits</p>
				) : (
					<p>there are some visits</p>
				)}
			</div>
			<div></div>
			{inProgressVisit && (
				<>
					<h2>Done</h2>
					<div>
						{triage && triage.status == "finished" && (
							<p>Triage Completed: {triage.id}</p>
						)}
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
			<Modal title="Type Of Visit" open={isVisitModalOpen}>
				<VisitForm />
			</Modal>
		</div>
	);
}
