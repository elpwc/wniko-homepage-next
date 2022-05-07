import { CSSProperties } from "react";
import { SVGClose } from "../../utils/svgs/winIcons";
import styles from "./index.module.css";

interface Props {
	children?: JSX.Element;
	title?: string | JSX.Element;
	visible: boolean;
	showOKButton?: boolean;
	showCloseButton?: boolean;
	OKButtonTitle?: string;
	closeButtonTitle?: string;
	destroyOnClose?: boolean;
	onClose?: (e?: any) => void;
	onOK?: (e?: any) => void;
	style?: CSSProperties;
}

const Modal = (props: Props) => {
	return (
		<div className={styles.container} style={{ display: props.visible ? "initial" : "none" }}>
			<div className={styles.modalBackground}>
				<div className={styles.modalBox} style={props.style}>
					<header className={styles.header}>
						<div className={styles.title}>{props.title}</div>
						<button onClick={props.onClose}>
							<SVGClose />
						</button>
					</header>

					<main className={styles.main}>{props.destroyOnClose && !props.visible ? <></> : props.children}</main>

					<footer className={styles.footer}>
						{props.showOKButton && (
							<button className="focus" onClick={props.onOK}>
								{props.OKButtonTitle || "OK"}
							</button>
						)}
						{props.showCloseButton && <button onClick={props.onClose}>{props.closeButtonTitle || "Close"}</button>}
					</footer>
				</div>
			</div>
		</div>
	);
};

export default Modal;
