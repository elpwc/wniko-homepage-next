import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getProjects } from "../../services/api/Projects";
import styles from "../../styles/Project.module.css";
import { DevStatus } from "../../utils/enums/DevStatus";

const Project: NextPage = () => {
	const [projects, setprojects]: [API.CreateProjectDto[], any] = useState([]);
	const refreshProjects = () => {
		getProjects({}).then((res) => {
			setprojects(res);
		});
	};

	useEffect(() => {
		refreshProjects();
	}, []);

	console.log(projects);

	const shownStatus = [DevStatus.Done, DevStatus.Developping, DevStatus.Planning, DevStatus.Dispose];
	return (
		<Layout>
			<div className={styles.projectContainer}>
				{shownStatus.map((status) => {
					return (
						<div key={status} className={styles.projectStatus}>
              
							<div>{status}</div>

							<div className={styles.projectList}>
								{projects
									.filter((f) => {
										return (f.status as DevStatus) === status;
									})
									.map((project: API.CreateProjectDto) => {
										return (
											<div className={styles.projectListItem} key={project.name}>
												<div> {project.name} </div>
												<div>{project.description}</div>
											</div>
										);
									})}
							</div>
						</div>
					);
				})}
			</div>
		</Layout>
	);
};

export default Project;
