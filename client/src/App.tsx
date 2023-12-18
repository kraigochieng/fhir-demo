import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PatientRegistration } from "./pages/PatientRegistration";
import Triage from "./pages/Triage";
import PatientCatalog from "./pages/PatientCatalog";
import PatientSummary from "./pages/PatientSummary";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path="registration" element={<PatientRegistration />} />
						<Route path="triage" element={<Triage />} />
						<Route path="catalog" element={<PatientCatalog />} />
						<Route path="catalog/:patientId" element={<PatientSummary />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
