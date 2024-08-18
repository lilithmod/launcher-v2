import React, { useState } from 'react';

import tw from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import { SaveConfig } from '@/wailsjs/go/main/App';
import { PageContentBlock } from '@/components/elements/Generic';

const Base = (props: { id: string; config: any }) => {
	const navigate = useNavigate();
	const { config } = props;

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="max-w-7xl mx-auto py-5 px-4 sm:px-6 md:px-8 w-full pt-16"></div>
		</PageContentBlock>
	);
};

export default Base;
