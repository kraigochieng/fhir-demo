export type CodeableConceptType = {
	system?: string;
	code: string;
	display: string;
};

export type FhirHumanNamePatientName = {
	family: string;
	given: string[];
	text: string;
};

export type FhirHumanNameContact = {
	text?: string;
};

export type FhirContact = {
	name?: FhirHumanNameContact[];
	relationship?: CodeableConceptType;
};

export type FhirReference = {
	type?: string;
	reference: string;
};

export type FhirCoding = {
	system?: string;
	code?: string;
	display?: string;
};

type FhirEncounterPeriod = {
	start: string;
	end?: string;
};

export type FhirEncounter = {
	resourceType: "Encounter";
	id?: string;
	class: CodeableConceptType;
	status: "finished" | "in-progress";
	type: FhirValueCodeableConcept[];
	subject?: FhirReference;
	period: FhirEncounterPeriod;
	partOf: FhirReference;
};

export type FhirValueCodeableConcept = {
	coding?: FhirCoding[];
	text: string;
};

export type FhirExtension = {
	url?: string;
	valueString?: string;
	valueCodeableConcept?: FhirValueCodeableConcept;
};

export type FhirPatient = {
	resourceType: "Patient";
	id?: string;
	name: FhirHumanNamePatientName[];
	telecom: string;
	gender: "male" | "female";
	maritalStatus: CodeableConceptType;
	contact?: FhirContact[];
	extension?: FhirExtension[];
};

export type ObservationCodeCoding = {
	system: string;
	code: string;
	display: string;
};

export type ValueQuantity = {
	value: string;
	unit: string;
	system: string;
	code: string;
};

export type Reference = {
	reference: string;
};

export type ObservationCode = {
	coding: ObservationCodeCoding[];
	text: string;
};

export type Observation = {
	resourceType: "Observation";
	status: "final";
	code: ObservationCode;
	subject: FhirReference;
	encounter: FhirReference;
	valueQuantity: ValueQuantity;
};

export type FhirBundleEntryRequest = {
	method: "POST" | "GET";
	url: string;
};

export type FhirBundleEntry = {
	fullUrl?: string;
	resource: Observation | FhirEncounter;
	request: FhirBundleEntryRequest;
};

export type FhirBundle = {
	resourceType: "Bundle";
	type: "transaction";
	entry: FhirBundleEntry[];
};
