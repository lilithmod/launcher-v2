import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import confetti from 'canvas-confetti';
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router-dom';
import { store, ApplicationStore } from '@/state';
import { Link, useParams } from 'react-router-dom';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { Dialog, Menu, Transition, Switch } from '@headlessui/react';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { SaveConfig, GetVersion, ShowDialog } from '@/wailsjs/go/main/App';

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
				tw="absolute bottom-3 right-3 text-sm text-neutral-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 font-bold z-40 hover:cursor-pointer">
				v{version}
			</div>
			<div tw="absolute bottom-1 right-1 text-[9px] bg-neutral-900 py-2 px-8 z-30" />
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Launcher Settings</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Layout preferences</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center">
												<Switch
													checked={AppSettings!.blur}
													onChange={(toggle: boolean) => {
														config.launcher = { sidebar: AppSettings!.sidebar, blur: AppSettings!.blur };
														config.launcher.blur = toggle;
														SaveConfig(JSON.stringify(config))
															.then(() => {
																store.getActions().settings.setSettings({
																	sidebar: AppSettings!.sidebar,
																	blur: toggle,
																});
																navigate('.');
															})
															.catch((err) => console.log(err));
													}}
													css={[
														AppSettings!.blur ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}>
													<span
														aria-hidden="true"
														css={[
															AppSettings!.blur ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">
														Enable glass effects <span tw="text-xs text-neutral-400 font-bold">BETA</span>
													</span>
												</span>
											</div>
										</div>
									</div>
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center">
												<Switch
													checked={AppSettings!.sidebar}
													onChange={(toggle: boolean) => {
														config.launcher = { sidebar: AppSettings!.sidebar, blur: AppSettings!.blur };
														config.launcher.sidebar = toggle;
														SaveConfig(JSON.stringify(config))
															.then(() => {
																store.getActions().settings.setSettings({
																	sidebar: toggle,
																	blur: AppSettings!.blur,
																});
																navigate('.');
															})
															.catch((err) => console.log(err));
													}}
													css={[
														AppSettings!.sidebar ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}>
													<span
														aria-hidden="true"
														css={[
															AppSettings!.sidebar ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">Enable sidebar layout</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Lilith Settings</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Launch preferences</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center">
												<Switch
													checked={config.alpha}
													onChange={(toggle: boolean) => {
														config.alpha = toggle;
														SaveConfig(JSON.stringify(config))
															.then(() => navigate('.'))
															.catch((err) => console.log(err));
													}}
													css={[
														config.alpha ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}>
													<span
														aria-hidden="true"
														css={[
															config.alpha ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">Use Lilith Beta</span>
												</span>
											</div>
											<p className="-mt-1 -mb-2 ml-14 text-sm text-neutral-400" id="key-description">
												Restart of launcher required.
											</p>
										</div>
									</div>
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center">
												<Switch
													checked={config.debug}
													onChange={(toggle: boolean) => {
														config.debug = toggle;
														SaveConfig(JSON.stringify(config))
															.then(() => navigate('.'))
															.catch((err) => console.log(err));
													}}
													css={[
														config.debug ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}>
													<span
														aria-hidden="true"
														css={[
															config.debug ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">
														Enable debugging mode <span tw="text-xs text-neutral-400 font-bold">DEVELOPER</span>
													</span>
												</span>
											</div>
											<p className="-mt-1 -mb-1 ml-14 text-sm text-neutral-400" id="key-description">
												Restart of launcher required.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
