import getServerSideProps from '../utils/auth';

import Head from 'next/head';
import { Box, styled } from '@mui/material';

import HeaderLayout from '../src/layouts/HeaderLayout';
import Scrollbar from '../src/components/Scrollbar';
import Hero from '../src/content/Home/Hero';
import Description from '../src/content/Home/Description';
import Contact from '../src/content/Home/Contact';
import Footer from '../src/content/Home/Footer';



const OverviewWrapper = styled(Box)(
	({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
	`
);


function Home({ name, auth, alertStatus, logout }) {

	return (
		<OverviewWrapper>
			<Head>
				<title>{`Home | ${name}`}</title>
			</Head>


			<HeaderLayout fixed={true} name={name} auth={auth} logout={logout} />
			<Scrollbar>
				<Hero heading="Introducing QuiZone:"
					subtitle="Your Ultimate MCQ Quiz Platform for School Organizations!"
					btnText={(!auth.token) ? "Join Us" : "Attempt Quiz"}
					btnLink={(!auth.token) ? "/auth/register" : '/quiz/preview'} />

				<Description heading="What is QuiZone?"
					body="QuiZone is a cutting-edge online platform specifically designed to facilitate MCQ (Multiple Choice Question) quizzes for students of all grades in school organizations. Whether you're a teacher, administrator, or student, QuiZone offers a seamless and engaging experience for conducting interactive quizzes that will captivate learners and foster a spirit of healthy competition."
					endnote="Whether it's for formative assessments, classroom quizzes, or academic competitions, QuiZone revolutionizes the way school organizations conduct MCQ quizzes. With its user-friendly interface, versatile quiz creation options, extensive question bank, real-time monitoring, and engaging learning experience, QuiZone is the go-to platform for educators seeking to enhance student engagement, assess knowledge, and foster a culture of academic excellence."
					cardData={[{
						heading: "User-Friendly Interface",
						body: "QuiZone boasts a user-friendly and intuitive interface, making it easy for teachers and administrators to create, customize, and manage quizzes. With its sleek design and straightforward navigation, both educators and students can easily access the platform and participate in quizzes effortlessly."
					},
					{
						heading: "Versatile Quiz Creation",
						body: "Our platform right now offers only mcq type questions but we are aminig for wide range of question types, including true/false, matching, and more. Teachers can easily create quizzes on various subjects, and customize difficulty levels to suit the specific needs of their students. This flexibility allows for tailored assessments that cater to different grade levels and subjects."
					},
					{
						heading: "Real-Time Monitoring",
						body: "With QuiZone, teachers can monitor student progress and results in real-time. The platform offers insightful analytics, including individual and class-level performance metrics, allowing educators to identify areas of improvement and track student growth."
					},
					{
						heading: "Engaging Learning Experience",
						body: "QuiZone is designed to make learning enjoyable and interactive. Students can compete against their peers, track their own progress, and earn rewards and achievements for their accomplishments. This gamified approach promotes active participation, motivation, and a sense of achievement among learners."
					},
					{
						heading: "Secure and Reliable",
						body: "QuiZone prioritizes data security and privacy. The platform adheres to strict security protocols to safeguard student information and ensure a safe online environment for all users."
					}
					]}
				/>

				<Contact alertStatus={alertStatus} />

				<Footer show={!auth.token} />
			</Scrollbar>

		</OverviewWrapper >

	);
}
export default Home;


export { getServerSideProps }
