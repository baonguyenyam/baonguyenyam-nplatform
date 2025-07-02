import type { AppStore } from "../../store";
import type { Data } from "../../types";
import type { PrivateAppState } from "../../types/Internal";
import type { ReorderAction } from "../actions";

import { moveAction } from "./move";

export const reorderAction = <UserData extends Data>(
	state: PrivateAppState<UserData>,
	action: ReorderAction,
	appStore: AppStore,
): PrivateAppState<UserData> => {
	return moveAction(
		state,
		{
			type: "move",
			sourceIndex: action.sourceIndex,
			sourceZone: action.destinationZone,
			destinationIndex: action.destinationIndex,
			destinationZone: action.destinationZone,
		},
		appStore,
	);
};
