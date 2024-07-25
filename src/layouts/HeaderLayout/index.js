import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Box, Button, alpha, Stack, lighten, Divider, styled, useTheme } from '@mui/material';

import HeaderUserbox from './Userbox';
import HeaderButtons from './Buttons';
import Error from 'src/components/Error'
import Link from 'src/components/Link';
import { searchUsers } from 'utils/user';


const HeaderWrapper = styled(Box)(
	({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        justify-content: space-between;
        width: 100%;
`
);

function HeaderLayout({ name, auth, logout, fixed = false }) {
	const theme = useTheme();
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async (token) => {
			const res = await searchUsers(token);

			if (res.type === "success") {
				setUsers(res.data);
			} else {
				setUsers([]);
				setError(error);
			}
			setIsLoading(false);
		};

		if (auth.token) {
			fetchData(auth.token);
		}

	}, []);


	if (!isLoading && error) {
		return <Error router={router} name={name} image="500" error="Something went wrong!" />
	}

	else {
		return (
			< HeaderWrapper
				display="flex"
				alignItems="center"
				position={(fixed) ? 'fixed' : ''}
				sx={{
					boxShadow:
						theme.palette.mode === 'dark'
							? `0 1px 0 ${alpha(
								lighten(theme.colors.primary.main, 0.7),
								0.15
							)}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
							: `0px 2px 8px -3px ${alpha(
								theme.colors.alpha.black[100],
								0.2
							)}, 0px 5px 22px -4px ${alpha(
								theme.colors.alpha.black[100],
								0.1
							)}`
						}
					}
			>
				<Stack direction="row" divider={<Divider orientation="vertical" flexItem />} alignItems="center" spacing={2}>
					<Box>
						<Link href="/"><Image alt="404" width={45} height={45} src="/icon.png" /></Link>
					</Box>
				</Stack>
				<Box display="flex" alignItems="center">

					{!auth.token && <Button component={Link} href="/auth/login" variant="outlined" sx={{ ml: 2 }}>Sign in</Button>}
					{auth.token &&
						<>
							<HeaderButtons users={users} />
							<HeaderUserbox userData={auth.user} logout={logout} />
						</>
					}
				</Box>
			</HeaderWrapper >
		);
	}
}

export default HeaderLayout;
