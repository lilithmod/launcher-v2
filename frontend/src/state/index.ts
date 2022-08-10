import { createStore } from 'easy-peasy';
import user, { UserStore } from '@/state/user';
import settings, { SettingsStore } from '@/state/settings';
import button, { ButtonStore } from '@/state/button';
import logs, { LogsStore } from '@/state/logs';

export interface ApplicationStore {
	user: UserStore;
	settings: SettingsStore;
	button: ButtonStore;
	logs: LogsStore;
}

const state: ApplicationStore = {
	user,
	settings,
	button,
	logs,
};

export const store = createStore(state);
