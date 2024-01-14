import { Button, Form, Space } from "antd";
import { Input } from "antd";
import {
    baseUrl,
    bundleUrl,
    clientUrl,
    encounterUrl,
    loincUrl,
    unitsOfMeasureUrl,
} from "../../urls";
import { FhirBundle } from "../../types/fhir/resources";
import { server } from "../../axiosInstances";
export default function TriageForm() {
    const patientId = localStorage.getItem("patientId");
    const inProgressVisitId = localStorage.getItem("inProgressVisitId");
    const triageId = "urn:uuid:triageId";
    const currentDate = new Date();
    const isoCurrentDate = currentDate.toISOString();
    localStorage.setItem("startingIsoCurrentDate", isoCurrentDate);

    type TriageFormData = {
        reasonForVisit: string;
        temperature: string;
        pulseRate: string;
        diastolicBloodPressure: string;
        systolicBloodPressure: string;
        respiratoryRate: string;
        oxygenSaturation: string;
        weight: string;
        height: string;
    };

    function handleFinish(values: TriageFormData) {
        console.log(values);
        console.log(patientId);
        console.log(inProgressVisitId);

        const fhirBundle: FhirBundle = {
            resourceType: "Bundle",
            type: "transaction",
            entry: [
                {
                    fullUrl: triageId,
                    resource: {
                        resourceType: "Encounter",
                        status: "finished",
                        class: {
                            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                            code: "AMB",
                            display: "ambulatory",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        period: {
                            start: isoCurrentDate,
                            end: isoCurrentDate,
                        },
                        type: [
                            {
                                coding: [
                                    {
                                        system: "http://snomed.info/sct",
                                        code: "225390008",
                                        display: "Triage",
                                    },
                                ],
                                text: "Triage",
                            },
                        ],
                        partOf: {
                            reference: `Encounter/${inProgressVisitId}`,
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Encounter",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "8310-5",
                                    display: "Body Temperature",
                                },
                            ],
                            text: "Temperature",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.temperature,
                            unit: "C",
                            system: unitsOfMeasureUrl,
                            code: "Cel",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "8889-8",
                                    display: "Heart rate by Pulse oximetry",
                                },
                            ],
                            text: "Pulse Rate",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.pulseRate,
                            unit: "bpm",
                            system: unitsOfMeasureUrl,
                            code: "g· m/H.B.",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "96608-5",
                                    display: "Systolic blood pressure mean",
                                },
                            ],
                            text: "Systolic Blood Pressure",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.systolicBloodPressure,
                            unit: "mmHg",
                            system: unitsOfMeasureUrl,
                            code: "m Hg",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "96609-3",
                                    display: "Diastolic blood pressure mean",
                                },
                            ],
                            text: "Diastolic Blood Pressure",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.diastolicBloodPressure,
                            unit: "mmHg",
                            system: unitsOfMeasureUrl,
                            code: "m Hg",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "9279-1",
                                    display: "Respiratory Rate",
                                },
                            ],
                            text: "Blood Pressure",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.respiratoryRate,
                            unit: "breaths/min",
                            system: unitsOfMeasureUrl,
                            code: "mL/kg/min",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "29643-7",
                                    display: "Body weight",
                                },
                            ],
                            text: "Weight(kg)",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.weight,
                            unit: "kg",
                            system: unitsOfMeasureUrl,
                            code: "kg",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
                {
                    resource: {
                        resourceType: "Observation",
                        status: "final",
                        code: {
                            coding: [
                                {
                                    system: loincUrl,
                                    code: "8302-2",
                                    display: "Body height",
                                },
                            ],
                            text: "Height(cm)",
                        },
                        subject: {
                            reference: `Patient/${patientId}`,
                        },
                        encounter: {
                            reference: `${triageId}`,
                        },
                        valueQuantity: {
                            value: values.height,
                            unit: "cm",
                            system: unitsOfMeasureUrl,
                            code: "cm",
                        },
                    },
                    request: {
                        method: "POST",
                        url: "Observation",
                    },
                },
            ],
        };

        console.log(fhirBundle);

        // POST Bundle
        server
            .post(baseUrl, fhirBundle)
            .then((response) => {
                console.log(response.data);
                window.location.href = `${clientUrl}/catalog/${patientId}`;
            })
            .catch((error) => console.error(error));
    }

    return (
        <div>
            <Form name="triageForm" onFinish={handleFinish}>
                <Form.Item label="Reason for visit" name="reasonForVisit">
                    <Input />
                </Form.Item>
                <Form.Item label="Temp" name="temperature">
                    <Input
                        addonAfter="
°C"
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Form.Item label="Pulse Rate" name="pulseRate">
                    <Input
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Form.Item label="Respiratory Rate" name="respiratoryRate">
                    <Input
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Space>
                    <Form.Item label="BP" name="systolicBloodPressure">
                        <Input
                            type="number"
                            style={{
                                appearance: "textfield",
                            }}
                        />
                    </Form.Item>
                    <p>/</p>
                    <Form.Item name="diastolicBloodPressure">
                        <Input
                            type="number"
                            style={{
                                appearance: "textfield",
                            }}
                        />
                    </Form.Item>
                </Space>
                <Form.Item label="Oxygen Saturation" name="oxygenSaturation">
                    <Input
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Weight"
                    name="weight"
                    rules={[
                        {
                            required: true,
                            message: "Please input weight",
                        },
                    ]}
                >
                    <Input
                        addonAfter="kg"
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Height"
                    name="height"
                    rules={[
                        {
                            required: true,
                            message: "Please input height",
                        },
                    ]}
                >
                    <Input
                        addonAfter="cm"
                        type="number"
                        style={{
                            appearance: "textfield",
                        }}
                    />
                </Form.Item>
                <Button htmlType="submit">Enter Form</Button>
                <Button htmlType="reset">Discard Changes</Button>
            </Form>
        </div>
    );
}
