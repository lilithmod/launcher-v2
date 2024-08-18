import React, { useEffect } from 'react';

const Page = (props: { component: any; id?: any; config?: any; loaded?: boolean }) => {
	return <props.component pageId={props?.id} config={props?.config} loaded={props?.loaded} />;
};

export default Page;
