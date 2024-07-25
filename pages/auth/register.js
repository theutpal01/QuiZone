import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import { LoadingButton } from '@mui/lab'
import { Hidden, Grid, Box, Card, Typography, FormControl, TextField, Stack, Button, MenuItem, styled } from "@mui/material"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import Link from '../../src/components/Link';
import Scrollbar from '../../src/components/Scrollbar'
import AlertBox from "../../src/components/AlertBox";
import { register } from "../../utils/auth";


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



function Register({ name, classes, router, alertStatus }) {
	const [form, setForm] = useState({});
	const [showClass, setShowClass] = useState(false);
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

		if (form && (!form.name || !form.email || !form.password || !form.confirm_password || !form.role || (form.role === "user") ? !form.class : null)) {
			if (form.role === "user" && !form.class) {
				return showAlert("error", "Please fill all the fields.");
			} else {
				return showAlert("error", "Please fill all the fields.");
			}
		}

		setLoading(true);

		const res = await register(form);
		if (res.type === "success") {
			setForm({});
			setTimeout(() => {
				router.push(`/auth/verify?_id=${res.data._id}`);
				setLoading(false);
			}, 2500);
		}
		showAlert(res.type, res.message);
		if (res.type === "error") setLoading(false);

	};

	useEffect(() => {
		if (form.role === "user") {
			setShowClass(true);
		} else {
			setShowClass(false);
		}
	}, [form.role])


	return (
		<>
			<Head>
				<title>{`Register | ${name}`}</title>
			</Head>
			<Grid container sx={{ alignItems: 'center' }}>
				<Hidden mdDown>
					<Grid item xs={12} md={6}>
						<Box full sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', height: '100vh' }}>
							<Image alt="Register" width={330} height={330} src="/static/images/auth/register.svg" />
						</Box>
					</Grid>
				</Hidden>

				<Grid item xs={12} md={6} sx={{ overflow: 'hidden', alignItems: 'center' }}>
					<Box sx={{ overflow: 'auto', height: '100vh' }}>
						<Scrollbar>
							<Button component={Link} href="/" sx={{ position: "fixed", top: '20px', left: '20px', color: { md: 'white' } }} size="medium" variant="text" ><HomeOutlinedIcon fontSize="small" mr={2} /> Home</Button>

							<Box maxWidth={"sm"} margin={"auto"} p={4} sx={{ display: 'grid', alignItems: 'center', minHeight: '100vh' }}>
								<Card variant="filled" sx={{ textAlign: 'center', px: 4, py: 2, boxShadow: '1px 1px 5px grey' }} >
									<TypographyH1 variant="h2" pb={0.5}>
										Create account
									</TypographyH1>
									<TypographyP variant="subtitle1" pb={5}>
										Fill in the fields below to sign up for an account.
									</TypographyP>

									<FormControl id="loginForm" variant="outlined" fullWidth={true}>
										<Stack spacing={2}>
											<TextField id="name" label="Name" name="name" variant="outlined" value={form.name || ""} onChange={handleChange}></TextField>
											<TextField id="email" type="email" label="Email address" name="email" variant="outlined" value={form.email || ""} onChange={handleChange}></TextField>
											<TextField id="password" type="password" label="Password" name="password" variant="outlined" value={form.password || ""} onChange={handleChange}></TextField>
											<TextField id="confirmPassword" type="password" label="Confirm Password" name="confirm_password" variant="outlined" value={form.confirm_password || ""} onChange={handleChange}></TextField>

											<TextField sx={{ textAlign: 'left' }} select onChange={handleChange} name="role" value={form.role || ""} label={"Role"}>
												<MenuItem key="" value="">None</MenuItem>
												<MenuItem key="manager" value={"manager"}>Teacher</MenuItem>
												<MenuItem key="user" value={"user"}>Student</MenuItem>
											</TextField>

											{showClass &&
												<TextField sx={{ textAlign: 'left' }} select onChange={handleChange} name="class" value={form.class || ""} label={"Class"}>
													<MenuItem key="" value="">None</MenuItem>
													{classes.map((classNumber => (
														<MenuItem key={classNumber} value={classNumber}>{`Class ${classNumber}`}</MenuItem>
													)))}
												</TextField>
											}


											<br />
											<LoadingButton loading={loading} loadingIndicator="Please wait…" variant="contained" onClick={handleSubmit}>Create your account</LoadingButton>


											<Box sx={{ textAlign: "left", fontWeight: "bold" }} pt={2}>
												Already have an account?
												<Box component={Link} sx={{ textAlign: "right", textDecoration: "none", fontWeight: "bold", pl: 0.5 }} mb={5} href="/auth/login">Sign in here</Box>
											</Box>
										</Stack>
									</FormControl>
								</Card>
							</Box>
						</Scrollbar>
					</Box>
				</Grid>
			</Grid >
			{(alert.type && alert.message) && <AlertBox alert={alert} />}

		</>
	);
}

export default Register;
