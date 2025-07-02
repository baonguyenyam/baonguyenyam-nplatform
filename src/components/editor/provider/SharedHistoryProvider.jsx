import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin";
import * as React from "react";
import { createContext, useContext, useMemo } from "react";

const Context = createContext({});

export const SharedHistoryProvider = ({ children }) => {
	const historyContext = useMemo(
		() => ({ historyState: createEmptyHistoryState() }),
		[],
	);
	return <Context.Provider value={historyContext}>{children}</Context.Provider>;
};

export const useSharedHistoryContext = () => {
	const context = useContext(Context);

	if (context === undefined) {
		throw new Error(
			"useSharedHistoryContext must be used within a SharedHistoryProvider",
		);
	}

	return context;
};
