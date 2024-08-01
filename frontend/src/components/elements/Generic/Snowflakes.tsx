import { Fragment } from 'react';
import Snowfall from 'react-snowfall';

const SnowFlakes = (props: { season: boolean; children: any }) => (
	<Fragment>
		{props.season && <Snowfall style={{ zIndex: 100 }} color="#fff" />}
		{props.children}
	</Fragment>
);

export default SnowFlakes;
