import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

import { Box, Typography, Hidden, Container, Button, Grid, styled } from '@mui/material';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';


const GridWrapper = styled(Grid)(
	({ theme }) => `
    background: ${theme.colors.gradients.blue5};
`
);

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

const TypographyPrimary = styled(Typography)(
	({ theme }) => `
      color: ${theme.colors.alpha.white[100]};
`
);

const TypographySecondary = styled(Typography)(
	({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
);

function Status500() {

	const [pending, setPending] = useState(false);
	function handleClick() {
		setPending(true);
	}

	return (
		<>
			<Head>
				<title>Status - 500</title>
			</Head>
			<MainContent>
				<Grid container sx={{ height: '100%' }} alignItems="stretch" spacing={0}>
					<Grid xs={12} alignItems="center" display="flex" justifyContent="center" item>
						<Container maxWidth="sm">
							<Box textAlign="center">
								<Image alt="500" priority={true} 
								width={260} 
								height={260} src="/static/images/status/500.svg"
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
									The server encountered an internal error and was not able to complete your request
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
								<Button href="/" variant="contained" sx={{ ml: 1 }}>
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

export default Status500;
