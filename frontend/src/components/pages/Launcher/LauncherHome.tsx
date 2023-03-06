import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import Convert from 'ansi-to-html';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { LauncherWrapper } from '@/wailsjs/go/main/App';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BrowserOpenURL, EventsOn, EventsEmit } from '@/wailsjs/runtime';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { ChevronDownIcon, ExclamationIcon, XIcon } from '@heroicons/react/solid';

const Base = (props: { id: string }) => {
	const ButtonData = useStoreState((state: ApplicationStore) => state.button.data);
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);
	const ButtonStartStatus = ButtonData !== 'ready to launch';
	const parser = new Convert();

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="bg-[url('/assets/images/BackgroundImage.png')] h-screen bg-cover">
				<div tw="pt-12">
					<div tw="py-20 grid place-items-center">
						<button
							disabled={ButtonStartStatus}
							className="group relative z-0 inline-flex shadow-sm rounded-lg duration-500 transition bg-rose-500/[0.84] shadow-md shadow-rose-600/40 ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50 disabled:shadow-purple-500/80 disabled:bg-purple-500 border border-rose-400 disabled:border-purple-400 hover:disabled:scale-100 hover:bg-rose-500 hover:disabled:bg-purple-500"
						>
							<button
								disabled={ButtonStartStatus}
								onClick={() => {
									store.getActions().logs.reset();
									LauncherWrapper().then((data) => console.log(data));
								}}
								tw="transition rounded-l-lg py-4 pl-24 pr-20 disabled:pointer-events-none"
							>
								<p tw="duration-500 transition font-black text-2xl text-white group-hover:drop-shadow">LAUNCH v1</p>
								<p tw="duration-500 transition text-sm font-bold text-rose-200 uppercase -mx-20" css={ButtonStartStatus && tw`text-purple-200`}>
									{ButtonData}
								</p>
							</button>
						</button>
					</div>
				</div>
				<div className="sm:flex sm:items-start h-[20rem] overflow-y-scroll">
					<pre tw="text-neutral-200 text-sm font-medium">
						{Logs.map((item: string) => (
							<div tw="drop-shadow-md" dangerouslySetInnerHTML={{ __html: parser.toHtml(item) }} />
						))}
					</pre>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
