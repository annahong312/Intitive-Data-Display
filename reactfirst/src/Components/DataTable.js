import React from "react";
import { UserData } from '../Data'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material'

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
    </TableContainer>
    
}

export default MuiTable;