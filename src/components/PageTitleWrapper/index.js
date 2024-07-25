import PropTypes from 'prop-types';
import { Box, Container, styled } from '@mui/material';

const PageTitle = styled(Box)(
	({ theme }) => `
        padding: ${theme.spacing(4)};
        margin-bottom: 36px;
        box-shadow: 0px 2px 4px -3px rgb(34 51 84 / 10%), 0px 5px 12px -4px rgb(34 51 84 / 5%);
        background: rgba(255, 255, 255, 0.5);
`
);

const PageTitleWrapper = ({ children }) => {
	return (
		<PageTitle className="MuiPageTitle-wrapper">
			<Container maxWidth="lg">{children}</Container>
		</PageTitle>
	);
};

PageTitleWrapper.propTypes = {
	children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
