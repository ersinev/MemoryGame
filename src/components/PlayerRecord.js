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
import { Container, Button } from 'react-bootstrap';
import { MdDeleteForever } from "react-icons/md";
//"http://localhost:5000"
  //"https://memorygame-we7d.onrender.com"
  const url = "https://memorygame-we7d.onrender.com"


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
  top:0,
  '& th': {
    padding: '12px 8px',
  },
});

const CustomTable = styled(Table)({
  width: 'fit-content',
});

const CustomTableContainer = styled(TableContainer)({
  maxWidth: 'fit-content'
});

function PlayerRecord() {
  const [records, setRecords] = useState([]);

  // Function to fetch player records
  const fetchPlayerRecords = async () => {
    try {
      const response = await fetch(`${url}/player/records`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching player records:", error);
    }
  };

  useEffect(() => {
    fetchPlayerRecords();
  }, []);

  const totalPlayers = records.length;
  console.log(records)
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  // Function to handle deletion of a player record
  const handleDelete = async (id) => {
    try {
      await fetch(`${url}/player/${id}`, {
        method: 'DELETE'
      });
      // After successful deletion, fetch updated records
      fetchPlayerRecords();
    } catch (error) {
      console.error("Error deleting player record:", error);
    }
  };

  // Function to handle deletion of all player records
  const handleDeleteAll = async () => {
    try {
      await fetch(`${url}/player/delete-all`, {
        method: 'DELETE'
      });
      // After successful deletion, fetch updated records
      fetchPlayerRecords();
    } catch (error) {
      console.error("Error deleting all player records:", error);
    }
  };

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px" }}>
        <p style={{ color: "white", marginBottom: "5px",fontSize:"18px"}}>All-Time Players: {totalPlayers}</p>
      </div>
      <Button variant="danger" onClick={handleDeleteAll} style={{ marginBottom: '10px', padding: "5px" }}>Delete All</Button> {/* Button to delete all records */}
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
                  <Button variant="danger" onClick={() => handleDelete(record._id)}><MdDeleteForever/></Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </CustomTable>
      </CustomTableContainer>
    </Container>
  );
}

export default PlayerRecord;
