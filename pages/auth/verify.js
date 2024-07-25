import { Box, Button, Typography, Container, styled } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';

import Link from '../../src/components/Link';
import { verifyUser } from '../../utils/auth';
import { getStatus } from '../../utils/user';

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

function Verify({ name, heading, message }) {
	return (
		<>
			<Head>
				<title>{`Verify | ${name}`}</title>
			</Head>
			<MainContent>
				<TopWrapper>
					<Container maxWidth="md">
						<Box textAlign="center">
							<Image alt="404" width={300} height={300} src="/static/images/auth/verify.svg" />
							<Typography variant="h4" sx={{ my: 2 }}>
								{heading}
							</Typography>
							<Typography variant="body1" sx={{ my: 2, whiteSpace: 'pre-line' }}>
								{message}
							</Typography>
							<Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
								<Button component={Link} href="/auth/login" variant="outlined"> Login </Button>
							</Container>
						</Box>
					</Container>
				</TopWrapper>
			</MainContent>
		</>
	);
}

export default Verify;



export async function getServerSideProps(context) {
	try {
		const { query } = context;

		// Fetch data from an API or perform any other server-side tasks
		if (Object.keys(query).length === 1 && query._id) {
			const res = await getStatus(query._id);

			if (res.type === "success") {

				if (res.verified) {
					return {
						props: {
							heading: "You are already a verified user",
							message: "Please login to continue."
						},
					};
				} else {
					return {
						props: {
							heading: "Please verify your account.",
							message: "We have sent an email with a confirmation link to your email address. It may take few minutes for the email to reach your inbox or end up in your spam folder."
						},
					};
				}
			} else {
				return {
					props: {
						heading: "Something went wrong!",
						message: "Please try again after some time."
					},
				};
			}
		}


		if (Object.keys(query).length === 2 && query._id !== undefined && query.verification_token !== undefined) {
			const res = await verifyUser(query)
			return {
				props: {
					heading: res.message[0],
					message: res.message[1]
				},
			};
		}
		else {
			return {
				props: {
					heading: "Something went wrong!",
					message: "Please try again after some time."
				},
			};
		}

	} catch (error) {
		console.log(error.toString());
		return {
			props: {
				heading: "Something went wrong!",
				message: "Please try again after some time."
			},
		};
	}
}