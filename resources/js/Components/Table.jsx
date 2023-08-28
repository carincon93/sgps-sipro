import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export default function TableMui({ children, rows, sxCellThead = {}, className = '', ...props }) {
    const filtered_data =
        children.filter((item) => typeof item === 'object' && item !== null && item.hasOwnProperty('$$typeof') && item.$$typeof === Symbol.for('react.element')).length > 0
            ? children.filter((item) => typeof item === 'object' && item !== null && item.hasOwnProperty('$$typeof') && item.$$typeof === Symbol.for('react.element'))
            : children.filter((item) => Array.isArray(item) && item.length > 0 && item.some((obj) => typeof obj === 'object'))

    return (
        <TableContainer component={Paper} elevation={0} className={`drop-shadow-lg ` + className} {...props}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {rows.map((row, i) => (
                            <TableCell key={i} sx={row == 'Acciones' ? { width: '50px' } : sxCellThead} align="left">
                                {row}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered_data.length > 0 ? (
                        <>{children}</>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={rows.length}>Sin información registrada</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
