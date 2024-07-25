import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import { LoadingButton } from '@mui/lab';
import { Grid, Container, Box, Card, Typography, FormControl, TextField, styled, Stack, Button } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import { changePassword, checkReq } from '../../utils/auth'

import Error from '../../src/components/Error'
import Link from '../../src/components/Link';
import Alert from '../../src/components/AlertBox';



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

function Change({ name, router, _id, type, message, alertStatus }) {
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

        if (form && (!form.password || !form.confirm_password))
            return showAlert("error", "Please fill all the fields.");

        if (form.password.length < 8 || form.password.length > 20)
            return showAlert("error", "Password should be between 8 to 20 letters.");

        if (form && (form.password !== form.confirm_password))
            return showAlert("error", "Password do not match.");


        setLoading(true);
        const res = await changePassword(_id, form.password);

        if (res.type === "success") {
            setTimeout(() => {
                router.push("/auth/login");
                setLoading(false);
            }, 2500);
        }
        showAlert(res.type, res.message);
        if (res.type === "error") setLoading(false);

    };

    return (
        <>
            <Head>
                <title>{`Reset Password | ${name}`}</title>
            </Head>

            {type === "error" &&
                <Error name={name} router={router} image={500} error={message} />}

            {type === "success" &&
                <>
                    <Button component={Link} href="/" sx={{ position: "fixed", top: '20px', left: '20px' }} size="medium" variant="text" ><HomeOutlinedIcon fontSize="small" mr={2} /> Home</Button>
                    <Grid item xs={12} sx={{ display: 'flex', mx: 'auto', alignItems: 'center', overflow: 'auto', height: '100vh', p: 4 }}>
                        <Box maxWidth={"md"} margin={"auto"}>
                            <Card sx={{ textAlign: 'center', p: 4, boxShadow: '1px 1px 5px grey' }} variant="filled">
                                <TypographyH1 variant="h2" pb={0.5} textAlign="left">
                                    Reset Password
                                </TypographyH1>
                                <TypographyP variant="subtitle1" pb={3} textAlign="left">
                                    Fill in the fields below to sign into your account.
                                </TypographyP>

                                <FormControl id="loginForm" variant="outlined" fullWidth={true}>
                                    <Stack spacing={2}>
                                        <TextField type="password" label="Password" variant="outlined" name="password" onChange={handleChange}></TextField>
                                        <TextField type="password" label="Confirm Password" variant="outlined" name="confirm_password" onChange={handleChange}></TextField>
                                        <br />
                                        <LoadingButton loading={loading} loadingIndicator="Please wait…" id="submit" variant="contained" onClick={handleSubmit}>Change Password</LoadingButton>
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
            }
        </>
    );
}

export default Change;


export async function getServerSideProps(context) {
    try {
        // Fetch data from an API or perform any other server-side tasks
        const { query } = context;
        console.log(query)
        const res = await checkReq(query);

        return {
            props: {
                _id: query._id,
                type: res.type,
                message: res.message
            },
        };
    } catch (error) {
        console.log(error.toString());
        return {
            props: {
                _id: null,
                type: "error",
                message: "Something went wrong."
            }
        }
    }
}