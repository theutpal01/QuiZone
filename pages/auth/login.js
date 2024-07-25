import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import { LoadingButton } from '@mui/lab';
import { Hidden, Grid, Box, Card, Typography, FormControl, TextField, styled, Stack, Button } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import Link from '../../src/components/Link';
import Scrollbar from '../../src/components/Scrollbar'
import Alert from '../../src/components/AlertBox'
import { login } from "../../utils/auth";


const TypographyH1 = styled(Typography)(
	({ theme }) => `
	  font-size: ${theme.typography.pxToRem(28)};
  `
);

const TypographyP = styled(Typography)(
	({ theme }) => `
	  font-size: ${theme.typography.pxToRem(14)};
  `
);



function Login({ name, router, alertStatus }) {
	const [form, setForm] = useState({});
	const { alert, showAlert } = alertStatus;
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0)
			router.push("/");
	}, [router]);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (form && (!form.email || !form.password))
			return showAlert("error", "Please fill all the fields.");

		setLoading(true);

		const res = await login(form);
		if (res.type === "success" && res.data) {
			document.cookie = `user=${res.data.token}; path=/; expires=${new Date(Date.now() + 86400000)};`;
			setForm({});
			setTimeout(() => {
				setLoading(false);
				router.push("/profile?_id="+res.data._id);
			}, 2500);
		}
		showAlert(res.type, res.message);
		if (res.type === "error") setLoading(false);
	};

	return (
		<>
			<Head>
				<title>{`Login | ${name}`}</title>
			</Head>
			<Grid container sx={{ alignItems: 'center' }}>
				<Hidden mdDown>
					<Grid item xs={12} md={6}>
						<Box full sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', height: '100vh' }}>
							<Image alt="Login" width={330} height={330} src="/static/images/auth/login.svg" />
						</Box>
					</Grid>
				</Hidden>

				<Grid item xs={12} md={6} sx={{ overflow: 'hidden' }}>
					<Box sx={{ overflow: 'auto', height: '100vh' }}>
						<Scrollbar>
							<Button component={Link} href="/" sx={{ position: "fixed", top: '20px', left: '20px', color: { md: 'white' } }} size="medium" variant="text" ><HomeOutlinedIcon fontSize="small" mr={2} /> Home</Button>

							<Box maxWidth={"sm"} margin={"auto"} p={4} sx={{ display: 'grid', alignItems: 'center', minHeight: '100vh' }}>
								<Card sx={{ textAlign: 'center', px: 4, py: 2, boxShadow: '1px 1px 5px grey' }} variant="filled">
									<TypographyH1 variant="h2" pb={0.5}>
										Sign in
									</TypographyH1>
									<TypographyP variant="subtitle1" pb={5}>
										Fill in the fields below to sign into your account.
									</TypographyP>

									<FormControl id="loginForm" variant="outlined" fullWidth={true}>
										<Stack spacing={2}>
											<TextField type="email" label="Email address" variant="outlined" name="email" value={form.email || ""} onChange={handleChange}></TextField>
											<TextField type="password" label="Password" variant="outlined" name="password" value={form.password || ""} onChange={handleChange}></TextField>
											<Box component={Link} sx={{ textAlign: "right", textDecoration: "none", fontWeight: "bold" }} pb={1} href="/auth/reset">Lost password?</Box>
											<LoadingButton loading={loading} loadingIndicator="Please wait…" variant="contained" onClick={handleSubmit}><span>Sign in</span></LoadingButton>
											<Box sx={{ textAlign: "left", fontWeight: "bold" }} pt={2}>
												Don't have an account, yet?
												<Box component={Link} sx={{ textAlign: "right", textDecoration: "none", fontWeight: "bold", pl: 0.5 }} mb={5} href="/auth/register">Sign up here</Box>
											</Box>
										</Stack>
									</FormControl>
								</Card>
							</Box>
						</Scrollbar>
					</Box>
				</Grid>
			</Grid>
			{(alert.type && alert.message) && <Alert alert={alert} />}
		</>
	);
}

export default Login;
