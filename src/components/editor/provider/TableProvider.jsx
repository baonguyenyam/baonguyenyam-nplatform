import { createContext, useContext, useMemo, useState } from "react";

export const CellContext = createContext({
	cellEditorConfig: null,
	cellEditorPlugins: null,
	set: (cellEditorConfig, children) => {
		// Empty
	},
});

export function TableProvider({ children }) {
	const [contextValue, setContextValue] = useState({
		cellEditorConfig: null,
		cellEditorPlugins: null,
	});
	return (
		<CellContext.Provider
			value={useMemo(
				() => ({
					cellEditorConfig: contextValue.cellEditorConfig,
					cellEditorPlugins: contextValue.cellEditorPlugins,
					set: (cellEditorConfig, cellEditorPlugins) => {
						setContextValue({ cellEditorConfig, cellEditorPlugins });
					},
				}),
				[contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
			)}
		>
			{children}
		</CellContext.Provider>
	);
}

export const useTableContext = () => {
	const context = useContext(CellContext);

	if (context === undefined) {
		throw new Error("useTableContext must be used within a TableProvider");
	}

	return context;
};
