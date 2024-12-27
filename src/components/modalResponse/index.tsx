import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Slide } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, red } from "@mui/material/colors";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isError?: boolean;  // Nova propriedade para indicar erro
}

const Transition = React.forwardRef(function Transition(props: any, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ResponseModal: React.FC<ModalProps> = ({ open, onClose, title, message, isError = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 10,
          padding: 2,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        {isError ? (
          <CancelIcon sx={{ color: red[500], marginRight: 1 }} />
        ) : (
          <CheckCircleIcon sx={{ color: green[500], marginRight: 1 }} />
        )}
        {title}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body1" sx={{ fontSize: 16 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseModal;
