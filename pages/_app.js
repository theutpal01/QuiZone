import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import { CacheProvider } from '@emotion/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';

import ThemeProvider from '../src/theme/ThemeProvider';
import createEmotionCache from '../src/createEmotionCache';

import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

const clientSideEmotionCache = createEmotionCache();

const useDisableRightClick = () => {
	const disableContextMenu = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		window.addEventListener('contextmenu', disableContextMenu);
		return () => {
			window.removeEventListener('contextmenu', disableContextMenu);
		};
	}, []);
};

function App(props) {
	const subjects = {
        english: "English",
        maths: "Mathematics",
        science: "Science",
        sst: "Social Studies",
        hindi: "Hindi",
        phe: "Physical Education",
        cs: "Computer Science",
        evs: "Environmental Science/Studies",
        sanskrit: "Sanskrit",
        msc: "Moral Science/Ethics",
        gk: "General Knowledge",
        economics: "Economics",
        accountancy: "Accountancy",
        bst: "Business Studies",
        politics: "Political Science",
		aptitude: "Quantitative Skills/Aptitude",
    };
	const classes = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "College"];

	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	const getLayout = Component.getLayout ?? ((page) => page);

	const name = "QuiZone";
	const router = useRouter();
	const [alert, setAlert] = useState({ message: "", type: "", open: false });

	const showAlert = (type, message) => {
		setAlert({ type, message, open: true })

		setTimeout(() => {
			setAlert({ type: "", message: "", open: false });
		}, 3000);
	};

	useEffect(() => {

		router.events.on('routeChangeStart', nProgress.start);
		router.events.on('routeChangeError', nProgress.done);
		router.events.on('routeChangeComplete', nProgress.done);


		if (!navigator.cookieEnabled) {
			setError("Cookies are disabled");
			setMsg("Please enable cookies to continue.");
		}
	}, [router]);

	// Logout function
	const logout = () => {
		document.cookie = "user=; path=/;";
		router.push("/");
	}

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>{`Home | ${name}`}</title>
				<meta name="description" content="This is a Quiz Appilication" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<ThemeProvider>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<CssBaseline />
					{getLayout(<Component {...pageProps} disableRightClick={useDisableRightClick} classes={classes} subjects={subjects} bioLength={150} alertStatus={{ alert, showAlert }} name={name} router={router} logout={logout} />)}
				</LocalizationProvider>
			</ ThemeProvider>

		</ CacheProvider>
	);
}

export default App;
