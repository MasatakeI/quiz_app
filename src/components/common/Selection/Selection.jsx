import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Selection({ label, value, onChange, array, disabled }) {
  const labelId = `${label}-select-label`;
  const selectId = `${label}-select`;
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={value}
          label={label}
          onChange={onChange}
          disabled={disabled}
        >
          {array.map((arr) => {
            return (
              <MenuItem key={arr.id} value={arr.value}>
                {arr.title}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
