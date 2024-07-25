import { addQuiz, getQuiz, removeQuiz, searchQuizzes, updateQuiz } from '../../utils/quiz';
import { getToken } from '../../utils/auth';
import { getUser } from '../../utils/user';

import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ExcelJS from 'exceljs';

import { Container, Box, CircularProgress, Grid, MenuItem, TextField, Typography, FormControl, Stack, Card, CardContent, FormControlLabel, Switch, Backdrop, SpeedDial } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import UploadTwoTone from '@mui/icons-material/UploadTwoTone';

import Error from '../../src/components/Error';
import HeaderLayout from '../../src/layouts/HeaderLayout';
import Scrollbar from '../../src/components/Scrollbar';
import PageHeader from '../../src/content/Management/Manage/PageHeader';
import PageTitleWrapper from '../../src/components/PageTitleWrapper';
import ManageTemplate from '../../src/content/Management/Manage/ManageTemplate';
import DialogForm from '../../src/components/DialogForm';
import Alert from '../../src/components/AlertBox';


const createData = (_id, userId, name, classNumber, subject, code, createdby, active, timestamp, questions) => {
    return {
        _id, userId, name, classNumber, subject, code, createdby, active, timestamp, questions
    };
}


const getUserName = async (token, _id) => {
    const res = await getUser(token, _id);
    if (res.type === "success") {
        return [res.data.name, res.data.email];
    }
    else {
        return ["Unknown", ""];
    }

}


function QuestionCard({ title, form, setForm, index, questionData }) {
    const [question, setQuestion] = useState(questionData);

    const handleChange = (e) => {
        setQuestion({
            ...question, [e.target.name]: e.target.value
        })


    };

    useEffect(() => {
        const data = form;
        data.questions[index] = { ...data.questions[index], ...question };
        setForm(data);

    }, [question]);

    return (
        <Card sx={{ p: 4 }}>
            <Typography variant='h3' color={"text.secondary"}>{title}</Typography>
            <CardContent>
                <TextField multiline={true} minRows={3} name="question" label={"Question"} value={question.question || ""} fullWidth onChange={handleChange}></TextField>
                <Grid container rowSpacing={2} py={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <TextField label="Option A" name="option1" variant="outlined" value={question.option1 || ""} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Option B" name="option2" variant="outlined" value={question.option2 || ""} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Option C" name="option3" variant="outlined" value={question.option3 || ""} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Option D" name="option4" variant="outlined" value={question.option4 || ""} fullWidth onChange={handleChange} />
                    </Grid>
                </Grid>
                <TextField label="Answer" name="answer" variant="outlined" value={question.answer || ""} fullWidth onChange={handleChange} />

            </CardContent>
        </Card>
    );
}


function Quizzes({ name, auth, classes, subjects, quizzes, alertStatus, router, logout }) {
    const { alert, showAlert } = alertStatus;
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [form, setForm] = useState({});
    const [rows, setRows] = useState([]);
    const bottomRef = useRef(null);

    const [openSD, setOpenSD] = useState(false);
    const handleOpen = () => setOpenSD(!openSD);

    const headCells = [
        {
            id: 'expand',
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
            id: 'class',
            numeric: false,
            disablePadding: false,
            label: 'Class',
        },
        {
            id: 'subject',
            numeric: false,
            disablePadding: false,
            label: 'Subject',
        },
        {
            id: 'code',
            numeric: false,
            disablePadding: false,
            label: 'Code',
        },
        {
            id: 'createby',
            numeric: false,
            disablePadding: false,
            label: 'Created By',
        },
        {
            id: 'active',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
        {
            id: 'actions',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
        },
    ];


    const parseExcel = async (file) => {
        const workbook = new ExcelJS.Workbook();
        const fileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onload = async (e) => {
                const buffer = e.target.result;
                const uint8Array = new Uint8Array(buffer);
                try {
                    await workbook.xlsx.load(uint8Array);
                    const worksheet = workbook.worksheets[0];
                    const rows = worksheet.getSheetValues();

                    if (!rows || rows.length === 0) {
                        reject(new Error('No data found in the worksheet.'));
                        return;
                    }

                    let rowIndex = 1;
                    const processNextRow = async () => {
                        if (rowIndex < rows.length) {
                            const row = rows[rowIndex];

                            if (row[1].trim() && row[2].trim() && row[3].trim() && row[4].trim() && row[5].trim() && row[6].trim()) {
                                addQuestion(row[1].trim(), row[2].trim(), row[3].trim(), row[4].trim(), row[5].trim(), row[6].trim());
                            }
                            rowIndex++;
                            setTimeout(processNextRow, 0); // Introduce a small delay
                        } else {
                            resolve("Updating the question list.");
                        }
                    };

                    processNextRow();
                } catch (error) {
                    reject(error);
                }
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsArrayBuffer(file);
        });
    };

    const onFileUpload = async (file) => {
        if (file) {
            try {
                const message = await parseExcel(file);
                setLoading(false);
                showAlert("success", message);
            } catch (error) {
                showAlert('error', error.toString());
            }
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            setLoading(true);
            await onFileUpload(file);
        } else {
            showAlert("error", "Please select a valid Excel file (.xls or .xlsx)");
        }
        e.target.value = null;
    };

    const uploadQuiz = () => {
        document.getElementById('quiz-upload').click();
    };


    const handleEdit = async (_id) => {
        setLoading(true);
        const res = await getQuiz(auth.token, _id);
        if (res.type === "success") {
            setTitle(`Edit Quiz: ${res.data.name}`)
            setForm({ _id: res.data._id, name: res.data.name, class: res.data.class, subject: res.data.subject, code: res.data.code, active: res.data.active, questions: res.data.questions, userId: res.data.userId });
            setOpen(true);
        } else {
            showAlert("error", "Something went wrong.");
        }
        setLoading(false);
    }

    const handleDelete = async (_id) => {
        const res = await removeQuiz(auth.token, _id);
        showAlert(res.type, res.message)

        if (res.type === "success") {
            setRows(rows => rows.filter(row => row._id !== _id));
        }
    }


    const handleClick = () => {
        setForm({
            name: "",
            questions: []
        })
        setTitle("Add User")
        setOpen(true);
    }


    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name]: (e.target.name === "active") ? e.target.checked : e.target.value
        })
    }


    function addQuestion(question = "", option1 = "", option2 = "", option3 = "", option4 = "", answer = "") {
        setForm((prevForm) => {
            const updatedQuestions = [...prevForm.questions]; // Create a new copy of the questions array

            const questionData = { question, option1, option2, option3, option4, answer };
            updatedQuestions.push(questionData); // Add the new question to the copied array

            return {
                ...prevForm,
                questions: updatedQuestions,
            };
        });

        setTimeout(() => {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }, 500);
    }


    function removeQuestion() {
        const updatedForm = { ...form };
        if (updatedForm.questions.pop() !== undefined) {
            setForm(updatedForm);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isEmpty = form.questions.some(obj => !obj.question || !obj.option1 || !obj.option2 || !obj.option3 || !obj.option4 || !obj.answer);

        if (form && (!form.name || !form.class || !form.subject || isEmpty))
            return showAlert("error", "Please fill all the fields.");

        if (form && form.questions.length === 0) {
            return showAlert("error", "There should be atleast 1 question.");
        }

        
        if (form._id === undefined) {
            const res = await addQuiz(auth.token, form);

            if (res.type === "success") {

                const response = await getQuiz(auth.token, res.data);

                if (response.type === "success") {
                    const allquiz = rows;
                    allquiz.push({ ...response.data, classNumber: form.class, active: (response.data.active) ? "Active" : "Inactive", createdby: await getUserName(auth.token, response.data.userId) });
                    setRows(allquiz);
                    showAlert("success", "Addded the quiz successfully.");
                    setTitle("");
                    setForm({});
                    setOpen(false);
                } else {
                    showAlert(res.type, res.message);
                }
            }
            else {
                showAlert(res.type, res.message);
            }
        }
        else {
            const _id = form._id;
            const userId = form.userId;
            delete form._id;
            delete form.userId;

            const res = await updateQuiz(auth.token, _id, form);

            if (res.type === "success") {
                const updatedItems = [...rows];
                const index = updatedItems.findIndex(item => item._id === _id);

                if (index !== -1) {
                    const updatedItem = { ...updatedItems[index], ...form, classNumber: form.class, active: (form.active) ? "Active" : "Inactive", createdby: await getUserName(auth.token, userId) };
                    updatedItems[index] = updatedItem;
                    setRows(updatedItems);
                    showAlert("success", "Updated the quiz successfully.");
                    setTitle("");
                    setForm({});
                    setOpen(false);
                } else {
                    showAlert("error", "Something went wrong.");
                    setForm({ ...form, _id });
                }
            }
            else {
                showAlert(res.type, res.message);
                setForm({ ...form, _id });
            }
        }
        setLoading(false)
    }


    const actions = [
        { icon: <AddTwoToneIcon />, name: 'Add Question', function: addQuestion },
        { icon: <DeleteOutlineTwoToneIcon />, name: 'Delete Last Question', function: removeQuestion },
        // { icon: <UploadTwoTone />, name: 'Upload Questions', function: uploadQuiz },
    ];

    useEffect(() => {
        if (quizzes) {
            setRows(oldrows => [
                ...oldrows, ...quizzes
            ]);
        }
    }, [])

    if (!auth.user || (auth.user && (auth.user.role !== "admin" && auth.user.role !== "manager"))) {
        return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
    } else {
        return (
            <>
                <Head>
                    <title>Manage Quizzes | {name}</title>
                </Head>
                <HeaderLayout name={name} auth={auth} logout={logout} />
                <Scrollbar>

                    <PageTitleWrapper>
                        <PageHeader
                            name={auth.user.name}
                            heading={"Quizzes"}
                            subtitle={"these are all available quizzes."}
                            btnText={"Create Quiz"}
                            showBtn={(auth.user && auth.user.role === "manager")}
                            handleClick={handleClick} />
                    </PageTitleWrapper>

                    <Container sx={{ pb: 4 }}>
                        {(!rows || (rows && rows.length === 0)) &&
                            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                                <Typography variant="body1">No Quiz found</Typography>
                            </Container>
                        }

                        {rows && rows.length > 0 &&
                            <Container maxWidth="lg">

                                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>

                                    <Grid item xs={12}>
                                        <ManageTemplate subjects={subjects} role={auth.user.role} title={"Manage Quizzes"} headCells={headCells} rows={rows} type={"quizzes"} handleEdit={handleEdit} handleDelete={handleDelete} />
                                    </Grid>

                                </Grid>
                            </Container>
                        }
                    </Container>
                </Scrollbar>

                {loading && <Box sx={{ zIndex: 9999, position: 'absolute', top: 0, left: 0, display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)' }}>
                    <CircularProgress />
                </Box>}

                {/* {auth.user.role === "manager" &&
                    <input type='file' accept='.xls,.xlsx' id='quiz-upload' style={{ display: 'none' }} onChange={handleFileChange} />
                } */}

                {(alert.type && alert.message) && <Alert alert={alert} />}

                <DialogForm open={open} title={title} data={form} changesBtnText={"Save"} handleSave={handleSave} handleClose={() => { setForm({}), setOpen(false) }} >
                    <Grid mt={2} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <FormControl id="loginForm" variant="outlined" fullWidth={true}>
                            <Stack spacing={2}>
                                <TextField label="Name" name="name" variant="outlined" value={form.name || ""} onChange={handleChange} />

                                <TextField sx={{ textAlign: 'left' }} select onChange={handleChange} name="class" value={form.class || ""} label={"Class"}>
                                    <MenuItem key="" value="">None</MenuItem>
                                    {classes.map((classNumber => (
                                        <MenuItem key={classNumber} value={classNumber}>{`Class ${classNumber}`}</MenuItem>
                                    )))}
                                </TextField>

                                <TextField select onChange={handleChange} name="subject" value={form.subject || ""} label="Subject">
                                    {Object.keys(subjects).map(key => (
                                        <MenuItem key={key} value={key}>{subjects[key]}</MenuItem>
                                    ))}

                                </TextField>

                                <FormControlLabel control={<Switch name="active" checked={form.active || false} onChange={handleChange} />} label="Active" />

                                {form.questions &&
                                    form.questions.map((questionData, index) => (
                                        <QuestionCard key={index} title={`Question ${index + 1}`} form={form} setForm={setForm} index={index} questionData={questionData} />
                                    ))
                                }

                                <div ref={bottomRef} />

                            </Stack>
                        </FormControl>
                    </Grid>
                    <Backdrop open={openSD} />
                    <SpeedDial ariaLabel="SpeedDial" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />} onClick={handleOpen} open={openSD}>
                        {actions.map((action) => (
                            <SpeedDialAction sx={{ whiteSpace: 'pre' }}
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                tooltipOpen
                                onClick={() => { handleOpen(); action.function() }}
                            />
                        ))}
                    </SpeedDial>
                </DialogForm>


            </>
        );
    }
}

export default Quizzes;


export async function getServerSideProps(context) {
    try {
        const token = await getToken(context.req);

        if (token !== undefined) {
            const res = await getUser(token);

            if (res.type === "success") {

                const response = await searchQuizzes(token);
                if (response.type === "success") {

                    const quizPromises = response.data.map(async (quiz) => {
                        const userName = await getUserName(token, quiz.userId);
                        return createData(
                            quiz._id,
                            quiz.userId,
                            quiz.name,
                            quiz.class,
                            quiz.subject,
                            quiz.code,
                            userName,
                            (quiz.active) ? "Active" : "Inactive",
                            quiz.timestamp,
                            quiz.questions
                        );
                    });


                    const quizzes = await Promise.all(quizPromises);

                    return {
                        props: {
                            auth: { user: res.data, token }, quizzes: quizzes
                        }
                    };

                } else {
                    return {
                        props: {
                            auth: { user: res.data, token },
                            quizzes: null
                        }
                    };
                }

            } else {
                return { props: { auth: { user: null, token: null }, quizzes: null } };
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
        return { props: { auth: { user: null, token: null }, rows: null } };
    }
}
