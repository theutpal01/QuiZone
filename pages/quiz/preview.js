import Head from "next/head";
import { getToken } from "../../utils/auth";
import { getUser } from "../../utils/user";

import { Card, Container, Stack, Typography } from "@mui/material";

import Error from '../../src/components/Error';
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import PageTitle from '../../src/components/PageTitle';
import HeaderLayout from "../../src/layouts/HeaderLayout";
import Scrollbar from "../../src/components/Scrollbar";
import { searchQuizzes } from "../../utils/quiz";
import { searchResults } from "../../utils/result";


function Preview({ name, subjects, auth, quizzes, router, logout }) {
	if (!auth.token) {
		return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
	}
	else {
		return (
			<>
				<Head>
					<title>{`Preview | ${name}`}</title>
				</Head>

				<HeaderLayout fixed={false} name={name} auth={auth} logout={logout} />
				<Scrollbar>

					<PageTitleWrapper>
						<PageTitle headingStyle="h3" heading="Quizzes" subHeading={`Total quiz available: ${(quizzes) ? quizzes.length : 0}`} showBtn={false} />
					</PageTitleWrapper>


					<Container maxWidth="md">
						{(!quizzes) ?
							<Typography variant="body2" sx={{ textAlign: 'center' }}>
								No quiz found.
							</Typography> :

							<Stack spacing={2} my={2}>
								{quizzes.map(quiz => (
									<Card key={quiz._id} sx={{ p: 3, boxShadow: '2px 2px 6px grey' }} variant="filled" elevation={6}>
										<PageTitle
											heading={quiz.name}
											subHeading={`Subject: ${subjects[quiz.subject]}`}
											footer={`${(auth.user.role === "user" ) ? `Status: ${(quiz.attempted) ? "Completed" : "Pending"}` : `Class: ${quiz.class}` }`}
											btnText={"Attempt"}
											docs={`/quiz?_id=${quiz._id}`}
											paddingTop={1}
											block={quiz.attempted} />
									</Card>
								))}

							</Stack>
						}

					</Container>
				</Scrollbar>
			</>
		);
	}
}

export default Preview;


export async function getServerSideProps(context) {
	try {
		const token = await getToken(context.req);
		if (token !== undefined) {

			const res = await getUser(token);
			if (res.type === "success") {
				const response = await searchQuizzes(token, (res.data.class !== "Null") ? { class: res.data.class, active: true } : null);

				if (response.type === "success") {

					const quizPromises = response.data.map(async (quiz, index) => {
						const resultRes = await searchResults(token, { userId: res.data._id, quizId: quiz._id });

						if (resultRes.type === "success") {
							response.data[index] = { ...response.data[index], attempted: true }
						} else {
							response.data[index] = { ...response.data[index], attempted: false }
						}
					});
					await Promise.all(quizPromises);

					return { props: { auth: { user: res.data, token }, quizzes: response.data } };
				} else {
					return { props: { auth: { user: res.data, token }, quizzes: null } };
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
		return {
			props: { auth: { user: null, token: null }, quizzes: null }
		}
	}
}