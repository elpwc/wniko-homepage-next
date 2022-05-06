import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { getProjects, postProject, update } from "../../services/api/Projects";
import styles from "../../styles/Project.module.css";
import { DevStatus } from "../../utils/enums/DevStatus";
import bootstrap from "bootstrap";
import moment from "moment";
import ProjectCard from "../../components/ProjectCard";

const Project: NextPage = () => {
  const [projects, setprojects]: [API.Project[], any] = useState([]);
  const refreshProjects = () => {
    getProjects({}).then((res) => {
      setprojects(res);
    });
  };
  const [newProjectModalVisibility, setNewProjectModalVisibility]: [
    boolean,
    any
  ] = useState(false);
  const [tagSelectValue, setTagSelectValue]: [string, any] = useState("");
  const [edit, setEdit]: [boolean, any] = useState(false);
  const [editedProject, setEditedProject]: [API.Project, any] = useState(
    {} as API.Project
  );
  const [newProjectModalSelectedType, setnewProjectModalSelectedType]: [
    DevStatus,
    any
  ] = useState(DevStatus.Done);

  useEffect(() => {
    refreshProjects();
  }, []);

  console.log(projects);

  const shownStatus = [
    DevStatus.Done,
    DevStatus.Developing,
    DevStatus.Planning,
    DevStatus.NoMaintained,
    DevStatus.Abandoned,
  ];
  const shownStatusTitle = [
    "Done",
    "Developing",
    "Planning",
    "No Maintained",
    "Abandoned",
  ];

  const submitProject = (
    values: API.CreateProjectDto,
    isEdit: boolean = false
  ) => {
    const onSuc = () => {
      setNewProjectModalVisibility(false);
      refreshProjects();
    };

    if (isEdit) {
      update({ id: editedProject.id.toString() }, values)
        .then((res) => {
          console.log(res);
        })
        .then((res) => {
          onSuc();
        });
    } else {
      postProject(values)
        .then((res) => {
          console.log(res);
        })
        .then((res) => {
          onSuc();
        });
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
    });
  };

  return (
    <Layout
      title="Wniko - 项目一览"
      right={
        <div>
          <button
            onClick={() => {
              setNewProjectModalVisibility(true);
            }}
          >
            add
          </button>
        </div>
      }
    >
      <>
        <Modal
          visible={newProjectModalVisibility}
          showOKButton={false}
          showCloseButton={false}
          onClose={() => {
            setNewProjectModalVisibility(false);
          }}
        >
          <form className={styles.projectForm} onSubmit={onFormSubmit}>
            <label>
              项目名称
              <input name="name" type="text" />
            </label>
            <label>
              项目描述
              <textarea name="desc" />
            </label>
            <label>
              URL
              <input name="url" type="text" />
            </label>
            <label>
              GitHub
              <input name="github" type="text" />
            </label>
            <label>
              版本
              <input name="version" type="text" />
            </label>
            <label>
              图像
              <input name="image" type="text" />
            </label>
            <label>
              技术
              <input name="tech" type="text" />
            </label>
            <label>
              状态
              <select
                name="status"
                onChange={(e) => {
                  setnewProjectModalSelectedType(e.target.value);
                }}
              >
                <option value={DevStatus.Done}>完成</option>
                <option value={DevStatus.Developing}>开发中</option>
                <option value={DevStatus.NoMaintained}>停止维护</option>
                <option value={DevStatus.Planning}>计划中</option>
                <option value={DevStatus.Abandoned}>放弃</option>
              </select>
            </label>
            <label>
              日期
              <input name="date" type="datetime-local" />
            </label>
            <label>
              <input name="private" type="checkbox" />
              设为私有
            </label>

            <button className="focus" type="submit">
              OK
            </button>
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
                      return (
                        <ProjectCard key={project.name} project={project} />
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
