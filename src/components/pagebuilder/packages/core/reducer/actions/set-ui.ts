import { Data } from "../../types";
import { PrivateAppState } from "../../types/Internal";
import { SetUiAction } from "../actions";

export const setUiAction = <UserData extends Data>(state: PrivateAppState<UserData>, action: SetUiAction): PrivateAppState<UserData> => {
	if (typeof action.ui === "object") {
		return {
			...state,
			ui: {
				...state.ui,
				...action.ui,
			},
		};
	}

	return {
		...state,
		ui: {
			...state.ui,
			...action.ui(state.ui),
		},
	};
};
