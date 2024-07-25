import { Avatar, Box, Divider, lighten, List, ListItemButton, ListItemAvatar, Typography, Hidden } from '@mui/material';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';

import Link from 'src/components/Link';


const UsersList = ({ data, click }) => {
    return (
        <>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>

                {data.map((item, index) => (
                    <Box key={index}>
                        <ListItemButton key={index} component={Link} onClick={click} href={`/profile?_id=${item._id}`}>
                            <ListItemAvatar>
                                <Avatar variant="rounded" alt={item.name} src={item.avatar} />
                            </ListItemAvatar>
                            <Box flex="1">
                                <Box display="flex" justifyContent="space-between">
                                    {item.name}
                                </Box>
                                <Typography component="span" variant="body2" sx={{ color: (theme) => lighten(theme.palette.secondary.main, 0.5) }}>
                                    {item.email}
                                </Typography>
                            </Box>
                            <Hidden smDown>
                                <ChevronRightTwoToneIcon />
                            </Hidden>
                        </ListItemButton>
                        <Divider sx={{ my: 1 }} component="li" />
                    </Box>
                ))}
            </List>
            {data.length === 0 &&
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ py: 1 }}>No user found</Typography>
                </Box>
            }
        </>
    )
}

export default UsersList;