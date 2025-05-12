import { useMemo } from "react";

import { Overrides, Plugin } from "../types";

import { loadOverrides } from "./load-overrides";

export const useLoadedOverrides = ({ overrides, plugins }: { overrides?: Partial<Overrides>; plugins?: Plugin[] }) => {
	return useMemo(() => {
		return loadOverrides({ overrides, plugins });
	}, [plugins, overrides]);
};
