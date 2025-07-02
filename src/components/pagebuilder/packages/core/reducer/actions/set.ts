import { walkTree } from "../../lib/data/walk-tree";
import { AppStore } from "../../store";
import { Data } from "../../types";
import { PrivateAppState } from "../../types/Internal";
import { SetAction } from "../actions";

export const setAction = <UserData extends Data>(
	state: PrivateAppState<UserData>,
	action: SetAction<UserData>,
	appStore: AppStore,
): PrivateAppState<UserData> => {
	if (typeof action.state === "object") {
		const newState = {
			...state,
			...action.state,
		};

		if (action.state.indexes) {
			return newState;
		}

		console.warn(
			"`set` is expensive and may cause unnecessary re-renders. Consider using a more atomic action instead.",
		);

		return walkTree(newState, appStore.config);
	}

	return { ...state, ...action.state(state) };
};
