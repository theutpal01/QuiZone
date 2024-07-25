import { Box } from '@mui/material';
import HeaderSearch from './Search';
// import HeaderNotifications from './Notifications';

function HeaderButtons({ users }) {
	return (
		<Box sx={{ mr: 1 }}>
			<HeaderSearch users={users} placeholder={"Search an account with name..."}/>
			{/* <Box sx={{ mx: 0.5 }} component="span">
        		<HeaderNotifications />
      		</Box> */}
		</Box>
	);
}

export default HeaderButtons;
