import React, { useEffect } from 'react';

const Page = (props: { component: any; id?: any; config?: any }) => {
	return <props.component pageId={props?.id} config={props?.config} />;
};

export default Page;
