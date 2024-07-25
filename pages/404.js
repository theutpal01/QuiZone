import { Box, Typography, Container, Button, styled } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';

import Link from '../src/components/Link'

const MainContent = styled(Box)(
	() => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
	({ theme }) => `
	display: flex;
	width: 100%;
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: ${theme.spacing(6)};
`
);

function Status404() {
	return (
		<>
			<Head>
				<title>Status - 404</title>
			</Head>
			<MainContent>
				<TopWrapper>
					<Container maxWidth="md">
						<Box textAlign="center">
							<Image alt="404" priority={true} 
							width={260} 
							height={260} src="/static/images/status/404.svg" />
							<Typography variant="h2" sx={{ my: 2 }}>
								The page you were looking for doesn't exist.
							</Typography>
						</Box>
						<Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
							<Button component={Link} href="/" variant="outlined"> Go to homepage </Button>
						</Container>
					</Container>
				</TopWrapper>
			</MainContent>
		</>
	);
}

export default Status404;
