import { Container, Box, Paper, Card, IconButton, Tooltip, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone'
import styles from 'src/content/Management/GradeCard/GradeCard.module.css';

import Link from 'src/components/Link';
import Scrollbar from 'src/components/Scrollbar';


function GradeCard({ name, email, classNumber, quizClass, subject, quiz, answers, score, timestamp }) {

	const getColor = () => {
		const percent = parseInt(score[1]);

		if (percent >= 80) {
			return styles.green;
		} else if (percent >= 60) {
			return styles.blue;
		} else if (percent >= 50) {
			return styles.yellow;
		} else if (percent >= 40) {
			return styles.orange;
		} else {
			return styles.red;
		}
	}

	return (
		<Scrollbar>
			<Container maxWidth="lg">
				<Box display="flex" mt={7} mb={3}>
					<IconButton component={Link} href="/quiz/grades" color="primary" sx={{ p: 2, mr: 2 }}>
						<Tooltip arrow placement="top" title="Go back">
							<ArrowBackTwoToneIcon />
						</Tooltip>
					</IconButton>
					<Box>
						<Typography variant="h3" component="h3" gutterBottom>
							Grade Card
						</Typography>

						<Typography variant="subtitle2">
							See and evaluate your prformance.
						</Typography>
					</Box>
				</Box>
				<Container maxWidth="lg" sx={{ pt: 10 }} >
					<Box sx={{ display: 'flex', flexDirection: { 'xs': 'column', 'md': 'row' }, justifyContent: 'center', alignItems: 'center' }} >

						<Box sx={{ display: 'flex', width: { xs: '100%', md: '45%' } }}>
							<div className={styles.singleChart}>
								<svg viewBox="0 0 36 36" className={`${styles.circularChart} ${getColor()}`}>
									<path className={styles.circleBg} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
									<path className={styles.circle} strokeDasharray={`${score[1]}, 100`} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" />
									<text x="18" y="20.35" className={styles.percentage}>{score[2]}</text>
								</svg>
							</div>
						</Box>

						<Box sx={{ width: { xs: '100%', md: '55%' }, display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
							<Card sx={{ p: 2, mt: 3, boxShadow: '1px 1px 5px grey' }} variant='filled'>
								<Typography variant='h3'>
									{name}
									<Typography variant='h4'>
										Email: {email}<br />
										<Typography variant='body1'>
											Class: {classNumber}
										</Typography>
									</Typography>
								</Typography>
							</Card>

							<Card sx={{ p: 2, mt: 3, boxShadow: '1px 1px 5px grey' }} variant='filled'>
								<Typography variant='h3'>
									{quiz[0]} ({quiz[1]})
									<Typography variant='h4'>
										Subject: {subject}<br />
										Class: {quizClass}<br />
										<Typography variant='body1'>
											Marks: {score[0]}<br />
											Percentage: {score[1]}%
											Published on: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(timestamp))}
										</Typography>
									</Typography>
								</Typography>
							</Card>
						</Box>
					</Box>

					<TableContainer component={Paper} sx={{ my: 5, boxShadow: '2px 2px 8px grey' }}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>ID</TableCell>
									<TableCell>Question</TableCell>
									<TableCell>Your Aanswer</TableCell>
									<TableCell>Correct Answer</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.values(answers).map((question, index) => (
									<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
										<TableCell component="th" scope="row">
											{index + 1}
										</TableCell>

										<TableCell>{question.question}</TableCell>
										<TableCell>{question.answer}</TableCell>
										<TableCell>{question.correctAnswer}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

				</Container>

			</Container>
		</Scrollbar >
	)
}

export default GradeCard