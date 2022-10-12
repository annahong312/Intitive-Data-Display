import React from "react";
import { UserData } from '../Data'
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
// } from '@mui/material'
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

//   function EnhancedTableHead(props) {
//     const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
//       props;
//     const createSortHandler = (property) => (event) => {
//       onRequestSort(event, property);
//     };

const MuiTable = () => {
    return <TableContainer>
        <Table aria-label='simple table'></Table>
        <TableHead>
            <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>User Gain</TableCell>
                <TableCell>User Loss</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                UserData.map(row => (
                    <TableRow 
                    key={row.id}
                    // sx={{'&:last-child th': {border: 0}}}
                    >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.userGain}</TableCell>
                    <TableCell>{row.userLoss}</TableCell>
                    </TableRow>                    
                ))
            }
        </TableBody>
        <br />
        <br />
        <br />
        <br />
        <br />
    </TableContainer>
    
}

export default MuiTable;