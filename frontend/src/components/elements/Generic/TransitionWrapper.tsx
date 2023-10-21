import React from 'react';
import Fade from './Fade';

/* rewrite to use routes */
const TransitionWrapper = (props: { render: React.ReactNode }) => {
	return (
		<Fade timeout={150} in appear unmountOnExit>
			<section>{props.render}</section>
		</Fade>
	);
};

export default TransitionWrapper;
