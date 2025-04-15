import { createSlice } from "@reduxjs/toolkit";

// This is a return all settings
// {
// 	"pageSize": Number,
// 	"title": String,
// 	"description": String,
// 	"image": String,
// 	"tax": Number,
// 	"bill_note": String,
// 	"bill_company_name": String,
// 	"bill_company_address": String,
// 	"bill_company_info": String,
// 	"bill_company_phone": String,
// }

const initialState = {}

const appSlice = createSlice({
	name: "appState",
	initialState,
	reducers: {
		SET_APP_STATE: (state, action) => {
			return { ...state, ...action.payload };
		},
	},
});

export const { SET_APP_STATE } = appSlice.actions;
export default appSlice.reducer;