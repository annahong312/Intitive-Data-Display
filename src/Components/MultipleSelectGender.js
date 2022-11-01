import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Male',
  'Female',
  'Non-binary',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectGender() {
  const theme = useTheme();
  const [genderName, setGenderName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setGenderName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onMouseDown=(event) => {
    event.stopPropagation();
   };

  const handleDelete = (value) => {
    //remove the entry from the array using setPersonName
    // setPersonName([...personName, value]);
    // const name = value.target.getAttribute("key");
    console.log(value);
    // console.log(name);
    setGenderName(genderName.filter(item => item !== value));

    
  };

  //create a clear all function for the dropdown
  const clearAll = () => {
    setGenderName([]);
  }

  //create a select all function for the dropdown
  const selectAll = () => {
    setGenderName(names);
  }

  return (
    <div>
      <Grid container
        spacing={0}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item >
              <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Gender</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="select-multiple-chip" 
              multiple
              value={genderName}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Gender" />} //select-multiple-chip
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                    key={value}  
                    label={value}   
                    onMouseDown={onMouseDown}     
                    onDelete={() => handleDelete(value)}
                    // onClick={handleDelete}
                    onClick={handleChange}
                    variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, genderName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item >
          <Grid container>
            <Grid item xs={8}><button className="selectButton" onClick={selectAll}>Select All</button> </Grid>
            <Grid item xs={8}><button className="selectButton" onClick={clearAll}>Clear All</button> </Grid>
          </Grid>
        </Grid>
      </Grid>
     </div>
  );
}
