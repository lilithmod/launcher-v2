import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import { api } from '@/config';
import Page from '@/components/Page';
import Snowfall from 'react-snowfall';
import { useStoreState } from 'easy-peasy';
import { SettingsRouter } from '@/routers';
import { LocalhostModal, LilithLogo } from '@/assets/images';
import { store, ApplicationStore } from '@/state';
import { GetVersion } from '@/wailsjs/go/main/App';
import { Appbar } from '@/components/elements/Generic';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { LauncherHome } from '@/components/pages/Launcher';
import { Modal, Error } from '@/components/elements/Modal';
import { BrowserOpenURL, EventsOn } from '@/wailsjs/runtime';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckIcon, ChipIcon, ExclamationIcon } from '@heroicons/react/outline';

import { Dialog, Transition } from '@headlessui/react';

const SnowFlakes = (props: { season: boolean; children: any }) => (
	<Fragment>
		{props.season && <Snowfall style={{ zIndex: 100 }} color="#fff" />}
		{props.children}
	</Fragment>
);

const SplashScreen = (props: { show: boolean; children: any }) => (
	<Fragment>
		<Transition.Root show={props.show} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => {}}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-neutral-950 backdrop-blur bg-opacity-75 transition-opacity" />
					</Transition.Child>
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<img src={LilithLogo} tw="w-96" />
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
		{props.children}
	</Fragment>
);

const App = () => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState('0.0.0');
	const [errorOpen, setErrorOpen] = useState(false);
	const [modalContent, setModalContent] = useState({});
	const [errorModalContent, setErrorModalContent] = useState({});
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);

	let local: string[] = [];

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
			const parsed = msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

			if (msg.includes('{*') && msg.includes('*}')) {
				escaped = msg.split('{*')[1].slice(0, -2);
			}

			if (parsed.startsWith('Error »')) {
				setErrorOpen(true);
				setErrorModalContent({
					icon: ExclamationIcon,
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
						icon: ChipIcon,
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
						`<img style='border-hidden; border-2; border-radius: 0.375rem; margin-top: 0.5rem; margin-bottom: 0.5rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);' src='${LocalhostModal}' />`
					);
					setOpen(true);
					setModalContent({
						icon: CheckIcon,
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
			<SplashScreen show={loading}>
				<SnowFlakes season={new Date().getMonth() == 11}>
					<Appbar />
					<Modal open={open} setOpen={setOpen} content={modalContent} />
					<Error open={errorOpen} setOpen={setErrorOpen} content={errorModalContent} />
					<div tw="absolute bottom-1 right-1 text-[9px] text-neutral-500 opacity-30 z-20">v{version}</div>
					<Routes>
						<Route path="/" element={<Navigate to="/launch" replace />} />
						<Route path="/launch" element={<Page component={LauncherHome} id="homepage-launcher" />} />
						<Route path="/settings/*" element={<SettingsRouter />} />
					</Routes>
				</SnowFlakes>
			</SplashScreen>
		</HashRouter>
	);
};

export default App;
