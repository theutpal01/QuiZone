import React from 'react'
import { Slide, Alert, Snackbar } from '@mui/material'


function TransitionRight(props) {
    return <Slide {...props} direction="left" />;
}


const AlertBox = ({ alert }) => {
    return (
        <Snackbar open={alert.open} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} TransitionComponent={TransitionRight} transitionDuration={500}>
            <Alert elevation={6} variant="filled" severity={alert.type} sx={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
    )
}

export default AlertBox