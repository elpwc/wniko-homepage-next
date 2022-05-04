import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const Project = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <>projects{id}</>
    </Layout>
  );
};

export default Project;
