import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Select } from "antd";

import { server } from "../../axiosInstances";
import { snomedUrl, patientProfileUrl, baseUrl, clientUrl } from "../../urls";
import {
	CodeableConceptType,
	FhirContact,
	FhirPatient,
	FhirExtension,
} from "../../types/fhir/resources";

export const PatientRegistrationForm = () => {
	enum GenderEnum {
		Male = "male",
		Female = "female",
	}

	const occupations: CodeableConceptType[] = [
		{
			code: "106388008",
			display: "Farmer",
		},
		{
			code: "65853000",
			display: "Student",
		},
		{
			code: "106538001",
			display: "Motor Vehicle Driver",
		},
		{
			code: "260413007",
			display: "None",
		},
		{
			code: "74964007",
			display: "Other",
		},
	];

	const educations: CodeableConceptType[] = [
		{
			code: "161119008",
			display: "Primary School",
		},
		{
			code: "161120002",
			display: "Secondary school",
		},
		{
			code: "224871002",
			display: "University",
		},
		{
			code: "260413007",
			display: "None",
		},
		{
			code: "74964007",
			display: "Other",
		},
	];

	const maritalStatuses: CodeableConceptType[] = [
		{
			code: "87915002",
			display: "Married",
		},
		{
			code: "125725006",
			display: "Single",
		},
		{
			code: "20295000",
			display: "Divorced",
		},
	];

	const relationships: CodeableConceptType[] = [
		{
			code: "6683905",
			display: "Father",
		},
		{
			code: "72705000",
			display: "Mother",
		},
		{
			code: "70924004",
			display: "Brother",
		},
		{
			code: "27733009",
			display: "Sister",
		},
		{
			code: "125677006",
			display: "Relative",
		},
		{
			code: "127848009",
			display: "Spouse",
		},
		{
			code: "158965000",
			display: "Doctor",
		},
	];

	type RelationshipType = {
		fullName?: string;
		relationship?: string;
	};

	type PatientRegistrationFormType = {
		firstName: string;
		middleName?: string;
		familyName: string;
		sex: GenderEnum;
		dateOfBirth?: string;
		birthCertificateNumber?: string;
		drivingLicenseNumber?: string;
		hudumaNumber?: string;
		nationalId?: string;
		passportNumber?: string;
		patientClinicNumber?: string;
		county?: string;
		subCounty?: string;
		ward?: string;
		telephoneContact?: string;
		alternatePhoneNumber?: string;
		postalAddress?: string;
		emailAddress?: string;
		location?: string;
		subLocation?: string;
		village?: string;
		landmark?: string;
		nearestHealthCentre?: string;
		maritalStatus: string;
		occupation: string;
		education: string;
		relationships?: RelationshipType[];
		nextOfKinName?: string;
		nextOfKinRelationship?: string;
		nextOfKinPhoneNumber?: string;
		nextOfKinPostalAddress?: string;
	};

	const handleFinish = (values: PatientRegistrationFormType) => {
		// deconstruct codeable concept strings
		const occupation: CodeableConceptType = JSON.parse(values.occupation);
		const education: CodeableConceptType = JSON.parse(values.education);

		const contacts: FhirContact[] = values.relationships?.map(
			(relationshipFormData) => {
				const relationship: CodeableConceptType = JSON.parse(
					relationshipFormData.relationship,
				);
				return {
					name: {
						text: relationshipFormData.fullName,
					},
					relationship: [
						{
							code: relationship.code,
							display: relationship.display,
						},
					],
				};
			},
		);
		// make extensions string
		let extensions: FhirExtension[] = [
			{
				url: patientProfileUrl + "#birthCertificateNumberExtension",
				valueString: values.birthCertificateNumber,
			},
			{
				url: patientProfileUrl + "#drivingLicenseNumberExtension",
				valueString: values.drivingLicenseNumber,
			},
			{
				url: patientProfileUrl + "#hudumaNumberExtension",
				valueString: values.hudumaNumber,
			},
			{
				url: patientProfileUrl + "#nationalIdExtension",
				valueString: values.nationalId,
			},
			{
				url: patientProfileUrl + "#patientClinicNumberExtension",
				valueString: values.patientClinicNumber,
			},
			{
				url: patientProfileUrl + "#occupationExtension",
				valueCodeableConcept: {
					coding: [
						{
							system: snomedUrl,
							code: occupation.code,
							display: occupation.display,
						},
					],
				},
			},
			{
				url: patientProfileUrl + "#educationConcept",
				valueCodeableConcept: {
					coding: [
						{
							system: snomedUrl,
							code: education.code,
							display: education.display,
						},
					],
				},
			},
			{
				url: patientProfileUrl + "#nextOfKinNameExtension",
				valueString: values.nextOfKinName,
			},
			{
				url: patientProfileUrl + "#patientClinicNumberExtension",
				valueString: values.nextOfKinRelationship,
			},
			{
				url: patientProfileUrl + "#patientClinicNumberExtension",
				valueString: values.nextOfKinPhoneNumber,
			},
			{
				url: patientProfileUrl + "#patientClinicNumberExtension",
				valueString: values.nextOfKinPostalAddress,
			},
		];

		let fhirPatient: FhirPatient = {
			resourceType: "Patient",
			name: [
				{
					family: values.familyName,
					given: [values.firstName, values.middleName],
					text: `${values.firstName} ${
						values.middleName ? values.middleName + " " : ""
					}${values.familyName}`,
				},
			],
			telecom: values.telephoneContact,
			gender: values.sex,
			maritalStatus: JSON.parse(values.maritalStatus),
			extension: extensions,
			contact: contacts,
		};
		console.log(values);
		console.log(fhirPatient);

		server
			.post("Patient", fhirPatient)
			.then((response) => {
				console.log(response.data);
				const fhirPatientResponse: FhirPatient = response.data;
				localStorage.setItem("patientId", fhirPatientResponse.id);

				window.location.href = `${clientUrl}/catalog/${fhirPatientResponse.id}`;
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// const [form] = Form.useForm();

	return (
		<Form name="patientRegistrationForm" onFinish={handleFinish}>
			{/* Basic Info */}
			<h1>1. Basic Info</h1>
			<Form.Item
				label="First Name"
				name="firstName"
				rules={[
					{
						required: true,
						message: "Please input first name",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item label="Middle Name(optional)" name="middleName">
				<Input />
			</Form.Item>
			<Form.Item
				label="Family Name"
				name="familyName"
				rules={[
					{
						required: true,
						message: "Please input family name",
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Sex"
				name="sex"
				rules={[
					{
						required: true,
						message: "Please input sex",
					},
				]}
			>
				<Radio.Group>
					{Object.keys(GenderEnum).map((gender, index) => {
						return (
							<Radio key={index} value={GenderEnum[gender]}>
								{gender}
							</Radio>
						);
					})}
				</Radio.Group>
			</Form.Item>
			<Form.Item
				label="Birth Certificate Number(optional)"
				name="birthCertificateNumber"
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Driving License Number(optional)"
				name="drivingLicenseNumber"
			>
				<Input />
			</Form.Item>
			<Form.Item label="Huduma Number(optional)" name="hudumaNumber">
				<Input />
			</Form.Item>
			<Form.Item label="National ID(optional)" name="nationalId">
				<Input />
			</Form.Item>
			<Form.Item label="Passport Number(optional)" name="passportNumber">
				<Input />
			</Form.Item>
			<Form.Item
				label="Patient Clinic Number(optional)"
				name="patientClinicNumber"
			>
				<Input />
			</Form.Item>
			<Form.Item
				label="Marital Status"
				name="maritalStatus"
				rules={[
					{
						required: true,
						message: "Please input maital status",
					},
				]}
			>
				<Select
					options={maritalStatuses.map(
						(maritalStatus: CodeableConceptType) => ({
							value: JSON.stringify(maritalStatus),
							label: maritalStatus.display,
						}),
					)}
				/>
			</Form.Item>
			<Form.Item
				label="Occupation"
				name="occupation"
				rules={[
					{
						required: true,
						message: "Please input occupation",
					},
				]}
			>
				<Select
					options={occupations.map((occupation: CodeableConceptType) => ({
						value: JSON.stringify(occupation),
						label: occupation.display,
					}))}
				/>
			</Form.Item>
			<Form.Item
				label="Education"
				name="education"
				rules={[
					{
						required: true,
						message: "Please input education",
					},
				]}
			>
				<Select
					options={educations.map((education: CodeableConceptType) => ({
						value: JSON.stringify(education),
						label: education.display,
					}))}
				/>
			</Form.Item>
			{/* 4. Relationships */}
			<Form.List name="relationships">
				{(fields, { add, remove }) => (
					<>
						{fields.map((field) => (
							<div key={field.key}>
								<Form.Item name={[field.name, "fullName"]} label="Full Name">
									<Input />
								</Form.Item>
								<Form.Item
									name={[field.name, "relationship"]}
									label="Relationship"
								>
									<Select
										options={relationships.map(
											(relationshipCode: CodeableConceptType) => ({
												value: JSON.stringify(relationshipCode),
												label: relationshipCode.display,
											}),
										)}
									/>
								</Form.Item>
								<Button
									htmlType="button"
									icon={<DeleteOutlined />}
									onClick={() => remove(field.name)}
								>
									Remove Relationship
								</Button>
							</div>
						))}
						<Button htmlType="button" onClick={() => add()}>
							Add Relationship
						</Button>
					</>
				)}
			</Form.List>

			{/* 5. Next of kin Details*/}
			<Form.Item label="Name (optional)" name="nextOfKinName">
				<Input />
			</Form.Item>
			<Form.Item label="Relationship (optional)" name="nextOfKinRelationship">
				<Input />
			</Form.Item>
			<Form.Item label="Phone Number(optional)" name="nextOfKinPhoneNumber">
				<Input />
			</Form.Item>
			<Form.Item
				label="Postal Address (optional)"
				name="nextOfKinPostalAddress"
			>
				<Input />
			</Form.Item>

			<Button htmlType="submit" onSubmit={(values) => console.log(values)}>
				Register Patient
			</Button>
		</Form>
	);
};
