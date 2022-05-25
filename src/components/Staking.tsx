import * as React from 'react';
import { Avatar, Badge, Box, Collapse, IconButton, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Token } from "./Main"

function createData(
    address: string | undefined,
    name: string,
    type: number,
    icon: string[],
) {
    return {
        address,
        name,
        type,
        icon,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 22,
        height: 22,
        border: `2px solid ${theme.palette.background.paper}`,
    }));

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, verticalAlign: 'top' }} onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {row.type === 0 ? (<Avatar alt={row.name + " Icon"} src={row.icon[0]} />) : (
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <SmallAvatar alt={row.name + " Icon"} src={row.icon[1]} />
                                }
                            >
                                <Avatar alt={row.name + " Icon"} src={row.icon[0]} />
                            </Badge>
                        )}
                        <Box>
                            <Typography variant="h6">Stake {row.name}</Typography>
                            <Typography variant="caption">Choose Reward Token</Typography>
                        </Box>
                    </Stack>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="subtitle2">Total Staked</Typography>
                    <Typography>0.0</Typography>
                    <Typography variant="body2">0 USD</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="subtitle2">Your Stake</Typography>
                    <Typography>0.0</Typography>
                    <Typography variant="body2">0 USD</Typography>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="subtitle2">APR</Typography>
                    <Typography>0%</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell align="right">
                                                {/* {Math.round(historyRow.amount * row.price * 100) / 100} */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


interface StakingProps {
    tokens: Array<Token> | undefined
}

export const StakingTable = ({ tokens }: StakingProps) => {
    var rows: any[] = []
    tokens?.forEach((token) => {
        if (token !== undefined)
            rows.push(createData(token.address, token.name, token.type, token.icon))

    })

    return (
        <Box mx={{ 'md': '7.5%' }}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    {/* <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead> */}
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
