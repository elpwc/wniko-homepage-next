import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Menu.module.css";

const MenuItem = (props: { children: JSX.Element | string; href: string; checked?: boolean }) => {
	return (
		<Link href={props.href} passHref>
			<div className={styles.navitem + (props.checked ? " " + styles.checked : "")}>{props.children}</div>
		</Link>
	);
};

const Menu = () => {
	const router = useRouter();

	return (
		<nav className={styles.nav}>
			<MenuItem href="/" checked={router.route.split("/")?.[1] === ""}>
				Homepage
			</MenuItem>
			<MenuItem href="/projects" checked={router.route.split("/")?.[1] === "projects"}>
				Projects
			</MenuItem>
			<MenuItem href="" checked={router.route.split("/")?.[1] === "blogs"}>
				Blogs
			</MenuItem>
			<MenuItem href="" checked={router.route.split("/")?.[1] === "illust"}>
				Illust
			</MenuItem>
			<MenuItem href="" checked={router.route.split("/")?.[1] === "contact"}>
				Contact
			</MenuItem>
		</nav>
	);
};

export default Menu;
