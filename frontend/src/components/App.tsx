import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import { api } from '@/config';
import Page from '@/components/Page';
import { debounce } from '@/helpers';
import Snowfall from 'react-snowfall';
import { useStoreState } from 'easy-peasy';
import { SettingsRouter } from '@/routers';
import { Offline } from 'react-detect-offline';
import { store, ApplicationStore } from '@/state';
import { CheckIcon, ChipIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { LauncherHome } from '@/components/pages/Launcher';
import { BrowserOpenURL, EventsOn } from '@/wailsjs/runtime';
import { Spinner, Appbar } from '@/components/elements/Generic';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShowDialog, HandleErrorFrontend, GetVersion } from '@/wailsjs/go/main/App';

const Modal = (props: { open: any; setOpen: any; content: any }) => {
	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => props.setOpen(true)}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-neutral-900 backdrop-blur-sm bg-opacity-75 transition-opacity" />
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
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block align-bottom bg-neutral-800 border border-neutral-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div>
								<div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-${props.content.background}`}>
									<props.content.icon className={`h-6 w-6 text-${props.content.color}`} aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-5">
									<Dialog.Title as="h3" className="text-lg leading-6 font-semibold text-white">
										{props.content.title}
									</Dialog.Title>
									<div className="mt-2">
										<p tw="text-sm text-neutral-400">{props.content.description}</p>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-6">
								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium ring-0 outline-none text-white sm:text-sm bg-rose-500 hover:bg-rose-600 transition"
									onClick={props.content.function}
								>
									{props.content.button}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

const SnowFlakes = (props: { season: boolean; children: any }) => (
	<Fragment>
		{props.season && <Snowfall style={{ zIndex: 100 }} color="#fff" />}
		{props.children}
	</Fragment>
);

const App = () => {
	const [open, setOpen] = useState(false);
	const [version, setVersion] = useState('0.0.0');
	const [modalContent, setModalContent] = useState({});

	useEffect(() => {
		GetVersion().then((data: string) => setVersion(data));
		http.get(api.versions.latest).then((data: any) => store.getActions().user.setUserData({ version: JSON.parse(data).version }));
	}, []);

	useEffect(() => {
		EventsOn('launch_lilith', (msg) => store.getActions().button.setButtonData(msg));
		EventsOn('lilith_log', (msg) => {
			let escaped = msg;
			if (msg.includes('{*') && msg.includes('*}')) {
				escaped = msg.split('{*')[1].slice(0, -2);
			}

			switch (escaped) {
				case 'lilith_auth_link':
					setOpen(true);
					setModalContent({
						color: 'white',
						accent: 'green-700',
						background: 'green-600',
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
				default:
					store.getActions().logs.pushLogs(msg);
			}
		});
	}, []);

	return (
		<HashRouter>
			<GlobalStyles />
			<SnowFlakes season={new Date().getMonth() == 11}>
				<Appbar />
				<Modal open={open} setOpen={setOpen} content={modalContent} />
				<div tw="absolute bottom-1 right-1 text-[9px] text-neutral-500 opacity-30 z-20">v{version}</div>
				<Routes>
					<Route path="/" element={<Navigate to="/launch" replace />} />
					<Route path="/launch" element={<Page component={LauncherHome} id="homepage-launcher" />} />
					<Route path="/settings/*" element={<SettingsRouter />} />
				</Routes>
			</SnowFlakes>
		</HashRouter>
	);
};

export default App;
