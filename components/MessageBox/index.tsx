import { useState } from "react";
import { SVGError, SVGExclamation } from "../../utils/svgs/msgBoxIcons";
import Modal from "../Modal";

export enum MessageBoxType {
	Normal,
	Exclamation,
	Error,
	Input,
}

interface Props {
	visible: boolean;
	message?: string;
	type?: MessageBoxType;
	showOKButton?: boolean;
	showCloseButton?: boolean;
	OKButtonText?: string;
	closeButtonText?: string;
	onOK?: (value?: string) => void;
	onClose?: (value?: string) => void;
}

const MessageBox = (props: Props = { visible: false, message: "", type: MessageBoxType.Normal, showOKButton: true, showCloseButton: true, OKButtonText: "确定", closeButtonText: "取消", onOK: () => {}, onClose: () => {} }) => {
	const [value, setvalue]: [string, any] = useState("");

	return (
		<Modal
			visible={props.visible}
			showCloseButton={props.showCloseButton}
			showOKButton={props.showOKButton}
			OKButtonTitle={props.OKButtonText}
			closeButtonTitle={props.closeButtonText}
			onOK={() => {
				props.onOK?.(value);
			}}
			onClose={() => {
				props.onClose?.(value);
			}}
			destroyOnClose={true}
			style={{ minHeight: 0, maxWidth: "50%", minWidth: "30%", padding: "1rem" }}
		>
			<div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
				<div>
					{props.message}
					{props.type === MessageBoxType.Input && (
						<input
							type="text"
							onChange={(e) => {
								setvalue(e.target.value);
							}}
							value={value}
						/>
					)}
				</div>
				<div>
					{(() => {
						switch (props.type) {
							case MessageBoxType.Error:
								return (
									<span style={{ color: "blue" }}>
										<SVGError />
									</span>
								);
							case MessageBoxType.Exclamation:
								return (
									<span style={{ color: "red" }}>
										<SVGExclamation />
									</span>
								);
							default:
								return;
						}
					})()}
				</div>
			</div>
		</Modal>
	);
};

export default MessageBox;
