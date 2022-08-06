import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';

const Base = (props: { id: string }) => {
	return (
		<PageContentBlock pageId={props.id}>
			<div tw="pt-12">
				<div tw="py-20 grid place-items-center bg-rose-900 bg-opacity-[0.15]">
					<button
						className="group"
						tw="duration-500 transition py-4 px-24 bg-rose-500 hover:bg-[#eb576a] shadow-md shadow-rose-600/40 rounded-lg ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50"
					>
						<p tw="duration-500 transition font-black text-2xl text-white group-hover:drop-shadow">LAUNCH v3</p>
						<p tw="duration-500 transition text-sm font-bold text-rose-200 uppercase">ready to launch</p>
					</button>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;
