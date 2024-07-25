import Head from "next/head";
import { Card, Container, Grid, Stack, Typography } from "@mui/material";

import { getToken } from "../../utils/auth";
import { getUser } from "../../utils/user";
import { searchResults } from "../../utils/result";

import Error from '../../src/components/Error';
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import PageTitle from '../../src/components/PageTitle';
import HeaderLayout from "../../src/layouts/HeaderLayout";
import Scrollbar from "../../src/components/Scrollbar";
import GradeCard from "../../src/content/Management/GradeCard";


function Grades({ name, subjects, auth, results, router, logout }) {
	const query = router.query;

	if (Object.keys(query).length === 0) {
		return (
			<>
				<Head>
					<title>{`Grade Cards | ${name}`}</title>
				</Head>

				<HeaderLayout fixed={false} name={name} auth={auth} logout={logout} />
				<Scrollbar>

					<PageTitleWrapper>
						<PageTitle headingStyle="h3" heading="Performance" subHeading={`Total cards available: ${(results) ? results.length : 0}`} showBtn={false} />
					</PageTitleWrapper>


					<Container maxWidth="md">
						{(!results) ?
							<Typography variant="body2" sx={{ textAlign: 'center' }}>
								No grade cards found.
							</Typography> :

							<Stack spacing={2} my={2}>
								{results.map(result => (
									<Card key={result._id} sx={{ p: 3, boxShadow: '2px 2px 6px grey' }} variant="filled" elevation={6}>
										<PageTitle
											heading={`${result.quiz[0]}(${result.quiz[1]})`}
											subHeading={`Subject: ${subjects[result.subject]}`}
											// footer={`Status: ${(quiz.attempted) ? "Completed" : "Pending"}`}
											btnText={"View Details"}
											docs={`/quiz/grades?_id=${result._id}`}
											paddingTop={1} />
									</Card>
								))}

							</Stack>
						}

					</Container>
				</Scrollbar>
			</>
		)
	} else if (query && Object.keys(query).length === 1 && query._id && results.some(result => result._id === query._id)) {
		const index = results.findIndex(result => result._id === query._id);
		return (
			<GradeCard 
			name={results[index].name}
			email={results[index].email}
			classNumber={auth.user.class}
			quizClass={results[index].class}
			subject={subjects[results[index].subject]}
			quiz={results[index].quiz}
			answers={results[index].answers}
			score={results[index].score}
			timestamp={results[index].timestamp} />
		);
	} else {
		return <Error router={router} name={name} image="404" error="The page you were looking for doesn't exist." />
	}
}

export default Grades;


export async function getServerSideProps(context) {
	try {
		const token = await getToken(context.req);
		if (token !== undefined) {

			const res = await getUser(token);
			if (res.type === "success") {

				const response = await searchResults(token, { userId: res.data._id });

				if (response.type === "success") {
					return { props: { auth: { user: res.data, token }, results: response.data } };
				} else {
					return { props: { auth: { user: res.data, token }, results: null } };
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
		return {
		props: { auth: { user: null, token: null }, results: null }
		}
	}
}