import { createSlice } from "@reduxjs/toolkit";

const initialState: { data: any[] } = {
	data: []
}

const appSlice = createSlice({
	name: "breadcrumbState",
	initialState,
	reducers: {
		deleteBreadcrumb: (state, action) => {
			const newState = state.data.filter((item: any) => item.id !== action.payload);
			return { ...state, data: newState };
		},
		addBreadcrumb: (state, action) => {
			const newState = [...state.data, action.payload];
			return { ...state, data: newState };
		},
		setBreadcrumb: (state, action) => {
			const newState = action.payload;
			return { ...state, data: newState };
		},
	},
});

export const { setBreadcrumb } = appSlice.actions;
export default appSlice.reducer;