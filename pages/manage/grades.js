import { getToken } from '../../utils/auth';
import { getUser } from '../../utils/user';
import { removeResult, searchResults } from '../../utils/result';
import { useEffect, useState } from 'react';

import Head from 'next/head';
import { Container, Box, CircularProgress, Grid, Typography } from '@mui/material';

import Error from '../../src/components/Error';
import HeaderLayout from '../../src/layouts/HeaderLayout';
import Scrollbar from '../../src/components/Scrollbar';
import PageHeader from '../../src/content/Management/Manage/PageHeader';
import PageTitleWrapper from '../../src/components/PageTitleWrapper';
import ManageTemplate from '../../src/content/Management/Manage/ManageTemplate';
import Alert from '../../src/components/AlertBox';


function Grades({ name, auth, results, alertStatus, classes, subjects, router, logout }) {
    const { alert, showAlert } = alertStatus;
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);


    const headCells = [
        {
            id: '',
            numeric: false,
            disablePadding: false,
            label: '',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'class',
            numeric: false,
            disablePadding: false,
            label: 'Class',
        },
        {
            id: 'quiz',
            numeric: false,
            disablePadding: false,
            label: 'Quiz Name',
        },
        {
            id: 'subject',
            numeric: false,
            disablePadding: false,
            label: 'Subject',
        },
        {
            id: 'score',
            numeric: false,
            disablePadding: false,
            label: 'Score',
        },
        {
            id: 'grade',
            numeric: false,
            disablePadding: false,
            label: 'Grade',
        },
        {
            id: 'actions',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
        },
    ];


    const createData = (_id, name, email, classNumber, quizName, subject, score, grade, answers, timestamp) => {
        return {
            _id, name, email, classNumber, quizName, subject, score, grade, answers, timestamp
        };
    }


    // FOR CLOSE BUTTON
    const handleDelete = async (_id) => {
        const res = await removeResult(auth.token, _id);
        showAlert(res.type, res.message)
        if (res.type === "success") {
            setRows(rows => rows.filter(row => row._id !== _id));
        }
    }


    useEffect(() => {
        setLoading(true);
        if (results) {
            setRows((prevRows) => [...prevRows, ...results.map((result) => {
                return createData(
                    result._id,
                    result.name,
                    result.email,
                    result.class,
                    result.quiz,
                    result.subject,
                    result.score[0],
                    `${result.score[2]} (${result.score[1]}%)`,
                    result.answers,
                    result.timestamp
                )
            })]);
        }
        setLoading(false);
    }, []);


    if (!auth.user || (auth.user && (auth.user.role !== "admin" && auth.user.role !== "manager"))) {
        return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
    }
    else {

        return (
            <>
                <Head>
                    <title>Manage Grades | {name}</title>
                </Head>
                <HeaderLayout name={name} auth={auth} logout={logout} />
                <Scrollbar>

                    <PageTitleWrapper>
                        <PageHeader
                            name={auth.user.name}
                            heading={"Grade Cards"}
                            subtitle={"these are all available grades of registered users."}
                            btnText={""}
                            showBtn={false} />
                    </PageTitleWrapper>

                    <Container sx={{ pb: 4 }}>
                        {(!rows || (rows && rows.length === 0)) &&
                            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                                <Typography variant="body1">No Users found</Typography>
                            </Container>
                        }

                        {rows && rows.length > 0 &&
                            <Container maxWidth="lg">

                                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>

                                    <Grid item xs={12}>
                                        <ManageTemplate role={auth.user.role} title={"Manage Grades"} headCells={headCells} rows={rows} type={"results"} classes={classes} subjects={subjects} handleDelete={handleDelete} />
                                    </Grid>

                                </Grid>
                            </Container>
                        }
                    </Container>
                </Scrollbar>

                {loading && <Box sx={{ zIndex: 9999, position: 'absolute', top: 0, left: 0, display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)' }}>
                    <CircularProgress />
                </Box>}

                {(alert.type && alert.message) && <Alert alert={alert} />}
            </>
        );
    }
}

export default Grades;


export async function getServerSideProps(context) {
    try {
        const token = await getToken(context.req);

        if (token !== undefined) {
            const res = await getUser(token);

            if (res.type === "success") {

                const response = await searchResults(token);
                if (response.type === "success") {

                    return {
                        props: {
                            auth: { user: res.data, token },
                            results: response.data
                        }
                    };

                } else {
                    return {
                        props: {
                            auth: { user: res.data, token },
                            results: null
                        }
                    };
                }

            } else {
                return { props: { auth: { user: null, token: null }, results: null } };
            }
        } else {
            return {
                redirect: {
                    destination: '/auth/login',
                    permanent: false,
                },
                props: {},
            };
        }
    } catch (error) {
        console.log(error.toString());
        return { props: { auth: { user: null, token: null }, results: null } };
    }
}