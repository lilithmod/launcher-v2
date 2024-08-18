import React, { useState, Fragment } from 'react';

import tw from 'twin.macro';
import confetti from 'canvas-confetti';
import { Sparkles } from '@/assets/images';
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { Modal, Action } from '@/components/elements/Modal';
import { Switch, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Spinner, PageContentBlock, Shimmer } from '@/components/elements/Generic';
import { SaveConfig, GetVersion, ShowDialog, DeleteEverything } from '@/wailsjs/go/main/App';
import { ExternalLinkIcon, TrashIcon, ExclamationIcon, BadgeCheckIcon } from '@heroicons/react/outline';

const channels = [
	{ id: 1, name: 'Stable release' },
	{ id: 2, name: 'Beta release' },
];

const Base = (props: { id: string; config: any; loaded: boolean }) => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);

	const [isDone, setDone] = useState(false);
	const [loading, setLoading] = useState(false);
	const [version, setVersion] = useState('0.0.0');
	const [currentNick, setStateNick] = useState('');
	const [confirmDelete, setConfirmDelete] = useState(false);

	const navigate = useNavigate();
	const { config, loaded } = props;

	GetVersion().then((data: string) => setVersion(data));

	return (
		<PageContentBlock pageId={props.id}>
			{loading && (
				<div tw="h-screen w-screen inset-0 bg-neutral-900 backdrop-blur-sm bg-opacity-75 transition-opacity fixed z-[200] pointer-events-none">
					<div tw="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<Spinner size="large" />
					</div>
				</div>
			)}
			<Action
				open={confirmDelete}
				setOpen={setConfirmDelete}
				className={loading && 'pointer-events-none'}
				content={{
					color: 'bg-red-500/20',
					icon: <ExclamationIcon className={`h-6 w-6 text-red-300`} aria-hidden="true" />,
					title: 'Delete Resources?',
					description: 'Delete all files related to Lilith? This action cannot be reverted.',
					button: 'Continue',
					cancel: 'Cancel',
					function: async () => {
						setLoading(true);
						setConfirmDelete(false);
						await DeleteEverything();
						setLoading(false);
						setDone(true);
					},
				}}
			/>
			<Modal
				open={isDone}
				setOpen={setDone}
				content={{
					width: 'sm:max-w-xs',
					color: 'bg-green-500/20',
					icon: <BadgeCheckIcon className={`h-6 w-6 text-green-300`} aria-hidden="true" />,
					title: 'Sucessfully Deleted',
					description: 'All files related to Lilith have been removed. You will need to log in to your Microsoft account on next usage.',
					button: 'Got it!',
					function: () => {
						setDone(false);
						navigate('/');
					},
				}}
			/>
			<div
				onClick={() => {
					confetti({
						particleCount: 100,
						spread: 70,
						angle: 135,
						origin: { y: 1, x: 1.1 },
					});
					ShowDialog(`Lilith Launcher v${version}`, `© 2021-2024 theMackabu, Lilith Development`, ['Ok'], 'Ok', '', '');
				}}
				tw="fixed bottom-4 right-4 text-sm text-neutral-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 font-bold z-40 hover:cursor-pointer">
				v{version}
			</div>
			<div tw="absolute bottom-1 right-1 text-[9px] bg-neutral-900 py-2 px-8 z-30" />
			<div tw="max-w-2xl mx-auto px-6 py-8 w-full pt-16">
				<div tw="relative mt-4">
					{!loaded && (
						<div tw="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 flex flex-col items-center justify-center text-center bg-black/10 rounded-lg px-3 py-5 border border-neutral-600/50 backdrop-blur">
							<Spinner size="base" />
							<p tw="text-neutral-100 text-sm font-medium mt-3 w-96">Please start Lilith to generate a config file to continue.</p>
						</div>
					)}
					<div
						css={[
							!loaded && tw`pointer-events-none opacity-30 blur-[2px]`,
							tw`border border-neutral-700/50 bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 w-full`,
						]}>
						<h3 tw="text-xl font-medium leading-6 text-neutral-200">Nicknames</h3>
						<p tw="mt-1 text-sm text-neutral-400">Nicknames of the members of your party</p>
						<div tw="mt-5 space-y-3 -mb-1">
							<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition">
								<input
									type="text"
									name="name"
									id="name"
									tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm pb-2"
									spellCheck={false}
									onBlur={(event) => {
										if (event.target.value.length >= 3 && !event.target.value.includes(' ')) {
											setStateNick(event.target.value.trim().toLowerCase());
											config.nicknames[currentNick] = '';
										}
										delete config.nicknames[''];
									}}
									placeholder="real name"
								/>
								<hr tw="w-full border-neutral-600 -mx-3 py-1" />
								<input
									type="text"
									name="name"
									id="name"
									tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
									spellCheck={false}
									onBlur={(event) => {
										if (event.target.value.length >= 3 && !event.target.value.includes(' ')) {
											config.nicknames[currentNick] = event.target.value.trim().toLowerCase();
											SaveConfig(JSON.stringify(config))
												.then(() => navigate('.'))
												.catch((err) => console.log(err));
										}
										delete config.nicknames[''];
									}}
									placeholder="hypixel nick"
								/>
							</div>
							<p className="mt-2 text-sm text-neutral-400" id="key-description">
								{config.nicknames && Object.entries(config.nicknames).length > 0
									? Object.entries(config.nicknames).map(([key, value]: any, idx: number) => (
											<span
												className="inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-rose-800 text-rose-100 inline mr-1.5 mb-1"
												key={idx}>
												<span>
													<span tw="font-semibold">{key}</span> is nicked as <span tw="font-semibold"> {value}</span>
												</span>
												<button
													type="button"
													onClick={() => {
														delete config.nicknames[key];
														SaveConfig(JSON.stringify(config))
															.then(() => navigate('.'))
															.catch((err) => console.log(err));
													}}
													className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-rose-300 hover:bg-rose-700 hover:text-rose-100 focus:outline-none">
													<svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
														<path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
													</svg>
												</button>
											</span>
									  ))
									: 'Party members entered will appear here'}
							</p>
						</div>
					</div>
				</div>

				<div tw="border border-neutral-700/50 bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<h3 tw="text-xl font-medium leading-6 text-neutral-200">Launch preferences</h3>
					<p tw="mt-1 text-sm text-neutral-400">Appearance, channels, and more</p>
					<div tw="mt-6 space-y-5">
						<Switch.Group as="div" className="flex items-center justify-between">
							<span className="flex-grow flex flex-col">
								<Switch.Label as="span" className="text-sm font-medium text-neutral-300" passive>
									Enable glass effects <span tw="ml-1 text-xs text-sky-400 font-bold">APPEARANCE</span>
								</Switch.Label>
								<Switch.Description as="span" className="text-sm text-neutral-400">
									Customize how the launcher looks.
								</Switch.Description>
							</span>
							<Switch
								checked={AppSettings!.blur}
								onChange={(toggle: boolean) => {
									config.launcher = { blur: AppSettings!.blur };
									config.launcher.blur = toggle;
									SaveConfig(JSON.stringify(config))
										.then(() => {
											store.getActions().settings.setSettings({ blur: toggle });
											navigate('.');
										})
										.catch((err) => console.log(err));
								}}
								css={[
									AppSettings!.blur ? tw`bg-rose-500 ring-rose-400` : tw`bg-neutral-700 ring-neutral-600`,
									tw`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full ring-[0.5px] border-2 border-transparent transition duration-200 ease-in-out focus:outline-none`,
								]}>
								<span
									aria-hidden="true"
									css={[
										AppSettings!.blur ? tw`translate-x-4 bg-white` : tw`translate-x-0 bg-neutral-300`,
										tw`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`,
									]}
								/>
							</Switch>
						</Switch.Group>
						<Switch.Group as="div" className="flex items-center justify-between">
							<span className="flex-grow flex flex-col">
								<Switch.Label as="span" className="text-sm font-medium text-neutral-300" passive>
									Enable debugging mode <span tw="ml-0.5 text-xs text-rose-400 font-bold">DEBUG</span>
								</Switch.Label>
								<Switch.Description as="span" className="text-sm text-neutral-400">
									Restart of launcher required.
								</Switch.Description>
							</span>
							<Switch
								checked={config.debug}
								onChange={(toggle: boolean) => {
									config.debug = toggle;
									SaveConfig(JSON.stringify(config))
										.then(() => navigate('.'))
										.catch((err) => console.log(err));
								}}
								css={[
									config.debug ? tw`bg-rose-500 ring-rose-400` : tw`bg-neutral-700 ring-neutral-600`,
									tw`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full ring-[0.5px] border-2 border-transparent transition duration-200 ease-in-out focus:outline-none`,
								]}>
								<span
									aria-hidden="true"
									css={[
										config.debug ? tw`translate-x-4 bg-white` : tw`translate-x-0 bg-neutral-300`,
										tw`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`,
									]}
								/>
							</Switch>
						</Switch.Group>
						<div tw="flex items-center justify-between">
							<span tw="flex-grow flex flex-col">
								<span className="text-sm font-medium text-neutral-300">
									Release channel <span tw="ml-0.5 text-xs text-rose-400 font-bold">CAUTION</span>
								</span>
								<span className="text-sm text-neutral-400">Lilith beta builds may not be available for all users.</span>
							</span>
							<Listbox
								value={channels[config.alpha ? 1 : 0]}
								onChange={(value: any) => {
									if (value.id == 1) {
										config.alpha = false;
									} else {
										config.alpha = true;
									}

									SaveConfig(JSON.stringify(config))
										.then(() => navigate('.'))
										.catch((err) => console.log(err));
								}}>
								{({ open }) => (
									<>
										<Listbox.Label tw="text-sm font-medium text-neutral-300"></Listbox.Label>
										<div tw="mt-1 relative">
											<Listbox.Button tw="bg-neutral-900/30 hover:bg-neutral-700/30 transition relative w-40 border border-neutral-700 hover:border-neutral-600 cursor-pointer rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm">
												<span tw="block truncate text-neutral-50">{channels[config.alpha ? 1 : 0].name}</span>
												<span tw="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
													<SelectorIcon tw="h-5 w-5 text-neutral-400" aria-hidden="true" />
												</span>
											</Listbox.Button>
											<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
												<Listbox.Options tw="absolute z-10 mt-1 w-full bg-neutral-800/50 backdrop-blur shadow-lg max-h-60 rounded-md py-1 text-base border border-neutral-600/40 overflow-auto focus:outline-none sm:text-sm">
													{channels.map((channel) => (
														<Listbox.Option
															key={channel.id}
															className={({ selected, active }) =>
																`relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-rose-500/20 text-rose-200' : 'text-neutral-200'}`
															}
															value={channel}>
															{({ selected, active }) => (
																<>
																	<span css={[selected ? tw`font-semibold text-white` : tw`font-normal`, tw`block truncate`]}>{channel.name}</span>

																	{selected ? (
																		<span css={[active ? tw`text-white` : tw`text-rose-300`, tw`absolute inset-y-0 right-0 flex items-center pr-4`]}>
																			<CheckIcon tw="h-5 w-5" aria-hidden="true" />
																		</span>
																	) : null}
																</>
															)}
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
						</div>
					</div>
				</div>
				<div tw="border border-neutral-700/50 bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<h3 tw="text-xl font-medium leading-6 text-neutral-200">External settings</h3>
					<p tw="mt-1 text-sm text-neutral-400">Change everything else Lilith offers</p>
					<div className="relative group">
						<Shimmer tw="mt-4 w-[577px]" onClick={() => BrowserOpenURL('https://me.lilith.rip')}>
							<p tw="transition flex items-center px-2 py-2 text-xl font-bold rounded-md text-neutral-300 group-hover:text-white">
								<ExternalLinkIcon
									className="transition group-hover:text-neutral-200 text-neutral-400 mr-3 flex-shrink-0 h-5 w-5"
									aria-hidden="true"
								/>
								Global Config
							</p>
						</Shimmer>
						<img src={Sparkles} className="absolute -top-3 -right-4 opacity-0 group-hover:opacity-100 w-8 transition" />
						<img src={Sparkles} className="absolute bottom-2 -left-5 opacity-0 group-hover:opacity-100 w-8 transition" />
					</div>
				</div>
				<div tw="border border-neutral-700/50 bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<h3 tw="text-xl font-medium leading-6 text-neutral-200">Delete Resources</h3>
					<p tw="mt-1 text-sm text-neutral-400">Delete all files related to Lilith</p>
					<button
						className="group"
						onClick={() => setConfirmDelete(true)}
						tw="mt-4 flex w-[577px] rounded-lg border border-red-500/30 bg-red-500/10 hover:border-red-400 hover:bg-red-500/80 transition px-6 py-3 items-center justify-center">
						<p tw="transition flex items-center px-2 py-2 text-xl font-bold rounded-md text-red-200 group-hover:text-white">
							<TrashIcon className="transition group-hover:text-neutral-100 text-red-200 mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
							Delete Everything
						</p>
					</button>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
