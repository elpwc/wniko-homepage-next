import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { getAllProject, postProject, patchProject, deleteProject } from "../../services/api/Projects";
import styles from "../../styles/Project.module.css";
import { DevStatus } from "../../utils/enums/DevStatus";
import bootstrap from "bootstrap";
import moment from "moment";
import ProjectCard, { StatusBadge } from "../../components/ProjectCard";
import { ApiError } from "next/dist/server/api-utils";
import { SVGCalender, SVGGitHub, SVGJumpOut } from "../../utils/svgs/winIcons";
import MessageBox, { MessageBoxType } from "../../components/MessageBox";

const Project: NextPage = () => {
	const [projects, setprojects]: [API.Project[], any] = useState([]);
	const refreshProjects = () => {
		getAllProject({}).then((res) => {
			setprojects(res);
		});
	};
	const [newProjectModalVisibility, setNewProjectModalVisibility]: [boolean, any] = useState(false);
	const [deleteMsgboxVisibility, setdeleteMsgboxVisibility]: [boolean, any] = useState(false);
	const [tagSelectValue, setTagSelectValue]: [string, any] = useState("");
	const [modalShowMode, setmodalShowMode]: [number, any] = useState(0); // 0 new 1 show 2 edit
	const [editedProject, setEditedProject]: [API.Project, any] = useState({} as API.Project);
	const [newProjectModalSelectedType, setnewProjectModalSelectedType]: [DevStatus, any] = useState(DevStatus.Done);

	useEffect(() => {
		refreshProjects();
	}, []);

	const clearForm = () => {};

	const shownStatus = [DevStatus.Done, DevStatus.Developing, DevStatus.Planning, DevStatus.NoMaintained, DevStatus.Abandoned];
	const shownStatusTitle = ["Done", "Developing", "Planning", "No Maintained", "Abandoned"];

	const closeNewProjectModal = () => {
		setNewProjectModalVisibility(false);
		setEditedProject({} as API.Project);
	};

	const submitProject = (values: API.CreateProjectDto, isEdit: boolean = false) => {
		const onSuc = () => {
			closeNewProjectModal();
			refreshProjects();
		};

		if (isEdit) {
			patchProject({ id: editedProject.id.toString() }, values)
				.then((res) => {
					onSuc();
				})
		} else {
			postProject(values)
				.then((res) => {
					onSuc();
				})
		}
	};

	const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data: any = e.target as any;

		submitProject({
			name: data.name.value,
			description: data.desc.value,
			url: data.url.value,
			headImageUrl: data.image.value,
			githuburl: data.github.value,
			starttime: data.date.value,
			version: data.version.value,
			technologies: data.tech.value.split(","),
			/** 状态 */
			status: newProjectModalSelectedType,
			isprivate: data.private.value === "on",
		}, modalShowMode === 2);
	};

	const onTitleClick = (clickedProject: API.Project) => {
		setEditedProject(clickedProject);
		setmodalShowMode(1);
		setNewProjectModalVisibility(true);
	};

	const onDelete = () => {
		deleteProject({ id: editedProject.id.toString() }).then((res) => {
			console.log(res);
			setdeleteMsgboxVisibility(false);
			setNewProjectModalVisibility(false);
			refreshProjects();
		});
	};

	return (
		<Layout
			title="Wniko - 项目一览"
			right={
				<div>
					<button
						onClick={() => {
							setEditedProject({} as API.Project);
							setmodalShowMode(0);
							setNewProjectModalVisibility(true);
						}}
					>
						add
					</button>
				</div>
			}
		>
			<>
				<MessageBox
					visible={deleteMsgboxVisibility}
					onClose={() => {
						setdeleteMsgboxVisibility(false);
					}}
					onOK={() => {
						onDelete();
					}}
					message="确认删除？"
					type={MessageBoxType.Exclamation}
          showCloseButton={true}
          showOKButton={true}
				/>
				<Modal
					visible={newProjectModalVisibility}
					showOKButton={false}
					showCloseButton={true}
					closeButtonTitle="关闭"
					destroyOnClose={true}
					title={(() => {
						switch (modalShowMode) {
							case 0:
								return "添加项目";
							case 1:
								return (
									<div className={styles.modalShowModeheader}>
										<StatusBadge status={editedProject.status as DevStatus} />
										<div className={styles.modalShowModetitle}>{editedProject.name}</div>
										{editedProject.version && (
											<div className={styles.modalShowModetitle} style={{ color: "gray", fontSize: "1rem", fontWeight: "normal" }}>
												ver. {editedProject.version}
											</div>
										)}
									</div>
								);
							case 2:
								return `编辑 ${editedProject.name}`;
							default:
								return "";
						}
					})()}
					onClose={() => {
						closeNewProjectModal();
					}}
				>
					<form className={styles.projectForm} onSubmit={onFormSubmit}>
						{modalShowMode === 1 ? (
							<div>
								<div className={styles.modalShowModemain}>
									<div style={{ width: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
										<div className={styles.modalShowModetechList}>
											{editedProject.technologies.map((tech) => {
												return <span key={tech}>{tech},</span>;
											})}
										</div>
										<div>{editedProject.description}</div>

										<a href={editedProject.url} target="_blank" rel="noreferrer" style={{ display: "flex" }}>
											<SVGJumpOut />
											{editedProject.url || "未设置"}
										</a>

										<a href={editedProject.githuburl} target="_blank" rel="noreferrer" style={{ display: "flex" }}>
											<SVGGitHub />
											{editedProject.githuburl || "未设置"}
										</a>

										<div>
											<SVGCalender />
											{editedProject.starttime || "未设置"}
										</div>
									</div>

									{editedProject.headImageUrl ? <img src={editedProject.headImageUrl} width="40%" height="40%" alt={editedProject.name} /> : <></>}
								</div>
							</div>
						) : (
							<div className={styles.formItems}>
								<label>
									<span>项目名称</span>
									<div className={styles.projectFormComponent}>
										<input name="name" type="text" defaultValue={modalShowMode === 2 ? editedProject.name : ""} />
									</div>
								</label>
								<label style={{ width: "80%", height: "10rem", marginBottom: "1rem" }}>
									<span>项目描述</span>
									<div className={styles.projectFormComponent} style={{ height: "inherit" }}>
										<textarea name="desc" defaultValue={modalShowMode === 2 ? editedProject.description : ""} style={{ height: "100%" }} />
									</div>
								</label>
								<label>
									<span>URL</span>
									<div className={styles.projectFormComponent}>
										<input name="url" type="text" defaultValue={modalShowMode === 2 ? editedProject.url : ""} />
									</div>
								</label>
								<label>
									<span>GitHub</span>
									<div className={styles.projectFormComponent}>
										<input name="github" type="text" defaultValue={modalShowMode === 2 ? editedProject.githuburl : ""} />
									</div>
								</label>
								<label>
									<span>版本</span>
									<div className={styles.projectFormComponent}>
										<input name="version" type="text" defaultValue={modalShowMode === 2 ? editedProject.version : ""} />
									</div>
								</label>
								<label>
									<span>图像</span>
									<div className={styles.projectFormComponent}>
										<input name="image" type="text" defaultValue={modalShowMode === 2 ? editedProject.headImageUrl : ""} />
									</div>
								</label>
								<label>
									<span>技术</span>
									<div className={styles.projectFormComponent}>
										<input name="tech" type="text" defaultValue={modalShowMode === 2 ? editedProject.technologies?.join(",") : ""} />
									</div>
								</label>
								<label>
									<span>状态</span>
									<div className={styles.projectFormComponent}>
										<select
											name="status"
											onChange={(e) => {
												setnewProjectModalSelectedType(e.target.value);
											}}
											value={modalShowMode === 2 ? (editedProject.status as DevStatus) : ""}
										>
											<option value={DevStatus.Done}>完成</option>
											<option value={DevStatus.Developing}>开发中</option>
											<option value={DevStatus.NoMaintained}>停止维护</option>
											<option value={DevStatus.Planning}>计划中</option>
											<option value={DevStatus.Abandoned}>放弃</option>
										</select>
									</div>
								</label>
								<label>
									<span>日期</span>
									<div className={styles.projectFormComponent}>
										<input name="date" type="datetime-local" defaultValue={modalShowMode === 2 ? editedProject.starttime : ""} />
									</div>
								</label>
								<label>
									<span>设为私有</span>
									<div className={styles.projectFormComponent}>
										<input name="private" type="checkbox" checked={modalShowMode === 2 ? editedProject.isprivate : false} />
									</div>
								</label>
							</div>
						)}

						<div style={{ display: "flex", flexDirection: "column", gap: "15px", minWidth: "max-content", justifyContent: "flex-start" }}>
							{modalShowMode === 1 ? (
								<button
									onClick={() => {
										setmodalShowMode(2);
									}}
								>
									编辑
								</button>
							) : (
								<></>
							)}
							{modalShowMode === 2 ? (
								<button
									onClick={() => {
										setmodalShowMode(1);
									}}
								>
									取消编辑
								</button>
							) : (
								<></>
							)}
							{modalShowMode === 2 ? (
								<button
									onClick={() => {
										setdeleteMsgboxVisibility(true);
									}}
								>
									删除
								</button>
							) : (
								<></>
							)}
							{modalShowMode === 2 ? (
								<button className="focus" type="submit">
									OK
								</button>
							) : (
								<></>
							)}
						</div>
					</form>
				</Modal>

				<div className={styles.projectContainer}>
					{shownStatus.map((status) => {
						return (
							<div key={status} className={styles.projectStatus}>
								{/*<div>{shownStatusTitle?.[shownStatus.indexOf(status)]}</div>*/}

								<div className={styles.projectList}>
									{projects
										.filter((f) => {
											return (f.status as DevStatus) === status;
										})
										.map((project: API.Project) => {
											return <ProjectCard key={project.name} project={project} onTitleClick={onTitleClick} />;
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
