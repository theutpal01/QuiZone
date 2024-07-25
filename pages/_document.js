import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from 'src/createEmotionCache';

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400&display=swap" />

					<meta name="description" content="QuizZone: Your Ultimate Online Quiz Platform for Schools and Education. Engage students, track progress, and create personalized quizzes. Discover a wide range of question types, extensive question banks, and real-time analytics. Join the educational revolution today! Boost learning with QuizZone." />
					<meta name="keywords" content="quizone, quizzone, quiz, zone, play, quiz, cbse, quizzes, home, arena, quizzes, login, signup, register, use quizone, play quiz, attempt quizzes" />
					<meta name="author" content="QuiZone Inc" />
					
					<meta property="og:title" content="QuiZone - Where learning meets fun!" />
					<meta property="og:description" content="QuiZone is a cutting-edge online platform specifically designed to facilitate MCQ (Multiple Choice Question) quizzes for students of all grades in school organizations. Whether you're a teacher, administrator, or student, QuiZone offers a seamless and engaging experience for conducting interactive quizzes that will captivate learners and foster a spirit of healthy competition." />
					<meta property="og:image" content="https://drive.google.com/uc?export=view&id=1WRjjjIkekybtxmby1V6XCMr-se59hQu-" />
					<meta property="og:url" content="https://quizoneinc.vercel.app/" />

					<meta property="twitter:card" content="summary_large_image" />
					<meta property="twitter:description" content="QuiZone is a cutting-edge online platform specifically designed to facilitate MCQ (Multiple Choice Question) quizzes for students of all grades in school organizations. Whether you're a teacher, administrator, or student, QuiZone offers a seamless and engaging experience for conducting interactive quizzes that will captivate learners and foster a spirit of healthy competition." />
					<meta property="twitter:image" content="https://drive.google.com/uc?export=view&id=1WRjjjIkekybtxmby1V6XCMr-se59hQu-" />
					<meta property="twitter:url" content="https://quizoneinc.vercel.app/" />

				</Head>
				<body style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none", userSelect: "none" }}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
	// Resolution order
	//
	// On the server:
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. document.getInitialProps
	// 4. app.render
	// 5. page.render
	// 6. document.render
	//
	// On the server with error:
	// 1. document.getInitialProps
	// 2. app.render
	// 3. page.render
	// 4. document.render
	//
	// On the client
	// 1. app.getInitialProps
	// 2. page.getInitialProps
	// 3. app.render
	// 4. page.render

	const originalRenderPage = ctx.renderPage;

	// You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
	// However, be aware that it can have global side effects.
	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents emotion to render invalid HTML.
	// See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: [
			...React.Children.toArray(initialProps.styles),
			...emotionStyleTags
		]
	};
};
