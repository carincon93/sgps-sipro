import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function TableMui({children, rows, ...props}) {
  return (
    <TableContainer component={Paper} elevation={0} className="drop-shadow-lg">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {rows.map((row, i) => (
                <TableCell key={i} align="left">{row}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
            {children}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
