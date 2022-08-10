import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { BrowserOpenURL, EventsOn, EventsEmit } from '@/wailsjs/runtime';
import { LaunchLilith } from '@/wailsjs/go/main/App';

const posts = [
	{
		title: 'Example Post',
		href: 'https://google.com',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
		imageUrl: 'https://source.boringavatars.com/marble/512/?square',
		author: {
			name: 'Some Author',
			imageUrl: 'https://source.boringavatars.com/beam/512/?square',
		},
	},
	{
		title: 'Example Post',
		href: 'https://google.com',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
		imageUrl: 'https://source.boringavatars.com/marble/512/?square',
		author: {
			name: 'Some Author',
			imageUrl: 'https://source.boringavatars.com/beam/512/?square',
		},
	},
	{
		title: 'Example Post',
		href: 'https://google.com',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
		imageUrl: 'https://source.boringavatars.com/marble/512/?square',
		author: {
			name: 'Some Author',
			imageUrl: 'https://source.boringavatars.com/beam/512/?square',
		},
	},
];

const Base = (props: { id: string }) => {
	const ButtonData = useStoreState((state: ApplicationStore) => state.button.data);
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);

	const launcherLog = [] as any;

	useEffect(() => {
		EventsOn('launch_lilith', (messages) => {
			store.getActions().button.setButtonData(messages);
		});

		EventsOn('lilith_err', (err) => {
			console.error(err);
		});

		EventsOn('lilith_log', (messages) => {
			console.log(messages);
			store.getActions().logs.pushLogs(messages);
		});
	}, []);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="pt-12">
				<div tw="py-20 grid place-items-center bg-rose-900 bg-opacity-[0.15]">
					<button
						onClick={() => {
							LaunchLilith().then((data) => console.log(data));
						}}
						disabled={ButtonData !== 'ready to launch'}
						className="group"
						tw="duration-500 transition py-4 px-24 bg-rose-500 hover:bg-[#eb576a] shadow-md shadow-rose-600/40 rounded-lg ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50 disabled:pointer-events-none disabled:shadow-lg disabled:shadow-rose-500/80 disabled:bg-rose-400"
					>
						<p tw="duration-500 transition font-black text-2xl text-white group-hover:drop-shadow">LAUNCH v1</p>
						<p tw="duration-500 transition text-sm font-bold text-rose-200 uppercase">{ButtonData}</p>
					</button>
				</div>
			</div>
			<button tw="text-white p-2" onClick={() => console.log(Logs)}>
				Show logs
			</button>
			<button tw="text-white p-2" onClick={() => store.getActions().logs.reset()}>
				Clear Logs
			</button>
			<button tw="text-white p-2" onClick={() => EventsEmit('stop')}>
				Stop Lilith
			</button>
			<div tw="text-white text-sm">{Logs && Logs.map((item: string) => <p>{item}</p>)}</div>
			<div className="relative max-w-7xl mx-auto mb-5">
				<div className="text-center">
					<h2 className="py-2.5 text-neutral-200 text-lg font-semibold">Recent News</h2>
				</div>
				<div className="mx-6 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
					{posts.map((post) => (
						<a onClick={() => BrowserOpenURL(post.href)} className="block hover:-translate-y-[3px] transition cursor-pointer">
							<div key={post.title} className="flex flex-col rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition">
								<div className="flex-shrink-0">
									<img className="h-36 w-full object-cover" src={post.imageUrl} alt="" />
								</div>
								<div className="flex-1 bg-neutral-800 p-4 flex flex-col justify-between">
									<p className="text-sm text-neutral-400 -mt-1">{post.description}</p>
									<div className="mt-3 flex items-center">
										<div className="flex-shrink-0">
											<span className="sr-only">{post.author.name}</span>
											<img className="h-5 w-5 rounded" src={post.author.imageUrl} alt="" />
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
