import { createSlice } from "@reduxjs/toolkit";

const initialState: { data: any } = { data: null };

const categoriesSlice = createSlice({
	name: "appState",
	initialState,
	reducers: {
		deleteCategory: (state, action) => {
			const newState = state.data.filter(
				(item: any) => item.id !== action.payload,
			);
			return { ...state, data: newState };
		},
		addCategory: (state, action) => {
			const newState = [...state.data, action.payload];
			return { ...state, data: newState };
		},
		setCategory: (state, action) => {
			const newState = action.payload;
			return { ...state, data: newState };
		},
	},
});

export const { setCategory, deleteCategory, addCategory } =
	categoriesSlice.actions;
export default categoriesSlice.reducer;
