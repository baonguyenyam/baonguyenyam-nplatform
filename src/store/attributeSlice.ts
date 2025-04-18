import { createSlice } from "@reduxjs/toolkit";

// This is a return all attributes
// {
// 	"data": [
// 		{
// 			"id": Number,
// 			"title": String,
// 			"type": String,
// 			"mapto": String,
// 			"published": Boolean,
// 			"children": [
// 				{
// 					"id": Number,
// 					"title": String,
// 					"type": String,
// 					"mapto": String,
// 					"published": Boolean,
// 				}
// 			],
// 			"_count": {
// 				"meta": Number,
// 				"children": Number,
// 			}
// 		}
// 	]
// }

const initialState: { data: any } = { data: null }

const attributeSlice = createSlice({
	name: "attributeState",
	initialState,
	reducers: {
		deleteAttribute: (state, action) => {
			const newState = state.data.filter((item: any) => item.id !== action.payload);
			return { ...state, data: newState };
		},
		addAttribute: (state, action) => {
			const newState = [...state.data, action.payload];
			return { ...state, data: newState };
		},
		setAttribute: (state, action) => {
			const newState = action.payload;
			return { ...state, data: newState };
		},
	},
});

export const { setAttribute, deleteAttribute, addAttribute } = attributeSlice.actions;
export default attributeSlice.reducer;