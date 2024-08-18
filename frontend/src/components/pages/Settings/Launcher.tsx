import React, { useState, Fragment } from 'react';

import tw from 'twin.macro';
import confetti from 'canvas-confetti';
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import ShimmerButton from '@/components/ui/shimmer-button';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Switch, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { PageContentBlock } from '@/components/elements/Generic';
import { SaveConfig, GetVersion, ShowDialog } from '@/wailsjs/go/main/App';

const channels = [
	{ id: 1, name: 'Stable release' },
	{ id: 2, name: 'Beta release' },
];

const Base = (props: { id: string; config: any }) => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const [version, setVersion] = useState('0.0.0');
	const navigate = useNavigate();
	const { config } = props;

	GetVersion().then((data: string) => {
		setVersion(data);
	});

	return (
		<PageContentBlock pageId={props.id}>
			<div
				onClick={() => {
					confetti({
						particleCount: 100,
						spread: 70,
						angle: 135,
						origin: { y: 1, x: 1.1 },
					});
					ShowDialog(`Lilith Launcher v${version}`, `© 2021-2023 theMackabu@(Lilith Development)`, ['Ok'], 'Ok', '', '');
				}}
				tw="absolute bottom-4 right-4 text-sm text-neutral-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 font-bold z-40 hover:cursor-pointer">
				v{version}
			</div>
			<div tw="absolute bottom-1 right-1 text-[9px] bg-neutral-900 py-2 px-8 z-30" />
			<div tw="max-w-7xl mx-auto px-6 py-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
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
				<ShimmerButton className="absolute bottom-5 left-6 group" onClick={() => BrowserOpenURL('https://me.lilith.rip')}>
					<p tw="transition flex items-center px-2 py-2 text-xl font-bold rounded-md text-neutral-300 group-hover:text-white">
						<ExternalLinkIcon className="transition group-hover:text-neutral-200 text-neutral-400 mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
						Global Config
					</p>
				</ShimmerButton>
			</div>
		</PageContentBlock>
	);
};

export default Base;
