import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Dialog, Menu, Transition, Switch } from '@headlessui/react';
import { Link, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';

const Base = (props: { id: string }) => {
	const [lunarSpoof, setLunarSpoof] = useState(false);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16">
				<div tw="bg-neutral-800 shadow px-4 py-5 rounded-lg sm:p-6 mt-4 w-full">
					<div tw="md:grid md:grid-cols-4 md:gap-6">
						<div tw="md:col-span-1">
							<h3 tw="text-lg font-medium leading-6 text-neutral-300">Lunar Spoof</h3>
							<p tw="mt-1.5 text-sm text-neutral-400">Appear as if you're on Lunar when you aren't</p>
						</div>
						<div tw="mt-5 md:mt-0 md:col-span-3">
							<div tw="space-y-6">
								<div tw="grid grid-cols-3 gap-6">
									<div tw="col-span-3 sm:col-span-2">
										<div tw="col-span-4 sm:col-span-2">
											<div tw="flex items-center">
												<Switch
													checked={lunarSpoof}
													onChange={setLunarSpoof}
													css={[
														lunarSpoof ? tw`bg-rose-500` : tw`bg-neutral-700`,
														tw`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
													]}
												>
													<span
														aria-hidden="true"
														css={[
															lunarSpoof ? tw`translate-x-5` : tw`translate-x-0`,
															tw`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`,
														]}
													/>
												</Switch>
												<span tw="ml-3 mb-1" id="headlessui-label-104">
													<span tw="text-sm font-medium text-neutral-300">Enable Lunar Spoof</span>
												</span>
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
