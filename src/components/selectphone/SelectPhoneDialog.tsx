import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import React from "react";
import { Phone } from "../../ts/types";

export function SelectPhoneDialog(props: {
  phones: Phone[];
  onSelectActive: (phone: Phone, active: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function onSelect(event: React.ChangeEvent<HTMLInputElement>, phone: Phone) {
    props.onSelectActive(phone, event.target.checked);
  }

  function onSelectAll() {
      for (let p of props.phones) {
        props.onSelectActive(p, true);
      }
  }

  function onSelectNone() {
    for (let p of props.phones) {
      props.onSelectActive(p, false);
    }
}

  return (
    <div style={{}}>
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
          fontSize: "11px",
          margin: "4px",
          padding: "4px",
        }}
        variant="contained"
        disableElevation
        onClick={handleClickOpen}
      >
        Selecteer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">
          Selecteer smartphones om mee te werken
        </DialogTitle>
        <DialogContent>
        <FormGroup>
          {props.phones.map((p) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    key={p.name}
                    color="primary"
                    checked={p.inActiveUse}
                    onChange={(event) => onSelect(event, p)}
                  ></Checkbox>
                }
                label={p.brand + " " + p.name}
              />
            );
          })}
        </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSelectAll} color="primary" variant="outlined">
            Selecteer alle
          </Button>
          <Button onClick={onSelectNone} color="primary" variant="outlined">
            Selecteer geen
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Bevestig
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function Checkboxes() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <Checkbox checked={checked} onChange={handleChange} />
    </div>
  );
}
