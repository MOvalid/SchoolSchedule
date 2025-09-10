import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    SxProps,
    Theme,
} from '@mui/material';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
    width?: number;
    align?: 'left' | 'right' | 'center';
}

interface BaseTableProps<T> {
    columns: Column<T>[];
    data: T[];
    noDataMessage?: string;
}

const styles: Record<string, SxProps<Theme>> = {
    columnName: {
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    tableCell: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    tableRow: {
        '&:last-child td': {},
    },
};

export const BaseTable = <T extends { id?: number }>({
    columns,
    data,
    noDataMessage,
}: BaseTableProps<T>) => {
    const renderContent = (col: Column<T>, row: T) => {
        if (col.render) {
            return col.render(row);
        } else if (col.key in row) {
            return row[col.key as keyof T] as React.ReactNode;
        } else {
            return null;
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={String(col.key)}
                                align={col.align ?? 'left'}
                                sx={styles.columnName}
                                width={col.width}
                            >
                                {data.length > 0 ? col.label : ''}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <TableRow key={row.id ?? rowIndex} sx={styles.tableRow}>
                                {columns.map((col) => (
                                    <TableCell
                                        key={String(col.key)}
                                        align={col.align ?? 'left'}
                                        width={col.width}
                                        sx={styles.tableCell}
                                    >
                                        {renderContent(col, row)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                                {noDataMessage ?? 'Brak danych'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
