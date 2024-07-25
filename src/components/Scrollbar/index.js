import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { Box, useTheme } from '@mui/material';

const Scrollbar = ({ className, children, ...rest }) => {
  const theme = useTheme();

  return (
    <Scrollbars autoHide universal 
    renderThumbVertical={() => {
        return (
          <Box
            sx={{
              width: 5,
              background: `${theme.palette.primary.light}`,
              borderRadius: `${theme.general.borderRadiusLg}`,
              transition: `${theme.transitions.create(['background'])}`,

              '&:hover': {
                background: `${theme.palette.primary.main}`
              }
            }}
          />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Scrollbar;
