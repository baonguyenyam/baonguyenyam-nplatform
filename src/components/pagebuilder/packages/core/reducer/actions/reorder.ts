import { AppStore } from "../../store";
import { Data } from "../../types";
import { PrivateAppState } from "../../types/Internal";
import { ReorderAction } from "../actions";

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
