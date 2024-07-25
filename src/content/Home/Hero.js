import Image from "next/image";
import { Container, Box, Typography, Button, styled, useTheme } from "@mui/material"

import Link from "src/components/Link";

const TypographyH1 = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(60),
	[theme.breakpoints.down('lg')]: {
		fontSize: theme.typography.pxToRem(50)
	},
	[theme.breakpoints.down('md')]: {
		fontSize: theme.typography.pxToRem(40)
	},
	[theme.breakpoints.down('sm')]: {
		fontSize: theme.typography.pxToRem(30)
	}
}));


const TypographyS1 = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(22),
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


function Hero({ heading, subtitle, btnText, btnLink }) {
	const theme = useTheme()

	return (
		<Container maxWidth={"lg"} sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row', [theme.breakpoints.down('md')]: { flexFlow: 'column-reverse', justifyContent: 'space-evenly', pt: theme.spacing(8) }, alignItems: 'center', height: '100%' }}>
			<Box sx={{ bgcolor: `${theme.palette.background.paper}` }}>
				<TypographyH1 variant='h1' pb={1} sx={{ color: 'primary.main' }}>{heading}</TypographyH1>
				<TypographyS1 variant='subtitle1' pb={5}>{subtitle}</TypographyS1>
				<Button variant="contained" size='large' component={Link} href={btnLink}>{btnText}</Button>
			</ Box>
			<Image priority={true} src="/static/images/home/quiz.svg" width={400} height={400} alt="Quiz" />
		</Container>
	);
};

export default Hero;