import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import { api } from '@/config';
import Page from '@/components/Page';
import { useStoreState } from 'easy-peasy';
import { SettingsRouter } from '@/routers';
import { store, ApplicationStore } from '@/state';
import { GetVersion } from '@/wailsjs/go/main/App';
import { Dialog, Transition } from '@headlessui/react';
import GlobalStyles from '@/assets/styles/GlobalStyles';

import { Modal, Error } from '@/components/elements/Modal';
import { LocalhostModal, LilithLogo } from '@/assets/images';
import { BrowserOpenURL, EventsOn } from '@/wailsjs/runtime';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckIcon, ChipIcon, ExclamationIcon } from '@heroicons/react/outline';

import { LauncherHome } from '@/components/pages';
import { parseMessage, handleBreak } from '@/helpers';
import { Appbar, TransitionWrapper, Snowflakes, Splash } from '@/components/elements/Generic';

const App = () => {
	// display states
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState('0.0.0');
	const [errorOpen, setErrorOpen] = useState(false);

	// modal states
	const [modalContent, setModalContent] = useState({});
	const [errorModalContent, setErrorModalContent] = useState({});

	// log handlers
	let local: string[] = [];
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);

	// populate version
	useEffect(() => {
		GetVersion().then((data: string) => setVersion(data));
		http.get(api.versions.latest).then((data: any) => {
			store.getActions().user.setUserData({ version: JSON.parse(data).version });
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		EventsOn('launch_lilith', (msg) => store.getActions().button.setButtonData(msg));

		EventsOn('lilith_log', (msg) => {
			let escaped = msg;
			let parsed = parseMessage(msg);

			escaped = handleBreak(msg);

			if (parsed.startsWith('Error »')) {
				setErrorOpen(true);
				setErrorModalContent({
					icon: <ExclamationIcon className={`h-6 w-6 text-red-50`} aria-hidden="true" />,
					title: 'Lilith has encountered an error',
					description: parsed.replace('Error »', ''),
					button: 'Copy full error to clipboard',
					function: () => {
						setErrorOpen(false);
						//@ts-expect-error
						navigator.clipboard.writeText(local.join('\n').split('Error »').pop());
						local = [];
					},
				});
			}

			switch (escaped) {
				case 'lilith_auth_link':
					setOpen(true);
					setModalContent({
						icon: <ChipIcon className={`h-6 w-6 text-green-50`} aria-hidden="true" />,
						title: 'Verify your hardware',
						description: `You will be redirected to ${msg.split('{*')[0]}. This will be linked to your discord account.`,
						button: 'Verify',
						function: () => {
							setOpen(false);
							BrowserOpenURL(msg.split('{*')[0]);
						},
					});
					break;
				case 'lilith_discord_id':
					console.log(msg.split('{*')[0]);
					break;
				case 'lilith_server_address':
					store.getActions().logs.pushLogs(
						//@ts-expect-error
						`<img style='border-hidden; border-2; border-radius: 0.375rem; margin-top: 0.5rem; margin-bottom: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);' src='${LocalhostModal}' />`,
					);
					setOpen(true);
					setModalContent({
						icon: <CheckIcon className={`h-6 w-6 text-green-50`} aria-hidden="true" />,
						title: 'Lilith is ready',
						description: `You can connect to the address ${msg.split('{*')[0]}.`,
						button: 'Copy to clipboard',
						function: () => {
							setOpen(false);
							navigator.clipboard.writeText(msg.split('{*')[0]);
						},
					});
					break;
				default:
					local.push(parsed);
					store.getActions().logs.pushLogs(msg);
			}
		});
	}, []);

	return (
		<HashRouter>
			<GlobalStyles />
			<Splash show={loading}>
				<Snowflakes season={new Date().getMonth() == 11}>
					<Appbar />
					<Modal open={open} setOpen={setOpen} content={modalContent} />
					<Error open={errorOpen} setOpen={setErrorOpen} content={errorModalContent} />
					<div tw="absolute bottom-1 right-1 text-[9px] text-neutral-500 opacity-30 z-20">v{version}</div>
					<Routes>
						<Route path="/" element={<Navigate to="/launch" replace />} />
						<Route path="/launch" element={<TransitionWrapper render={<Page component={LauncherHome} id="homepage-launcher" />} />} />
						<Route path="/settings/*" element={<SettingsRouter />} />
					</Routes>
				</Snowflakes>
			</Splash>
		</HashRouter>
	);
};

export default App;
