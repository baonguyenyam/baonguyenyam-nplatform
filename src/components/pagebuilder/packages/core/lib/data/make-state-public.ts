import type { AppState, Data } from "../../types";
import type { PrivateAppState } from "../../types/Internal";

export const makeStatePublic = <UserData extends Data>(
	state: PrivateAppState<UserData>,
): AppState<UserData> => {
	const { data, ui } = state;

	return { data, ui };
};
