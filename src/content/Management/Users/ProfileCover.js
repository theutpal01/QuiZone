import PropTypes from 'prop-types';
import { Hidden, Box, Typography, Card, Tooltip, Avatar, CardMedia, Button, IconButton, ButtonGroup, TextField, Stack, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
// import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { LoadingButton } from '@mui/lab';
import Alert from 'src/components/AlertBox'


import Link from 'src/components/Link'
import UsersList from 'src/components/UsersList';


const AvatarWrapper = styled(Card)(
	({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
		width: ${theme.spacing(16)};
		height: ${theme.spacing(16)};
    }
`
);


const CardCover = styled(Card)(
	({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
		height: ${theme.spacing(26)};
    }
`
);


const ProfileCover = ({ user, classes, spectator, coverImg, maxLength, loading, form, limit, alert, handleEdit, handleChange, handleHideBox, handleSubmit }) => {
	return (
		<>
			<Box display="flex" mt={10} mb={3}>
				<IconButton component={Link} href="/" color="primary" sx={{ p: 2, mr: 2 }}>
					<Tooltip arrow placement="top" title="Go back">
						<ArrowBackTwoToneIcon />
					</Tooltip>
				</IconButton>
				<Box>
					<Typography variant="h3" component="h3" gutterBottom>
						Profile
					</Typography>

					<Typography variant="subtitle2">
						{(!spectator) ? "Check and update your profile." : "Check what's intresting."}
					</Typography>
				</Box>
			</Box>

			<CardCover>
				<CardMedia image={coverImg} />
			</CardCover>

			<AvatarWrapper>
				<Avatar variant="rounded" alt={user.name} src={user.avatar} />
			</AvatarWrapper>

			<Box py={2} pl={2} mb={3} sx={{ whiteSpace: 'pre-line' }}>
				<Typography gutterBottom variant="h4">
					{user.name}
				</Typography>
				<Typography variant="subtitle2">{user.email}</Typography>
				<Typography variant="subtitle2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
				<Typography variant="subtitle2" py={2}>{user.bio}</Typography>
				{!spectator && <Button variant='outlined' onClick={handleEdit}>Edit Profile</Button>}


				{/* FOR THE EDIT PROFILE VIEW */}
				<Box id="edit-profile" sx={{ display: 'none', height: '90vh' }}>
					<Box display="flex" alignItems={"center"} mt={10} mb={3}>
						<IconButton onClick={() => handleHideBox("edit-profile")} color="primary" sx={{ p: 2, mr: 2 }}>
							<Tooltip arrow placement="top" title="Go back">
								<ArrowBackTwoToneIcon />
							</Tooltip>
						</IconButton>
						<Typography variant="h3" component="h3" gutterBottom>
							Edit Profile
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'space-between' } }}>

						<Hidden mdDown>
							<Box sx={{ width: { xs: 'auto', md: '30%' }, display: 'flex', justifyContent: 'center' }}>
								<AvatarWrapper sx={{ m: 0 }}>
									<Avatar variant="rounded" alt={user.name} src={user.avatar} />
								</AvatarWrapper>
							</Box>
						</Hidden>

						<Box maxWidth={'md'} sx={{ width: { xs: '80vw', md: '70%' }, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
							<Card sx={{ p: 4, boxShadow: '1px 1px 5px grey' }} variant="filled">
								<Stack spacing={2}>
									<TextField variant='outlined' label="Name" name="name" value={form.name || ""} onChange={handleChange}></TextField>
									{user.role === "user" && <TextField select onChange={handleChange} name="class" value={form.class || ""} label="Class">
										{classes.map((classNumber => (
											<MenuItem key={classNumber} value={classNumber}>{`Class ${classNumber}`}</MenuItem>
										)))}
									</TextField>}
									<TextField select onChange={handleChange} name="gender" value={form.gender || ""} label="Gender">
										<MenuItem key="male" value={"male"}>Male</MenuItem>
										<MenuItem key="female" value={"female"}>Female</MenuItem>
									</TextField>
									<TextField variant='outlined' multiline rows={3} label="Bio" name="bio" value={form.bio || ""} inputProps={{ maxLength: maxLength }} helperText={`${limit}/${maxLength} letters`} onChange={handleChange}></TextField>
									<LoadingButton loading={loading} loadingIndicator="Please wait…" variant="contained" name="submit" onClick={handleSubmit}>Update Profile</LoadingButton>
									{(alert.type && alert.message) && <Alert alert={alert} />}
								</Stack>
							</Card>
						</Box>
					</Box>
				</Box>
				{/* EDIT PROFILE VIEW ENDS HERE */}

			</Box>
		</>
	);
};

ProfileCover.propTypes = {
	user: PropTypes.object.isRequired
};

export default ProfileCover;
