import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type AlertDialogueProps = {
    props: any
}

export default function AlertDialog({ props }:AlertDialogueProps) {
  const router = useRouter()
  const {text, result, path, handler} = props
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if(result) {
      path && router.push(path)
      setOpen(false)
      return
    }
    if(handler) {
      // debugger
      handler()
    }
    setOpen(false)
  };

  React.useEffect(() => {
    if (text) {
      handleClickOpen()
    } else {
      handleClose()
    }
  }, [props])



  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Operation notification"
        aria-describedby="Notification"

      >
        
        <DialogContent
        className='w-[300px]'>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{result ? "Continue" : "Try Again"}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
