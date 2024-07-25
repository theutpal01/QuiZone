import Image from 'next/image'
import { Box, Button, IconButton, Typography, styled, useTheme, alpha } from '@mui/material';

import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';

import Link from 'src/components/Link';

const TypographyH1 = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(48),
    [theme.breakpoints.down('lg')]: {
        fontSize: theme.typography.pxToRem(44)
    },
    [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(35)
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(22)
    }
}));

const TypographyS1 = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(22),
    [theme.breakpoints.down('lg')]: {
        fontSize: theme.typography.pxToRem(19)
    },
    [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(15)
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(12)
    }
}));


function Footer({ show }) {
    const theme = useTheme();
    return (
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: 'secondary.light', width: '100%', mt: 20, pt: 15 }}>

            {show && <Box sx={{
                position: 'absolute',
                top: '-30%',
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'primary.main',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',
                p: 4, borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: { xs: '97%', md: '80%' },
            }}>
                <Box backgroundColor="primary.main">
                    <TypographyH1 variant='h4' pb={1} color={'white'}>Join QuiZone today</TypographyH1>
                    <TypographyS1 fontSize={"small"} variant='body1' color={'white'}>and unlock a world of interactive learning and assessment possibilities!</TypographyS1>
                </Box>
                <Box sx={{ bgcolor: 'white', borderRadius: 1, display: 'flex' }}>
                    <Button sx={{ width: '100px' }} component={Link} href="/auth/register" variant='outlined'>Join</Button>
                </Box>
            </Box>
            }

            <Box sx={{ p: 2, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ width: 'fit-content', px: 2, display: 'flex', alignSelf: 'center' }}>
                        <Image sx={{ width: { sx: '30px', sm: '40px', md: '50px', lg: '65px' }, height: { sx: '30px', sm: '40px', md: '50px', lg: '65px' } }} width={50} height={50} src={'/icon.png'} />
                    </Box>
                    <Box color="white">
                        <TypographyH1 variant="h2" sx={{color: 'primaryAlt.main'}}>QuiZone</TypographyH1>
                        <TypographyS1 variant="body1">Where learning meets fun</TypographyS1>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 1, display: 'flex', backgroundColor: theme.palette.grey[900], alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{color: theme.palette.common.white}}>
                    QuiZone © 2023, All rights reserved
                </Typography>
                <Box sx={{ float: 'right' }}>
                    <IconButton component={Link} target='_blank' href="https://instagram.com/theutpal01" aria-label="instagram" sx={{ color: '#ff3a9e' }}>
                        <InstagramIcon />
                    </IconButton>
                    <IconButton component={Link} target='_blank' href="https://twitter.com/theutpal01" aria-label="twitter" sx={{ color: '#00c4ff' }}>
                        <TwitterIcon />
                    </IconButton>
                    <IconButton component={Link} target='_blank' href="https://github.com/theutpal01" aria-label="github" sx={{ color: '#ffffff' }}>
                        <GitHubIcon />
                    </IconButton>
                    <IconButton component={Link} target='_blank' href="https://linktr.ee/theutpal" aria-label="profile" sx={{ color: '#00ff37' }}>
                        <PersonIcon color='white' />
                    </IconButton>
                </Box>
            </Box>
        </Box >
    );
}

export default Footer;
