import React, { useEffect } from 'react';

const Page = (props: { component: any; id?: any }) => {
	return <props.component pageId={props.id} />;
};

export default Page;
