import { DashboardItem } from "../components/DashboardItem";
import { Row, Col } from "antd";

export const Dashboard = () => {
	return (
		<div className="page">
			<div id="dashboard-items-container">
				<Row justify="space-evenly">
					<Col span={12}>
						<DashboardItem title="Registration" link="/registration" />
					</Col>
					<Col span={12}>
						<DashboardItem title="Catalog" link="/catalog" />
					</Col>
					{/* 			<DashboardItem title="Triage" link="/triage" /> */}
				</Row>
			</div>
		</div>
	);
};
