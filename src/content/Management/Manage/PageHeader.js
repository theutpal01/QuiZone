import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader({ name, heading, subtitle, btnText, showBtn, handleClick }) {
	return (
		<Grid container justifyContent="space-between" alignItems="center">
			<Grid item>
				<Typography variant="h3" component="h3" gutterBottom>
					{heading}
				</Typography>
				<Typography variant="subtitle2">
					{name}, {subtitle}
				</Typography>
			</Grid>
			<Grid item>
				{showBtn &&
					<Button sx={{ mt: { xs: 2, md: 0 } }} variant="contained" startIcon={<AddTwoToneIcon fontSize="small" />} onClick={handleClick} >
						{btnText}
					</Button>
				}
			</Grid>
		</Grid>
	);
}

export default PageHeader;
