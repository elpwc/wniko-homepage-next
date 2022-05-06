import Image from "next/image";
import { DevStatus } from "../utils/enums/DevStatus";
import { SVGGitHub, SVGJumpOut } from "../utils/svgs/winIcons";
import styles from "./ProjectCard.module.css";

const StatusBadge = ({ status }: { status: DevStatus }) => {
  let backgroundColor = "black";
  let title = "unknown";

  switch (status) {
    case DevStatus.Empty:
      backgroundColor = "";
      title = "";
      break;
    case DevStatus.Done:
      backgroundColor = "rgb(67, 139, 67)";
      title = "已完成";
      break;
    case DevStatus.Developing:
      backgroundColor = "rgb(199, 186, 11)";
      title = "开发中";
      break;
    case DevStatus.NoMaintained:
      backgroundColor = "rgb(88, 88, 88)";
      title = "已停止维护";
      break;
    case DevStatus.Planning:
      backgroundColor = "rgb(65, 139, 168)";
      title = "计划中";
      break;
    case DevStatus.Abandoned:
      backgroundColor = "rgb(88, 88, 88)";
      title = "已废弃";
      break;
    default:
      backgroundColor = "";
      title = "";
      break;
  }

  return (
    <div className={styles.statusBadge} style={{ backgroundColor }}>
      {title}
    </div>
  );
};

const ProjectCard = ({ project }: { project: API.Project }) => {
  return (
    <div className={styles.projectListItem} key={project.name}>
      <div className={styles.title}>
        <StatusBadge status={project.status as DevStatus} />
        <a href={project.url} style={{ marginRight: "auto" }}>
          {project.name}
          &nbsp;
          {project.url ? (
            <sup>
              <SVGJumpOut w={10} h={10} />
            </sup>
          ) : (
            <></>
          )}
        </a>
        {project.githuburl !== null && project.githuburl !== "" ? (
          <a href={project.githuburl} style={{ display: "flex" }}>
            <SVGGitHub />
          </a>
        ) : (
          <></>
        )}
      </div>
      <div>

      {project.headImageUrl ? (
          <img src={project.headImageUrl} width="100%" alt={project.name} />
        ) : (
          <></>
        )}
        <div style={{ width: "auto" }}>
          <div className={styles.techList}>
            {project.technologies.map((tech) => {
              return <span key={tech}>{tech},</span>;
            })}
          </div>
          <div>{project.description}</div>
        </div>


      </div>
    </div>
  );
};

export default ProjectCard;
