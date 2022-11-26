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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// Todo: need to find the max length of each filter
var selectedAll = false;
var usedNameVals = new Map();


function nameValUpdate(curNameVals, label, allNames) {
    if (curNameVals.length < 1) {
      usedNameVals.delete(label);
    } else {
      usedNameVals = usedNameVals.set(label, curNameVals);
    }
    // console.log(usedNameVals + " is usedNameVals for " + label);

    if (curNameVals.length === allNames.length) {
      selectedAll = true;
    }
    else{
      selectedAll = false;
    }
}

export const getUpdatedNameVals = () => {
    return usedNameVals;
}


export default function MultipleSelect(givenNames) {
    // console.log(givenNames);
  var names = givenNames.givenNames;
  var label = givenNames.label;
//   console.log(names + " names");
  // console.log(label + " label");
  const theme = useTheme();
  // const [nameVals, setNameVals] = React.useState([]);
  const [nameVals, setNameVals] = React.useState(names);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setNameVals(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    
    nameValUpdate(value, label, names);
  };

  const onMouseDown=(event) => {
    event.stopPropagation();
   };

  const handleDelete = (value) => {
    //remove the entry from the array using setPersonName
    // setPersonName([...personName, value]);
    // console.log(value);
    setNameVals(nameVals.filter(item => item !== value));
    var newNameVals = nameVals.filter(item => item !== value);
    nameValUpdate(newNameVals, label, names);

  };

  //create a clear all function for the dropdown
  const clearAll = () => {
    setNameVals([]);
    nameValUpdate([], label, names);
  }

  //create a select all function for the dropdown
  const selectAll = () => {
    setNameVals(names);
    nameValUpdate(names, label, names);
  }

  return (
    <div>
      <Grid container
        spacing={0}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item >
              <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="select-multiple-chip" 
              multiple
              value={nameVals}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label={label}/>} //select-multiple-chip
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.25 }}>
                  {
                    selected.map((value) => (
                      <Chip 
                      key={value}  
                      label={value}   
                      onMouseDown={onMouseDown}     
                      onDelete={() => handleDelete(value)}
                      // onClick={handleDelete}
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
                  style={getStyles(name, nameVals, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item >
          <Grid container>
            <Grid item xs={7}><button className="selectButton" onClick={selectAll}>Select All</button> </Grid>
            <Grid item xs={7}><button className="selectButton" onClick={clearAll}>Clear All</button> </Grid>
          </Grid>
        </Grid>
      </Grid>
     </div>
  );
}
