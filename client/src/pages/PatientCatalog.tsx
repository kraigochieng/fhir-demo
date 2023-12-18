import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { patientUrl } from "../urls";
import { server } from "../axiosInstances";
import { FhirPatient } from "../types/fhir/resources";
import { useState, useRef } from "react";
import PatientCatalogResult from "../components/PatientCatalogResult";

export default function PatientCatalog() {
	const [patientSearchResults, setPatientSearchResults] = useState<
		FhirPatient[]
	>([]);

	const [searchValue, setSearchValue] = useState<string>();

	const searchResultBox = useRef<HTMLDivElement | null>(null);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchValue(event.currentTarget.value);
	}

	function searchPatients() {
		// Clear result box
		const currentSearchResultBox = searchResultBox.current;
		if (currentSearchResultBox) {
			currentSearchResultBox.textContent = "";
		}

		// Get results
		server
			.get(`${patientUrl}/?name=${searchValue}`)
			.then((response) => {
				const patientEntries = response.data.entry;

				console.log(response.data.entry);

				// If there are no results, return values
				console.log(patientEntries);
				if (patientEntries == undefined) {
					const currentSearchResultBox = searchResultBox.current;
					if (currentSearchResultBox) {
						currentSearchResultBox.textContent = `Patient with name '${searchValue}' is not found.`;
					}
				} else {
					patientEntries.map((patientEntry) => {
						setPatientSearchResults((prev) => [...prev, patientEntry.resource]);
					});
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}
	function handleEnter() {
		searchPatients();
	}

	function handleMouseUp() {
		searchPatients();
	}

	return (
		<>
			<Input
				onPressEnter={handleEnter}
				onChange={(event) => handleChange(event)}
				value={searchValue}
			/>
			<Button icon={<SearchOutlined />} onMouseUp={handleMouseUp} />
			<div id="searchResultBox" ref={searchResultBox}>
				{patientSearchResults.map((patientSearchResult, index) => (
					<div key={index}>
						<PatientCatalogResult patient={patientSearchResult} />
					</div>
				))}
			</div>
		</>
	);
}
