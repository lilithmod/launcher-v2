import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { debounce } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { SettingsRouter } from '@/routers';
import { Offline } from 'react-detect-offline';
import { store, ApplicationStore } from '@/state';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { Spinner, Appbar } from '@/components/elements/Generic';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LauncherHome, LauncherPremium } from '@/components/pages/Launcher';

const App = () => {
	return (
		<HashRouter>
			<GlobalStyles />
			<Appbar />
			<Routes>
				<Route path="/" element={<Navigate to="/launch" replace />} />
				<Route path="/launch" element={<Page component={LauncherHome} id="homepage-launcher" />} />
				<Route path="/settings/*" element={<SettingsRouter />} />
				<Route path="/premium" element={<Page component={LauncherPremium} id="buy-premium" />} />
			</Routes>
		</HashRouter>
	);
};

export default App;
