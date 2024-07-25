import PropTypes from 'prop-types';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Typography, Button, Grid } from '@mui/material';

import Link from '../Link';

const PageTitle = ({ headingStyle = "h4", heading, subHeading, footer = "", showBtn = true, btnText, docs, block = false, paddingTop = 0, ...rest }) => {
	return (
		<Grid container justifyContent="space-between" alignItems="center" {...rest} >
			<Grid item>
				<Typography variant={headingStyle} component={headingStyle} gutterBottom>
					{heading}
				</Typography>
				<Typography pt={paddingTop} variant="subtitle2">{subHeading}</Typography>
				<Typography variant="subtitle4">{footer}</Typography>
			</Grid>
			<Grid item>
				{showBtn && <Button href={docs} component={Link} rel="noopener noreferrer" sx={{ mt: { xs: 2, md: 0 } }} variant="contained" disabled={block} startIcon={<AddTwoToneIcon fontSize="small" />} >
					{btnText}
				</Button>}
			</Grid>
		</Grid>
	);
};

PageTitle.propTypes = {
	heading: PropTypes.string,
	subHeading: PropTypes.string,
	docs: PropTypes.string
};

export default PageTitle;
