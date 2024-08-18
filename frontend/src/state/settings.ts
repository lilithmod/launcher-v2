import { Action, action } from 'easy-peasy';

const initialState = { blur: false, sidebar: true };

export interface AppSettings {
	blur: boolean;
}

export interface SettingsStore {
	data?: AppSettings;
	setSettings: Action<SettingsStore, AppSettings>;
	reset: Action<SettingsStore>;
}

const settings: SettingsStore = {
	data: initialState,
	setSettings: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = initialState;
	}),
};

export default settings;
