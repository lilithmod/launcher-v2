import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Dialog, Menu, Transition, Switch } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';

const Base = (props: { id: string }) => {
	const [allowBypass, setBypassEnabled] = useState(false);
	const [logMessages, setLogMessages] = useState(false);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Essential</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Essential configuration values</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
											<label htmlFor="name" tw="absolute -top-2 left-2 -mt-px inline-block px-1 bg-neutral-800 text-xs font-medium text-neutral-300">
												Hypixel API Key
											</label>
											<input
												type="text"
												name="name"
												id="name"
												tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
												placeholder="0000-0000-0000-0000"
											/>
										</div>
										<p className="mt-2 text-sm text-neutral-400" id="key-description">
											You can also do this in-game with <code>/api new</code>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Bypasses</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">
								Bypass blocked client features
								<br />
								<span tw="font-bold text-xs text-rose-300">BLACKLISTED</span>
							</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center ">
												<Switch
													checked={allowBypass}
													onChange={setBypassEnabled}
													css={[
														allowBypass ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}
												>
													<span
														aria-hidden="true"
														css={[
															allowBypass ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1">
													<span tw="text-sm font-medium text-neutral-300">Enable Mod Bypassing</span>
												</span>
											</div>
										</div>
										<div tw="col-span-4 sm:col-span-2 mt-4 flex items-start">
											<div tw="h-5 flex items-center pt-[10pt]">
												<input
													disabled={!allowBypass}
													id="lunar-bypass"
													name="lunar-bypass"
													type="checkbox"
													tw="bg-neutral-700 focus:ring-rose-500 h-5 w-5 text-rose-500 border-neutral-600 rounded disabled:pointer-events-none disabled:opacity-50"
												/>
											</div>
											<div tw="ml-3 text-sm">
												<label htmlFor="lunar-bypass" tw="font-medium text-neutral-300">
													Lunar
												</label>
												<p tw="font-light text-neutral-200 text-xs">Unlock blocked Freelook, Autotext, and Minimap</p>
											</div>
										</div>
										<div tw="col-span-4 sm:col-span-2 mt-4 flex items-start ml-10">
											<div tw="h-5 flex items-center pt-[10pt]">
												<input
													disabled={!allowBypass}
													id="lunar-cheats"
													name="lunar-cheats"
													type="checkbox"
													tw="bg-neutral-700 focus:ring-rose-500 h-5 w-5 text-rose-500 border-neutral-600 rounded disabled:pointer-events-none disabled:opacity-50"
												/>
											</div>
											<div tw="ml-3 text-sm">
												<label htmlFor="lunar-cheats" tw="font-medium text-neutral-300">
													Lunar Cheats
												</label>
												<p tw="font-light text-neutral-200 text-xs">Enable staff mods like Xray. (Currently only Xray works)</p>
											</div>
										</div>
										<div tw="col-span-4 sm:col-span-2 mt-4 flex items-start ml-10">
											<div tw="h-5 flex items-center pt-[10pt]">
												<input
													disabled={!allowBypass}
													id="lunar-hitreg"
													name="lunar-hitreg"
													type="checkbox"
													tw="bg-neutral-700 focus:ring-rose-500 h-5 w-5 text-rose-500 border-neutral-600 rounded disabled:pointer-events-none disabled:opacity-50"
												/>
											</div>
											<div tw="ml-3 text-sm">
												<label htmlFor="lunar-hitreg" tw="font-medium text-neutral-300">
													Lunar Hitreg
												</label>
												<p tw="font-light text-neutral-200 text-xs">Enable 1.7 Hitreg (Undetectable on Hypixel)</p>
											</div>
										</div>
										<div tw="col-span-4 sm:col-span-2 mt-4 flex items-start">
											<div tw="h-5 flex items-center pt-[10pt]">
												<input
													disabled={!allowBypass}
													id="badlion-bypass"
													name="badlion-bypass"
													type="checkbox"
													tw="bg-neutral-700 focus:ring-rose-500 h-5 w-5 text-rose-500 border-neutral-600 rounded disabled:pointer-events-none disabled:opacity-50"
												/>
											</div>
											<div tw="ml-3 text-sm">
												<label htmlFor="badlion-bypass" tw="font-medium text-neutral-300">
													Badlion
												</label>
												<p tw="font-light text-neutral-200 text-xs">Unlock any disallowed mods such as Minimap</p>
											</div>
										</div>
										<div tw="col-span-4 sm:col-span-2 mt-4 flex items-start">
											<div tw="h-5 flex items-center pt-[10pt]">
												<input
													disabled={!allowBypass}
													id="forge-bypass"
													name="forge-bypass"
													type="checkbox"
													tw="bg-neutral-700 focus:ring-rose-500 h-5 w-5 text-rose-500 border-neutral-600 rounded disabled:pointer-events-none disabled:opacity-50"
												/>
											</div>
											<div tw="ml-3 text-sm">
												<label htmlFor="forge-bypass" tw="font-medium text-neutral-300">
													Forge
												</label>
												<p tw="font-light text-neutral-200 text-xs">Hide blocked modifications like Freelook or Ping Tags</p>
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
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Proxy Options</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Technical settings concerning the proxy</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center ">
												<Switch
													checked={logMessages}
													onChange={setLogMessages}
													css={[
														logMessages ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}
												>
													<span
														aria-hidden="true"
														css={[
															logMessages ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">Log Chat Messages</span>
												</span>
											</div>
										</div>
										<div tw="col-span-2 mt-4">
											<div tw="isolate -space-y-px rounded-md shadow-sm mt-1 w-full ">
												<div tw="relative w-full border border-neutral-600 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
													<label htmlFor="remote-ip" tw="block text-xs font-medium text-neutral-400">
														Remote Server IP
													</label>
													<input
														type="text"
														name="remote-ip"
														id="remote-ip"
														tw="block bg-neutral-800 w-full border-0 p-0 text-neutral-300 placeholder-neutral-500 focus:ring-0 sm:text-sm"
														value="mc.hypixel.net"
													/>
												</div>
												<div tw="relative w-full border border-neutral-600 rounded-md rounded-t-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
													<label htmlFor="remote-port" tw="block w-full text-xs font-medium text-neutral-400">
														Remote Server Port
													</label>
													<input
														type="number"
														name="remote-port"
														id="remote-port"
														tw="block bg-neutral-800 w-full border-0 p-0 text-neutral-300 placeholder-neutral-500 focus:ring-0 sm:text-sm"
														value="25565"
													/>
												</div>
											</div>
										</div>
										<div tw="col-span-2 mt-4">
											<div tw="isolate -space-y-px rounded-md shadow-sm mt-1 w-full ">
												<div tw="relative w-full border border-neutral-600 rounded-md rounded-b-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
													<label htmlFor="local-ip" tw="block text-xs font-medium text-neutral-400">
														Local Server IP
													</label>
													<input
														type="text"
														name="local-ip"
														id="local-ip"
														tw="block bg-neutral-800 w-full border-0 p-0 text-neutral-300 placeholder-neutral-500 focus:ring-0 sm:text-sm"
														value="127.0.0.1"
													/>
												</div>
												<div tw="relative w-full border border-neutral-600 rounded-md rounded-t-none px-3 py-2 focus-within:z-10 focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
													<label htmlFor="local-port" tw="block w-full text-xs font-medium text-neutral-400">
														Local Server Port
													</label>
													<input
														type="number"
														name="local-port"
														id="local-port"
														tw="block bg-neutral-800 w-full border-0 p-0 text-neutral-300 placeholder-neutral-500 focus:ring-0 sm:text-sm"
														value="25565"
													/>
												</div>
											</div>
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
