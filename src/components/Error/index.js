import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

import { Box, Typography, Container, Button, Grid, styled } from '@mui/material';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '../Link';


const MainContent = styled(Box)(
	() => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Status({name, image, error, router }) {

	const [pending, setPending] = useState(false);
	const finalSlashIndex = router.asPath.lastIndexOf('/');
	const previousPath = router.asPath.slice(0, finalSlashIndex);

	function handleClick() {
		setPending(true);
		setTimeout(() => {
			router.reload(router.pathname);
			setPending(false);
		}, 1000);
	}

	return (
		<>
			<Head>
				<title>Error | {name}</title>
			</Head>
			<MainContent>
				<Grid container sx={{ height: '100%' }} alignItems="stretch" spacing={0}>
					<Grid xs={12} alignItems="center" display="flex" justifyContent="center" item>
						<Container maxWidth="sm">
							<Box textAlign="center">
								<Image alt="500" priority={true} 
								width={260} 
								height={260} src={`/static/images/status/${image}.svg`}
								/>
								<Typography variant="h2" sx={{ my: 2 }}>
									There was an error, please try again later
								</Typography>
								<Typography
									variant="h4"
									color="text.secondary"
									fontWeight="normal"
									sx={{ mb: 4 }}
								>
									{error}
								</Typography>
								<LoadingButton
									onClick={handleClick}
									loading={pending}
									variant="outlined"
									color="primary"
									startIcon={<RefreshTwoToneIcon />}
								>
									Refresh view
								</LoadingButton>
								<Button  onClick={() => (router.history.lenght >= 2) ? router.back() : router.push("/")} variant="contained" sx={{ ml: 1 }}>
									Go back
								</Button>
							</Box>
						</Container>
					</Grid>
				</Grid>
			</MainContent>
		</>
	);
}

export default Status;
