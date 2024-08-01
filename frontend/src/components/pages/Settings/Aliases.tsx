import React from 'react';

import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { SaveConfig } from '@/wailsjs/go/main/App';
import { PageContentBlock } from '@/components/elements/Generic';

const Base = (props: { id: string; config: any }) => {
	const navigate = useNavigate();
	const { config } = props;

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Command Aliases</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Change how you invoke a command. Use comma as separator for each command alias.</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								{Object.entries(config.commandAliases).map(([key, value]: any) => (
									<ol tw="grid grid-cols-3 gap-6">
										<div tw="col-span-3 sm:col-span-2">
											<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition">
												<label
													htmlFor="name"
													tw="absolute -top-2 left-2 -mt-px inline-block px-1 bg-neutral-800 text-xs font-medium text-neutral-300">
													{value}
												</label>
												<input
													type="text"
													name="name"
													spellCheck={false}
													id="name"
													tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
													defaultValue={key}
													onBlur={(event) => {
														config.commandAliases[event.target.value.replace(/\s/g, '-')] = config.commandAliases[key];
														delete config.commandAliases[key];

														SaveConfig(JSON.stringify(config)).catch((err) => console.log(err));
													}}
													placeholder={key}
												/>
											</div>
										</div>
									</ol>
								))}
							</div>
						</div>
					</div>
				</div>
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Gamemode Aliases</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">
								Change how gamemodes are referenced by lilith. Use comma as separator for each gamemode alias.
							</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								{Object.entries(config.gamemodeAliases).map(([key, value]: any) => (
									<ol tw="grid grid-cols-3 gap-6">
										<div tw="col-span-3 sm:col-span-2">
											<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 transition">
												<label
													htmlFor="name"
													tw="absolute -top-2 left-2 -mt-px inline-block px-1 bg-neutral-800 text-xs font-medium text-neutral-300">
													{value}
												</label>
												<input
													type="text"
													name="name"
													spellCheck={false}
													id="name"
													tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
													defaultValue={key}
													onBlur={(event) => {
														config.gamemodeAliases[event.target.value.replace(/\s/g, '-')] = config.gamemodeAliases[key];
														delete config.gamemodeAliases[key];

														SaveConfig(JSON.stringify(config)).catch((err) => console.log(err));
													}}
													placeholder={key}
												/>
											</div>
										</div>
									</ol>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
