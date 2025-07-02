import { getIdsForParent } from "../../lib/data/get-ids-for-parent";
import { insert } from "../../lib/data/insert";
import { walkTree } from "../../lib/data/walk-tree";
import { generateId } from "../../lib/generate-id";
import type { AppStore } from "../../store";
import type { Data } from "../../types";
import type { PrivateAppState } from "../../types/Internal";
import type { InsertAction } from "../actions";

export function insertAction<UserData extends Data>(
	state: PrivateAppState<UserData>,
	action: InsertAction,
	appStore: AppStore,
): PrivateAppState<UserData> {
	const id = action.id || generateId(action.componentType);
	const emptyComponentData = {
		type: action.componentType,
		props: {
			...(appStore.config.components[action.componentType].defaultProps || {}),
			id,
		},
	};

	const [parentId] = action.destinationZone.split(":");
	const idsInPath = getIdsForParent(action.destinationZone, state);

	return walkTree<UserData>(
		state,
		appStore.config,
		(content, zoneCompound) => {
			if (zoneCompound === action.destinationZone) {
				return insert(
					content || [],
					action.destinationIndex,
					emptyComponentData,
				);
			}

			return content;
		},
		(childItem, path) => {
			if (childItem.props.id === id || childItem.props.id === parentId) {
				return childItem;
			} else if (idsInPath.includes(childItem.props.id)) {
				return childItem;
			} else if (path.includes(action.destinationZone)) {
				return childItem;
			}

			return null;
		},
	);
}
