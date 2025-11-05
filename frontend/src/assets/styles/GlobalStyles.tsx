import { Global } from '@emotion/react'
import React, { Fragment } from 'react'
import tw, { GlobalStyles as BaseStyles, css } from 'twin.macro'

const customStyles = css({
	body: {
		...tw`overscroll-none antialiased rounded-lg bg-neutral-900 cursor-default select-none `,
	},
})

const GlobalStyles = () => (
	<Fragment>
		<BaseStyles />
		<Global styles={customStyles} />
	</Fragment>
)

export default GlobalStyles
