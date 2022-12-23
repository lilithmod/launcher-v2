import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { posts } from '@/lang';
import Convert from 'ansi-to-html';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { LaunchLilith } from '@/wailsjs/go/main/App';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BrowserOpenURL, EventsOn, EventsEmit } from '@/wailsjs/runtime';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { ChevronDownIcon, ExclamationIcon, XIcon } from '@heroicons/react/solid';

const Base = (props: { id: string }) => {
	const ButtonData = useStoreState((state: ApplicationStore) => state.button.data);
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);
	const ButtonStartStatus = ButtonData !== 'ready to launch';
	const [open, setOpen] = useState(false);
	const parser = new Convert();

	return (
		<PageContentBlock pageId={props.id}>
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
					<div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Dialog.Overlay className="fixed inset-0 bg-neutral-900 backdrop-blur-lg backdrop-filter bg-opacity-75 transition-opacity" />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
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
							<div className="inline-block align-bottom bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 rounded-lg text-left overflow-hidden shadow-xl transform transition-all mt-12 sm:align-middle w-[50rem] sm:p-5">
								<div className="absolute top-2 right-2">
									<button
										type="button"
										className="text-neutral-400 hover:text-neutral-500 focus:outline-none transition"
										onClick={() => setOpen(false)}
									>
										<span className="sr-only">Close</span>
										<XIcon className="h-5 w-5" aria-hidden="true" />
									</button>
								</div>
								<div className="sm:flex sm:items-start h-[28rem] overflow-y-scroll">
									<pre tw="text-neutral-200 text-sm font-medium">
										{Logs.map((item: string) => (
											<div tw="drop-shadow-md" dangerouslySetInnerHTML={{ __html: parser.toHtml(item) }} />
										))}
									</pre>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
			<div tw="pt-12">
				<div tw="py-20 grid place-items-center bg-rose-900 bg-opacity-[0.15]">
					<button
						disabled={ButtonStartStatus}
						className="group relative z-0 inline-flex shadow-sm rounded-lg duration-500 transition bg-rose-500/[0.84] shadow-md shadow-rose-600/40 ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50 disabled:shadow-purple-500/80 disabled:bg-purple-500 border border-rose-400 disabled:border-purple-400 hover:disabled:scale-100 hover:bg-rose-500 hover:disabled:bg-purple-500"
					>
						<button
							disabled={ButtonStartStatus}
							onClick={() => {
								store.getActions().logs.reset();
								LaunchLilith().then((data) => console.log(data));
							}}
							tw="transition rounded-l-lg py-4 pl-24 pr-20 disabled:pointer-events-none"
						>
							<p tw="duration-500 transition font-black text-2xl text-white group-hover:drop-shadow">LAUNCH v1</p>
							<p tw="duration-500 transition text-sm font-bold text-rose-200 uppercase -mx-20" css={ButtonStartStatus && tw`text-purple-200`}>
								{ButtonData}
							</p>
						</button>
						<Menu as="span" className="relative block">
							<Menu.Button
								disabled={!ButtonStartStatus}
								className="transition border-l border-rose-400 relative inline-flex items-center px-2 py-8 rounded-r-md focus:outline-none hover:bg-rose-400/60 text-white disabled:pointer-events-none disabled:text-rose-200"
								css={ButtonStartStatus && tw`border-purple-400 hover:bg-purple-400/60`}
							>
								<span className="sr-only">Open options</span>
								<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="origin-top-left absolute right-0 mt-2 -mr-1 rounded-md shadow-lg bg-neutral-700 backdrop-blur-lg backdrop-filter bg-opacity-80 ring-1 ring-black ring-opacity-5 divide-y divide-neutral-600 focus:outline-none z-50">
									<div className="py-1 w-24">
										<Menu.Item>
											{({ active }) => (
												<a
													onClick={() => setOpen(true)}
													className={classNames(
														active ? 'bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 text-neutral-300' : 'text-neutral-400',
														'block px-4 py-2 text-sm hover:cursor-pointer focus:outline-none'
													)}
												>
													View logs
												</a>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<a
													onClick={() => {
														EventsEmit('stop');
													}}
													className={classNames(
														active ? 'bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 text-neutral-300' : 'text-neutral-400',
														'block px-4 py-2 text-sm hover:cursor-pointer focus:outline-none'
													)}
												>
													Stop lilith
												</a>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</button>
				</div>
			</div>
			<div className="relative max-w-7xl mx-auto">
				<div className="text-center">
					<h2 className="py-2.5 text-neutral-200 text-lg font-semibold">Recent News</h2>
				</div>
				<div className="mx-6 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
					{posts.map((post) => (
						<a key={post.uuid} onClick={() => BrowserOpenURL(post.href)} className="group block hover:-translate-y-[3px] transition cursor-pointer">
							<div className="flex flex-col rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition">
								<div className="flex-shrink-0">
									<span className="absolute bottom-2 right-3 hidden group-hover:block font-bold text-neutral-200 drop-shadow text-sm">
										{post.title}
									</span>
									<img className="h-36 w-full object-cover" src={post.imageUrl} alt="" />
								</div>
								<div className="flex-1 bg-neutral-800 p-4 flex flex-col justify-between">
									<p className="text-sm text-neutral-400 -mt-1" dangerouslySetInnerHTML={{ __html: post.description }} />
									<div className="mt-3 flex items-center">
										<div className="flex-shrink-0">
											<span className="sr-only">{post.author.name}</span>
											<img className="h-5 w-5 rounded-full" src={post.author.imageUrl} alt="" />
										</div>
										<div className="ml-2">
											<p className="text-sm font-medium text-neutral-500">{post.author.name}</p>
										</div>
									</div>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
