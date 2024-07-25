import { sendMessage } from 'utils/user'
import Image from "next/image";
import { useState } from "react";

import { Container, Box, Hidden, Card, Stack, Typography, useTheme, styled, FormControl, TextField } from "@mui/material";

import { LoadingButton } from '@mui/lab';
import AlertBox from "src/components/AlertBox";


const TypographyH2 = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(60),
	[theme.breakpoints.down('lg')]: {
		fontSize: theme.typography.pxToRem(45)
	},
	[theme.breakpoints.down('md')]: {
		fontSize: theme.typography.pxToRem(35)
	},
	[theme.breakpoints.down('sm')]: {
		fontSize: theme.typography.pxToRem(25)
	}
}));

const TypographyS1 = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(20),
	[theme.breakpoints.down('lg')]: {
		fontSize: theme.typography.pxToRem(19)
	},
	[theme.breakpoints.down('md')]: {
		fontSize: theme.typography.pxToRem(17)
	},
	[theme.breakpoints.down('sm')]: {
		fontSize: theme.typography.pxToRem(15)
	}
}));


function Contact({ alertStatus }) {
	const theme = useTheme()
	const [form, setForm] = useState({});
	const { alert, showAlert } = alertStatus;
	const [loading, setLoading] = useState(false);


	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};


	const handleSubmit = async (e) => {
		e.preventDefault();

		if (form && (!form.name || !form.email || !form.subject || !form.message))
			return showAlert("error", "Please fill all the fields.");

		setLoading(true);
		const res = await sendMessage(form)

		if (res.type === "success") {
			setForm({});
			setTimeout(() => {
				setLoading(false);
			}, 1500);
		}
		if (res.type === "success") setForm({})
		showAlert(res.type, res.message);
		setLoading(false);

	};


	return (
		<Container maxWidth={'lg'} sx={{mt: 7}}>
			<Container maxWidth={"lg"} sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row', [theme.breakpoints.down('md')]: { flexFlow: 'column-reverse', justifyContent: 'flex-end', pt: theme.spacing(8) }, alignItems: 'center', height: '100%' }}>
				<Hidden mdDown>
					<Box sx={{ width: '50vw', display: 'grid', alignItems: 'center', mx: 'auto', p: 4 }}>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<TypographyH2 variant="h2" pb={0.5} sx={{ color: 'primary.main' }}>Contact Us</TypographyH2>
							<TypographyS1 variant="body1" pt={0.5} pb={1}>
								We would love to get in touch and learn more about you. So, send us a message and we will reply as fast as we can.
							</TypographyS1>
							<Image src="/static/images/home/contact.svg" width={300} height={300} alt="contact" />
						</Box>
					</Box>
				</Hidden>
				<Container maxWidth={"lg"} sx={{ width: { xs: '100%', md: '50vw' }, height: '100%', display: 'grid', alignItems: 'center', mx: 'auto', p: 4 }}>
					<Card sx={{ textAlign: 'center', p: 4, boxShadow: '2px 2px 8px grey' }} variant="outlined">

						<Hidden mdUp>
							<TypographyH2 sx={{ textAlign: 'left', color: 'primary.main' }} variant="h2" pb={0.5}>Contact Us</TypographyH2>
							<Typography sx={{ textAlign: 'justify' }} variant="subtitle1" pb={4}>
								We would love to get in touch and learn more about you. So, send us a message and we will reply as fast as we can.
							</Typography>
						</Hidden>

						<FormControl id="contactForm" variant="outlined" fullWidth={true}>
							<Stack spacing={2}>
								<TextField label="Name" variant="outlined" name="name" value={form.name || ""} onChange={handleChange} />
								<TextField type="email" label="Email address" variant="outlined" name="email" value={form.email || ""} onChange={handleChange} />
								<TextField label="Subject" variant="outlined" name="subject" value={form.subject || ""} onChange={handleChange} />
								<TextField label="Message" variant="outlined" name="message" multiline rows={5} value={form.message || ""} onChange={handleChange} />
								<LoadingButton loading={loading} loadingIndicator="Please wait…" variant="contained" onClick={handleSubmit}>Send Message</LoadingButton>
								{(alert.type && alert.message) && <AlertBox alert={alert} />}
							</Stack>
						</FormControl>
					</Card>
				</Container>
			</Container>
		</Container>

	);
}

export default Contact