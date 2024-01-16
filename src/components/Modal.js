import * as React from 'react';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
  color: 'white',
  fontSize: '34px',
  backgroundColor: 'red',
  padding: '8px',
  borderRadius: '20%'
  
};

export default function BasicModal(props) {
  const { modalOpen, closeModal, lastMatchedPairs, cardsState } = props;

  const handleOpen = () => closeModal();

  const matchedPairs = cardsState.filter((element) => element.key === lastMatchedPairs);
  
  const lastMatched = matchedPairs.sort((a, b) => a.id - b.id);
  console.log(lastMatched)
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {matchedPairs.length > 0 && (
            <div>
              <img
                src={require(`../assets/images/${matchedPairs[0].img}`)}
                style={{ width: '500px', height: '500px' }}
                alt={`Card ${lastMatched[0].id}`}
              />
            </div>
          )}

          <div style={closeButtonStyle} onClick={handleOpen}>
            &#x2715;
          </div>
        </Box>
      </Modal>
    </div>
  );
}