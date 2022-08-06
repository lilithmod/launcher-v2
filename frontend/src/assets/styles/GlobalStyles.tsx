import React, { Fragment } from 'react';
import { Global } from '@emotion/react';
import tw, { css, theme, GlobalStyles as BaseStyles } from 'twin.macro';

const customStyles = css({
	body: {
		...tw`antialiased bg-neutral-900 cursor-default select-none scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900`,
	},
});

const GlobalStyles = () => (
	<Fragment>
		<BaseStyles />
		<Global styles={customStyles} />
	</Fragment>
);

export default GlobalStyles;
