import { walkTree } from "../../lib/data/walk-tree";
import { AppStore } from "../../store";
import { Data } from "../../types";
import { PrivateAppState } from "../../types/Internal";
import { ReplaceRootAction } from "../actions";

export const replaceRootAction = <UserData extends Data>(state: PrivateAppState<UserData>, action: ReplaceRootAction<UserData>, appStore: AppStore): PrivateAppState<UserData> => {
	return walkTree<UserData>(
		state,
		appStore.config,
		(content) => content,
		(childItem) => {
			if (childItem.props.id === "root") {
				return {
					...childItem,
					props: { ...childItem.props, ...action.root.props },
					readOnly: action.root.readOnly,
				};
			}

			// Everything in inside root, so everything needs re-indexing
			return childItem;
		},
	);
};
