import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

import appSlice from "./appSlice";
import attributeSlice from "./attributeSlice";
import breadcrumbSlice from "./breadcrumbSlice";
import categoriesSlice from "./categoriesSlice";
import storage from "./storage";

const appPersistConfig = {
	key: "appState",
	storage,
};

const attributePersistConfig = {
	key: "attributeState",
	storage,
};

const categoriesPersistConfig = {
	key: "categoriesState",
	storage,
};

const breadcrumbPersistConfig = {
	key: "breadcrumbState",
	storage,
};

const persistedAppReducer = persistReducer(appPersistConfig, appSlice);
const persistedAttributeReducer = persistReducer(
	attributePersistConfig,
	attributeSlice,
);
const categoriesReducer = persistReducer(
	categoriesPersistConfig,
	categoriesSlice,
);
const breadcrumbReducer = persistReducer(
	breadcrumbPersistConfig,
	breadcrumbSlice,
);
const persistedReducer = combineReducers({
	appState: persistedAppReducer,
	attributeState: persistedAttributeReducer,
	categoriesState: categoriesReducer,
	breadcrumbState: breadcrumbReducer,
});
const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					"persist/PERSIST",
					"persist/REHYDRATE",
					"persist/FLUSH",
					"persist/PAUSE",
					"persist/REGISTER",
					"persist/REMOVE",
					"persist/UPDATE",
				],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
