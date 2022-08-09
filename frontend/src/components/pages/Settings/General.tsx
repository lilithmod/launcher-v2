import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { SaveConfig } from '@/wailsjs/go/main/App';
import { Dialog, Menu, Transition, Switch } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { useNavigate } from 'react-router-dom';

const Base = (props: { id: string; config: any }) => {
	const navigate = useNavigate();
	const { config } = props;

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Nicknames</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Nicknames of the members of your party</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition">
											<input
												type="text"
												name="name"
												id="name"
												tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
												onBlur={(event) => {
													if (event.target.value.length >= 3 && !event.target.value.includes(' ')) {
														const nicknames = event.target.value.replace(/\s/g, '').split(',');
														nicknames.forEach((item, idx) => {
															config.nicknames[item.toLowerCase()] = item;
															console.log(`[added] config.nicknames{${item.toLowerCase()}: ${item}}`);
														});
														SaveConfig(JSON.stringify(config))
															.then(() => navigate('.'))
															.catch((err) => console.log(err));
													}
												}}
												placeholder="use comma as separator..."
											/>
										</div>
										<p className="mt-2 text-sm text-neutral-400" id="key-description">
											{Object.entries(config.nicknames).length > 0
												? Object.entries(config.nicknames).map(([key, value]: any, idx: number) => (
														<span className="inline-flex items-center py-0.5 pl-2 pr-0.5 rounded-full text-xs font-medium bg-rose-800 text-rose-100 inline mr-1.5">
															<img src={`https://minotar.net/avatar/${key}/20`} tw="w-3 h-3 rounded-sm mr-[0.2rem]" />
															{value}
															<button
																type="button"
																onClick={() => {
																	delete config.nicknames[key];
																	console.log(`[removed] config.nicknames.${key}`);
																	SaveConfig(JSON.stringify(config))
																		.then(() => navigate('.'))
																		.catch((err) => console.log(err));
																}}
																className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-rose-300 hover:bg-rose-700 hover:text-rose-100 focus:outline-none"
															>
																<svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
																	<path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
																</svg>
															</button>
														</span>
												  ))
												: 'Usernames you enter will appear here'}
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
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Theme</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Change the lilith theme</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition">
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
			</div>
		</PageContentBlock>
	);
};

export default Base;
