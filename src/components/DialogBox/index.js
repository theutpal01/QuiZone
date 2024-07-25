import { Slide, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DialogBox({ open, hideDialog, title, message, btnText = "Close", code, ask = false, handleSubmit }) {

    return (
        <Dialog fullWidth={true} maxWidth={'sm'} open={open} TransitionComponent={Transition} onClose={hideDialog}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" sx={{whiteSpace: 'pre-line'}}>{message}</DialogContentText>
                {ask && <TextField autoFocus margin="dense" id="code" value={code.code} onChange={(e) => code.setCode(e.target.value.toLocaleUpperCase())} label="Enter Quiz Code" fullWidth variant="standard" />}
            </DialogContent>
            <DialogActions>
                <Button onClick={hideDialog}>{btnText}</Button>
                {ask && <Button onClick={handleSubmit}>Submit</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default DialogBox;