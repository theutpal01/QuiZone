import Image from "next/image";
import { useState } from "react";
import { Grid, Container, Box, Card, CardContent, Typography, Button, styled, useTheme } from "@mui/material";

import DialogBox from 'src/components/DialogBox';

const TypographyH1 = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(55),
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

const TypographyH = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(26),
    [theme.breakpoints.down('lg')]: {
        fontSize: theme.typography.pxToRem(24)
    },
    [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(22)
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(19)
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


function Description({ heading = "", body = "", endnote = "", cardData = [] }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");


    const showDialog = (e) => {
        setTitle(cardData[e.target.name].heading);
        setMessage(cardData[e.target.name].body);
        setOpen(true);
    };

    const hideDialog = () => {
        setTitle("");
        setMessage("");
        setOpen(false);
    }

    return (
        <>
            <Container maxWidth={"lg"} sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row', [theme.breakpoints.down('md')]: { flexFlow: 'column', justifyContent: 'space-evenly', pt: theme.spacing(8) }, alignItems: 'center' }}>
                <Image src="/static/images/home/description.svg" width={400} height={400} alt="description" />
                <Box sx={{ bgcolor: `${theme.palette.background.paper}`, textAlign: 'justify'}} maxWidth={'sm'}>
                    <TypographyH1 variant='h2' pb={2} sx={{ color: 'primary.main' }}>{heading}</TypographyH1>
                    <TypographyS1 variant='body3' >{body}</TypographyS1>
                </ Box>
            </Container>

            <Container maxWidth={"lg"} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', [theme.breakpoints.down('md')]: { flexFlow: 'column', justifyContent: 'space-evenly', pt: theme.spacing(8) }, alignItems: 'center'}}>
                <Box sx={{ bgcolor: `${theme.palette.background.paper}`, maxWidth: 'sm', [theme.breakpoints.up('md')]: { maxWidth: 'lg' } }}>
                    <Grid container spacing={2} direction="row" p={4}>

                        {cardData.map((card, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4} display={'flex'}>
                                <Card variant="contained" elevation={12} sx={{ boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.2)' }}>
                                    {/* <CardMedia component="img" height="140" image="/static/images/cards/contemplative-reptile.jpg" alt="green iguana"/> */}
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <TypographyH textAlign={"center"} variant="h4" component="div" pb={3} color={'primary.light'}>{card.heading}</TypographyH>
                                        <Typography variant="body1" sx={{ pb: 5 }}>{card.body.substr(0, 200) + '...'}</Typography>
                                        <Button name={index} onClick={showDialog} variant="contained">Read more</Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                    </Grid>
                    <Container maxWidth={'lg'} sx={{ textAlign: 'justify' }}>
                        <TypographyS1 variant='body3'>{endnote}</TypographyS1>
                    </Container>
                </Box>
            </Container>

            <DialogBox open={open} hideDialog={hideDialog} title={title} message={message} />
        </>
    );
};

export default Description;