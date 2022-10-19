import React from "react";
import { UserData } from '../Data';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//       return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1;
//     }
//     return 0;
//   }
  
//   function getComparator(order, orderBy) {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy);
//   }

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