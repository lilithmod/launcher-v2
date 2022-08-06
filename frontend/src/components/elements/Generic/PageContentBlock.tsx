import { useEffect } from 'react';

const PageContentBlock = (props: { pageId: string; children: any }) => {
	useEffect(() => {
		document.title = props.pageId + ' | Internal Lilith' || '';
	}, [props.pageId]);
	return props.children;
};

export default PageContentBlock;
