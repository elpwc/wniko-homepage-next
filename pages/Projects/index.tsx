import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { getProjects, postProject, update } from "../../services/api/Projects";
import styles from "../../styles/Project.module.css";
import { DevStatus } from "../../utils/enums/DevStatus";
import bootstrap from "bootstrap";
import moment from "moment";

const Project: NextPage = () => {
	const [projects, setprojects]: [API.Project[], any] = useState([]);
	const refreshProjects = () => {
		getProjects({}).then((res) => {
			setprojects(res);
		});
	};
	const [newProjectModalVisibility, setNewProjectModalVisibility]: [boolean, any] = useState(false);
	const [tagSelectValue, setTagSelectValue]: [string, any] = useState("");
	const [edit, setEdit]: [boolean, any] = useState(false);
	const [editedProject, setEditedProject]: [API.Project, any] = useState({} as API.Project);

	useEffect(() => {
		refreshProjects();
	}, []);

	console.log(projects);

	const shownStatus = [DevStatus.Done, DevStatus.Developing, DevStatus.Planning, DevStatus.NoMaintained, DevStatus.Abandoned];
	const shownStatusTitle = ["Done", "Developing", "Planning", "No Maintained", "Abandoned"];

	const onProjectSubmit = (values: any, isEdit: boolean = false) => {
		if (isEdit) {
			update({ id: editedProject.id.toString() }, values).then((res) => {
				console.log(res);
			});
		} else {
			postProject(values).then((res) => {
				console.log(res);
			});
		}
	};

	return (
		<Layout>
			<>
        <Modal visible={newProjectModalVisibility} showOKButton={false} showCloseButton={false}>
          <form className={styles.projectForm}>
            <label>项目名称<input type="text"/></label>
            <label>项目描述<textarea /></label>
            <label>项目描述<textarea /></label>

            <button className="focus" type='submit'>OK</button>
          </form>
        </Modal>

				<div>
					<button
						onClick={() => {
							setNewProjectModalVisibility(true);
						}}
					>
						add
					</button>
				</div>
				<div className={styles.projectContainer}>
					{shownStatus.map((status) => {
						return (
							<div key={status} className={styles.projectStatus}>
								<div>{shownStatusTitle?.[shownStatus.indexOf(status)]}</div>

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
			</>
		</Layout>
	);
};

export default Project;
