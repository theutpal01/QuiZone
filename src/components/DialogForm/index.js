import { forwardRef } from 'react';
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Scrollbar from '../Scrollbar';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogForm({ children, open, title, changesBtnText, handleSave, handleClose }) {

    return (
        <Dialog sx={{overflowX: 'hidden'}} fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{ px: { xs: '18px !important', sm: '27px !important' }, minHeight: { xs: '48px !important', sm: '64px !important' } }}>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {title}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        {changesBtnText}
                    </Button>
                </Toolbar>
            </AppBar>
            <Scrollbar>
                <Container maxWidth="md" sx={{ p: 4 }}>{children}</Container>
            </Scrollbar>
        </Dialog>
    );
}