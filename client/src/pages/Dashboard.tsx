import { DashboardItem } from "../components/DashboardItem";

export const Dashboard = () => {
	return (
		<>
			<DashboardItem title="Registration" link="/registration" />
			{/* 			<DashboardItem title="Triage" link="/triage" /> */}
			<DashboardItem title="Catalog" link="/catalog" />
		</>
	);
};
