import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '12px 8px', // Başlık hücrelerinin padding değeri
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // Son border'ı gizle
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomTableHead = styled(TableHead)({
  '& th': {
    padding: '12px 8px', // Başlık hücrelerinin padding değeri
  },
});

const CustomTable = styled(Table)({
  width: 'fit-content', // Tablo genişliği içeriğe göre ayarlanacak
});

const CustomTableContainer = styled(TableContainer)({
  maxWidth: 'fit-content', // Tablo container'ının içeriğe sığacak şekilde genişliği ayarlandı
});

function PlayerRecord() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchPlayerRecords = async () => {
      try {
        const response = await fetch("https://memorygame-we7d.onrender.com/player/records");
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching player records:", error);
      }
    };

    fetchPlayerRecords();
  }, []);

  // Tarih zaman formatını düzenlemek için fonksiyon
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  return (
    <Container>
      <CustomTableContainer component={Paper}>
        <CustomTable>
          <CustomTableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align='center' >Date</StyledTableCell>
              <StyledTableCell >Elapsed Time</StyledTableCell>
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {records.map((record) => (
              <StyledTableRow key={record._id}>
                <StyledTableCell component="th" scope="row">
                  {record.name}
                </StyledTableCell>
                <StyledTableCell align="right">{formatDate(record.startTime)}</StyledTableCell>
                <StyledTableCell align="right">{record.elapsedTime}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </CustomTable>
      </CustomTableContainer>
    </Container>
  );
}

export default PlayerRecord;
