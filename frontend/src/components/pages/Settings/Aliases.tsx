import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Dialog, Menu, Transition, Switch } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';

const Base = (props: { id: string; config: any }) => {
	const [lunarSpoof, setLunarSpoof] = useState(false);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Command Aliases</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Change how you involke a command</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								{Object.entries(props.config!.commandAliases).map(([key, value]: any, idx) => (
									<div tw="grid grid-cols-3 gap-6" key={idx}>
										<div tw="col-span-3 sm:col-span-2">
											<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
												<label
													htmlFor="name"
													tw="absolute -top-2 left-2 -mt-px inline-block px-1 bg-neutral-800 text-xs font-medium text-neutral-300"
												>
													{key}
												</label>
												<input
													type="text"
													name="name"
													spellCheck={false}
													id="name"
													tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
													defaultValue={value}
													onBlur={(event) => console.log(event.target.value)}
													placeholder={key}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Gamemode Aliases</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Change how gamemodes are referenced by lilith</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								{Object.entries(props.config!.gamemodeAliases).map(([key, value]: any, idx) => (
									<div tw="grid grid-cols-3 gap-6" key={idx}>
										<div tw="col-span-3 sm:col-span-2">
											<div tw="relative border border-neutral-600 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500">
												<label
													htmlFor="name"
													tw="absolute -top-2 left-2 -mt-px inline-block px-1 bg-neutral-800 text-xs font-medium text-neutral-300"
												>
													{key}
												</label>
												<input
													type="text"
													name="name"
													spellCheck={false}
													id="name"
													tw="bg-neutral-800 block w-full border-0 p-0 text-neutral-300 placeholder-neutral-400 focus:ring-0 sm:text-sm"
													defaultValue={value}
													onBlur={(event) => console.log(event.target.value)}
													placeholder={key}
												/>
											</div>
										</div>
									</div>
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
