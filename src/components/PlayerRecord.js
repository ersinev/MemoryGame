import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { MdDeleteForever } from "react-icons/md";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


  //"http://localhost:5000"
  //"https://memorygame-we7d.onrender.com"
const url = "https://memorygame-we7d.onrender.com";

// Stil özelliklerini tanımla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "green",
    color: "whitesmoke",
    padding: '12px 8px',
    fontSize: 18,
    fontWeight: "bolder"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "whitesmoke",
    fontWeight: "bolder"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomTableHead = styled(TableHead)({
  position: 'sticky',
  top: 0,
  '& th': {
    padding: '12px 8px',
  },
});

const CustomTable = styled(Table)({
  width: 'fit-content',
});

const CustomTableContainer = styled(TableContainer)({
  maxHeight: 'calc(90vh)', // Adjust the height as needed
  overflowY: 'auto',
  maxWidth: 'fit-content'
});

function PlayerRecord() {
  const [records, setRecords] = useState([]);
  const [totalElapsedTime, setTotalElapsedTime] = useState('');
  const [averageTime, setAverageTime] = useState('');

  // Fonksiyonlar
  const fetchPlayerRecords = async () => {
    try {
      const response = await fetch(`${url}/player/records`);
      const data = await response.json();
      setRecords(data);

      // Toplam oynama süresini hesapla
      const totalSeconds = calculateTotalElapsedTime(data);
      const formattedTotalTime = formatTotalTime(totalSeconds);
      setTotalElapsedTime(formattedTotalTime);

      // Ortalama oynama süresini hesapla
      const average = calculateAverageTime(totalSeconds, data.length);
      const formattedAverageTime = formatTotalTime(average);
      setAverageTime(formattedAverageTime);
    } catch (error) {
      console.error("Error fetching player records:", error);
    }
  };
  useEffect(() => {
    fetchPlayerRecords();
    // eslint-disable-next-line
  }, []);

  const totalPlayers = records.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${url}/player/${id}`, {
        method: 'DELETE'
      });
      fetchPlayerRecords();
    } catch (error) {
      console.error("Error deleting player record:", error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all records?");

    if (confirmed) {
      const passwordPrompt = prompt("Enter the password to confirm:");

      if (passwordPrompt === '159987') {
        try {
          await fetch(`${url}/player/delete-all`, {
            method: 'DELETE'
          });
          fetchPlayerRecords();
        } catch (error) {
          console.error("Error deleting all player records:", error);
        }
      } else {
        alert("Incorrect password. Deletion canceled.");
      }
    }
  };

  function calculateTotalElapsedTime(records) {
    let totalMilliseconds = 0;

    records.forEach(record => {
      const exitTime = new Date(record.exitTime);
      const startTime = new Date(record.startTime);
      const elapsedTimeInMillis = exitTime - startTime;
      totalMilliseconds += elapsedTimeInMillis;
    });

    const totalSeconds = Math.floor(totalMilliseconds / 1000);

    return totalSeconds;
  }

  function formatTotalTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    
    const seconds = Math.floor(remainingSeconds % 60)

    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `;
    }
    formattedTime += `${seconds}s`;

    return formattedTime;
  }

  function calculateAverageTime(totalSeconds, totalPlayers) {
    if (totalPlayers === 0) return 0;
    return totalSeconds / totalPlayers;
  }

  return (
    <Container>
      <Row>
        <Col className='mt-3'>
          <CustomTableContainer component={Paper}>
            <CustomTable>
              <CustomTableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align='center'>Date</StyledTableCell>
                  <StyledTableCell align='center'>Time</StyledTableCell>
                  <StyledTableCell align='center'>Action</StyledTableCell>
                </TableRow>
              </CustomTableHead>
              <TableBody>
                {records.slice().reverse().map((record) => (
                  <StyledTableRow key={record._id}>
                    <StyledTableCell component="th" scope="row">
                      {record.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{formatDate(record.startTime)}</StyledTableCell>
                    <StyledTableCell align="right">{record.elapsedTime}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Button variant="danger" onClick={() => handleDelete(record._id)}><MdDeleteForever /></Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </CustomTable>
          </CustomTableContainer>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "white", fontSize: "24px", border: "5px solid green", padding: "10px", borderRadius: "10px", backgroundColor: "rgba(0, 128, 0, 0.5)" }}>All-Time Players: {totalPlayers}</p>
            <p style={{ color: "white", fontSize: "24px", border: "5px solid green", backgroundColor: "rgba(0, 128, 0, 0.5)", padding: "10px", borderRadius: "10px", whiteSpace: 'nowrap' }}>Total Elapsed Time: {totalElapsedTime}</p>
            <p style={{ color: "white", fontSize: "24px", border: "5px solid green", backgroundColor: "rgba(0, 128, 0, 0.5)", padding: "10px", borderRadius: "10px", whiteSpace: 'nowrap' }}>Average Elapsed Time: {averageTime}</p>
            <Button variant="danger" onClick={handleDeleteAll} style={{ padding: "5px" }}>Delete All</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PlayerRecord;
