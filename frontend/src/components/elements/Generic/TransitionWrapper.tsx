import React from 'react';

import Fade from './Fade';
import tw from 'twin.macro';
import { Route } from 'react-router';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';

const StyledTransition = styled(Transition)`
	${tw`relative`};

	& section {
		${tw`absolute w-full top-0 left-0`};
	}
`;

/* rewrite to use routes */
const TransitionWrapper = (props: { render: React.ReactNode }) => {
	return (
		<StyledTransition>
			<Fade timeout={150} in appear unmountOnExit>
				<section>{props.render}</section>
			</Fade>
		</StyledTransition>
	);
};

export default TransitionWrapper;
