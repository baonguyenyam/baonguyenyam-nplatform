import { Redo2Icon, Undo2Icon } from "lucide-react";
import type { Dispatch, ReactElement, SetStateAction } from "react";

import getClassNameFactory from "../../lib/get-class-name-factory";
import type { PuckAction } from "../../reducer";
import { useAppStore } from "../../store";
import type { Data } from "../../types";
import { IconButton } from "../IconButton/IconButton";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("MenuBar", styles);

export function MenuBar<UserData extends Data>({
	menuOpen = false,
	renderHeaderActions,
	setMenuOpen,
}: {
	dispatch: (action: PuckAction) => void;
	onPublish?: (data: UserData) => void;
	menuOpen: boolean;
	renderHeaderActions?: () => ReactElement;
	setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const back = useAppStore((s) => s.history.back);
	const forward = useAppStore((s) => s.history.forward);
	const hasFuture = useAppStore((s) => s.history.hasFuture());
	const hasPast = useAppStore((s) => s.history.hasPast());

	return (
		<div
			className={getClassName({ menuOpen })}
			onClick={(event) => {
				const element = event.target as HTMLElement;

				if (window.matchMedia("(min-width: 638px)").matches) {
					return;
				}
				if (
					element.tagName === "A" &&
					element.getAttribute("href")?.startsWith("#")
				) {
					setMenuOpen(false);
				}
			}}
		>
			<div className={getClassName("inner")}>
				<div className={getClassName("history")}>
					<IconButton title="undo" disabled={!hasPast} onClick={back}>
						<Undo2Icon size={21} />
					</IconButton>
					<IconButton title="redo" disabled={!hasFuture} onClick={forward}>
						<Redo2Icon size={21} />
					</IconButton>
				</div>
				<>{renderHeaderActions && renderHeaderActions()}</>
			</div>
		</div>
	);
}
