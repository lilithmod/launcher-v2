import { createStore } from 'easy-peasy';
import user, { UserStore } from '@/state/user';
import settings, { SettingsStore } from '@/state/settings';

export interface ApplicationStore {
	user: UserStore;
	settings: SettingsStore;
}

const state: ApplicationStore = {
	user,
	settings,
};

export const store = createStore(state);
