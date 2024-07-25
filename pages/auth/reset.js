import Head from "next/head";
import { useState, useEffect } from "react";

import { LoadingButton } from '@mui/lab';
import { Grid, Box, Card, Typography, FormControl, TextField, styled, Stack, Button } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import Link from '../../src/components/Link';
import Alert from '../../src/components/AlertBox';
import { reset } from "../../utils/auth";



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



function Reset({ name, router, alertStatus }) {
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

		if (form && (!form.email))
			return showAlert("error", "Please fill all the fields.");

		setLoading(true);
		
		const res = await reset(form);
		if (res.type === "success") setForm({});
		showAlert(res.type, res.message);
		setLoading(false);

	};

	return (
		<>
			<Head>
				<title>{`Reset Password | ${name}`}</title>
			</Head>
			<Button component={Link} href="/" sx={{ position: "fixed", top: '20px', left: '20px' }} size="medium" variant="text" ><HomeOutlinedIcon fontSize="small" mr={2} /> Home</Button>
			<Grid item xs={12} sx={{ display: 'flex', mx: 'auto', alignItems: 'center', overflow: 'auto', maxHeight: '100vh', p: 4 }}>
				<Box maxWidth={"md"} margin={"auto"} p={4}  sx={{ display: 'grid', alignItems: 'center', minHeight: '100vh' }}>
					<Card sx={{ textAlign: 'center', p: 4, boxShadow: '1px 1px 5px grey' }} variant="filled">
						<TypographyH1 variant="h2" pb={0.5} textAlign="left">
							Recover Password
						</TypographyH1>
						<TypographyP variant="subtitle1" pb={3} textAlign="left">
							Enter the email used for registration to reset your password.
						</TypographyP>

						<FormControl id="loginForm" variant="outlined" fullWidth={true}>
							<Stack spacing={2}>
								<TextField type="email" label="Email address" variant="outlined" name="email" value={form.email || ""} onChange={handleChange}></TextField>
								<br />
								<LoadingButton loading={loading} loadingIndicator="Please wait…" id="submit" variant="contained" onClick={handleSubmit}>Submit</LoadingButton>
							</Stack>
						</FormControl>
						<Box sx={{ textAlign: "right", fontWeight: "bold" }} pt={4}>
							Want to try to sign in again?
							<Box component={Link} sx={{ textAlign: "right", textDecoration: "none", fontWeight: "bold", pl: 0.5 }} mb={5} href="/auth/login">Click here</Box>
						</Box>
					</Card>
				</Box>
			</Grid>
			{(alert.type && alert.message) && <Alert alert={alert} />}
		</>
	);
}

export default Reset;
