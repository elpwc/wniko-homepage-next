import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { ProjectsControllerFindAll } from "../../services/api/Projects";

const Project: NextPage = () => {
	const [projects, setprojects]: [API.CreateProjectDto[], any] = useState([]);
	const refreshProjects = () => {
		ProjectsControllerFindAll({}).then((res) => {
			console.log(res);
		});
	};

  useEffect(() => {
    refreshProjects();
  }, [])

	return <Layout>projects</Layout>;
};

export default Project;
