import { getToken } from "../../utils/auth";
import { getQuiz } from "../../utils/quiz";
import { getUser } from "../../utils/user";

import Head from 'next/head';
import { useEffect, useState } from "react";

import { Box, Button, Card, Container, Fab, FormControlLabel, MobileStepper, Radio, RadioGroup, Slide, Typography, useTheme } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import Error from '../../src/components/Error';
import Link from '../../src/components/Link';
import Scrollbar from '../../src/components/Scrollbar';
import DialogBox from "../../src/components/DialogBox";
import Alert from "../../src/components/AlertBox";
import { addResult, searchResults } from "../../utils/result";


function Quiz({ name, subjects, auth, quizData, alertStatus, router, disableRightClick }) {
	disableRightClick();
	const theme = useTheme();
	const { alert, showAlert } = alertStatus;
	const [dialog, setDialog] = useState({ title: "", message: "", open: false })
	const [activeStep, setActiveStep] = useState(0);
	const [answers, setAnswers] = useState({});


	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};


	const handleChange = (e) => {
		setAnswers({
			...answers, [e.target.name]: { question: quizData.questions[activeStep].question, answer: e.target.value, correctAnswer: quizData.questions[activeStep].answer }
		});
	};


	const getGrade = (percentage) => {
		if (percentage >= 90) {
			return "A+";
		} else if (percentage >= 80) {
			return "A";
		} else if (percentage >= 70) {
			return "B+";
		} else if (percentage >= 60) {
			return "B";
		} else if (percentage >= 50) {
			return "C";
		} else if (percentage >= 40) {
			return "D";
		} else {
			return "F";
		}
	}


	const getScore = (maxLength) => {
		let marks = 0;
		let percentage = 0;
		let grade = "";

		for (let index = 0; index < maxLength; index++) {
			if (answers[`question${index}`].correctAnswer === answers[`question${index}`].answer) {
				marks += 1;
			}
		}

		percentage = ((marks / maxLength) * 100).toFixed(2);
		grade = getGrade(parseFloat(percentage));

		return [marks.toString() + "/" + maxLength.toString(), percentage, grade];
	};


	const handleSubmit = async (maxLength) => {
		const form = {
			userId: auth.user._id,
			quizId: quizData._id,
			name: auth.user.name,
			email: auth.user.email,
			class: auth.user.class,
			quiz: [quizData.name, quizData.code],
			subject: quizData.subject,
			answers,
			score: getScore(maxLength)
		}

		const res = await addResult(auth.token, form);

		if (res.type === "success") {
			showAlert("success", "Evaluation completed. Check the results.");
			setAnswers({});
			setTimeout(() => {
				router.push("/");
			}, 2500);

		} else if (res.message === "Forbidden") {
			setDialog({
				...dialog,
				title: "Quiz Info",
				message: `User details: ${form.name} (${form.email}) \nSubject: ${subjects[form.subject]} \nTotal: ${form.score[0]} \nGrade: ${form.score[2]} (${form.score[1]}%)`,
				open: true
			});
		} else {
			setDialog(res.type, res.message);
		}

	};


	const hideDialog = () => {
		router.push("/");
		setDialog({ title: "", message: "", open: false });
		setAnswers({});
	}


	useEffect(() => {
		if (quizData) {
			setAnswers(prevAnswers => {
				let updatedAnswers = { ...prevAnswers };
				for (let index = 0; index < quizData.questions.length; index++) {
					updatedAnswers["question" + index.toString()] = {
						question: quizData.questions[index].question,
						answer: "",
						correctAnswer: quizData.questions[index].answer
					};
				}
				return updatedAnswers;
			});
		}
	}, []);


	if (!auth.token || !quizData) {
		return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
	}
	else {
		const maxLength = quizData.questions.length;

		return (
			<>
				<Head>
					<title>{`Quiz | ${name}`}</title>
				</Head>

				<Scrollbar>
					<Fab component={Link} href="/" sx={{ position: "fixed", top: '20px', left: '20px' }} color="primaryAlt" size="medium" variant="extended" ><HomeOutlinedIcon fontSize="small" mr={2} /> Home</Fab>

					<Container maxWidth={"md"} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>

						<Card sx={{ p: 4, boxShadow: '2px 2px 10px grey', mb: 3, width: '100%' }} variant={'filled'}>
							<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
								<Typography variant="h4">
									Q{activeStep + 1}:&nbsp;
								</Typography>

								<Typography variant="h4" sx={{ whiteSpace: 'pre-line' }}>
									{quizData.questions[activeStep].question}
								</Typography>
							</Box>

							<RadioGroup sx={{ px: 3, pt: 2 }} name={`question${activeStep}`} value={answers[`question${activeStep}`] && answers[`question${activeStep}`].answer || ""} onChange={handleChange} >
								<FormControlLabel value={quizData.questions[activeStep].option1} control={<Radio />} label={quizData.questions[activeStep].option1} />
								<FormControlLabel value={quizData.questions[activeStep].option2} control={<Radio />} label={quizData.questions[activeStep].option2} />
								<FormControlLabel value={quizData.questions[activeStep].option3} control={<Radio />} label={quizData.questions[activeStep].option3} />
								<FormControlLabel value={quizData.questions[activeStep].option4} control={<Radio />} label={quizData.questions[activeStep].option4} />
							</RadioGroup>
						</Card>

						<Box sx={{ width: '100%' }}>
							<MobileStepper variant="progress" steps={quizData.questions.length}
								position="static" activeStep={activeStep} 
								sx={{ width: '100%', flexGrow: 1 }}
								nextButton={
									<Button size="small" onClick={handleNext} disabled={activeStep === maxLength - 1}>
										Next{theme.direction === 'rtl' ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
									</Button>}
								backButton={
									<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
										{theme.direction === 'rtl' ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}Back
									</Button>
								}
							/>
						</Box>
					</Container>

					<Fab sx={{ position: "fixed", bottom: '20px', right: '20px' }} color="primary" size="medium" onClick={() => handleSubmit(maxLength)} ><DoneAllIcon /></Fab>

				</Scrollbar>
				{(alert.type && alert.message) && <Alert alert={alert} />}
				<DialogBox open={dialog.open} hideDialog={hideDialog} title={dialog.title} message={dialog.message} btnText="Okay" />
			</>
		);
	}
}

export default Quiz;


export async function getServerSideProps(context) {
	try {
		const token = await getToken(context.req);
		if (token !== undefined) {

			const { query } = context;
			const res = await getUser(token);
			if (res.type === "success") {

				if (query && Object.keys(query).length === 1 && query._id) {

					const response = await getQuiz(token, query._id);

					if (response.type === "success") {

						const resultRes = await searchResults(token, { userId: res.data._id, quizId: response.data._id })
						if (resultRes.type === "success") {
							return { props: { auth: { user: res.data, token }, quizData: null } };
						}
						return { props: { auth: { user: res.data, token }, quizData: response.data } };

					} else {
						return { props: { auth: { user: res.data, token }, quizData: null } };
					}

				} else {
					return { props: { auth: { user: res.data, token }, quizData: null } };
				}

			} else {
				return { props: { auth: { user: null, token: null }, quizData: null } };
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
		return { props: { auth: { user: null, token: null }, quizData: null } }
	}
}
