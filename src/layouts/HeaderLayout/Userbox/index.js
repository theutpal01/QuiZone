import { useRef, useState } from 'react';

import { Avatar, Box, Button, Divider, Hidden, lighten, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import PsychologyTwoToneIcon from '@mui/icons-material/PsychologyTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';

import Link from 'src/components/Link';


const UserBoxButton = styled(Button)(
	({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
	({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
	({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
	({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
	({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox({ userData, logout }) {
	const user = {
		name: userData.name,
		avatar: userData.avatar,
		jobtitle: userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
	};

	const options = {
		"admin": [
			{title: "Manage Users", href: "/manage/users", icon: <ManageAccountsTwoToneIcon />},
			{title: "Manage Quizzes", href: "/manage/quizzes", icon: <PsychologyTwoToneIcon />},
			{title: "Grade Cards", href: "/manage/grades", icon: <AssessmentTwoToneIcon />}
		],
		"manager": [
			{title: "Manage Quizzes", href: "/manage/quizzes", icon: <PsychologyTwoToneIcon />},
			{title: "Grade Cards", href: "/manage/grades", icon: <AssessmentTwoToneIcon />}
		],
		"user": [
			{title: "Attempt Quiz", href: "/quiz/preview", icon: <PsychologyTwoToneIcon />},
			{title: "See Performance", href: "/quiz/grades", icon: <AssessmentTwoToneIcon />}
		]
	}

	const ref = useRef(null);
	const [isOpen, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};


	return (
		<>
			<UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
				<Avatar variant="rounded" alt={userData.name} src={user.avatar}/>
				<Hidden mdDown>
					<UserBoxText>
						<UserBoxLabel variant="body1">{userData.name}</UserBoxLabel>
						<UserBoxDescription variant="body2">
							{user.jobtitle}
						</UserBoxDescription>
					</UserBoxText>
				</Hidden>
				<Hidden smDown>
					<ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
				</Hidden>
			</UserBoxButton>
			<Popover
				anchorEl={ref.current}
				onClose={handleClose}
				open={isOpen}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				<MenuUserBox sx={{ minWidth: 210 }} display="flex">
					<Avatar variant="rounded" alt={userData.name} src={user.avatar}/>
					<UserBoxText>
						<UserBoxLabel variant="body1">{userData.name}</UserBoxLabel>
						<UserBoxDescription variant="body2">
							{user.jobtitle}
						</UserBoxDescription>
					</UserBoxText>
				</MenuUserBox>
				<Divider sx={{ mb: 0 }} />
				<List sx={{ p: 1 }} component="nav">
					<Link href={`/profile?_id=${userData._id}`} passHref>
						<ListItem button>
							<AccountBoxTwoToneIcon fontSize="small" />
							<ListItemText primary="My Profile" />
						</ListItem>
					</Link>
					{options[userData.role].map((item, index) => (

						<Link key={index} href={item.href} passHref>
							<ListItem button>
								{item.icon}
								<ListItemText primary={item.title} />
							</ListItem>
						</Link>

					))}
				</List>
				<Divider />
				<Box sx={{ m: 1 }}>
					<Button color="primary" fullWidth={true} onClick={logout}>
						<LockOpenTwoToneIcon sx={{ mr: 1 }} />
						Sign out
					</Button>
				</Box>
			</Popover>
		</>
	);
}

export default HeaderUserbox;
