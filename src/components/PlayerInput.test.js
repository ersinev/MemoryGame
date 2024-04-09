import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Updated import statement
import PlayerInput from "./PlayerInput";

describe('Game component for testing', () => {

    test('should render player input page', () => {
        render(<PlayerInput />);

    });

    test('allows user to input name and room ID', () => {
        render(<PlayerInput />);
        const nameInput = screen.getByLabelText(/Naam/i);
        const roomIdInput = screen.getByLabelText(/Room ID/i);

        fireEvent.change(nameInput, { target: { value: 'John' } });
        fireEvent.change(roomIdInput, { target: { value: 'room123' } });

        expect(nameInput.value).toBe('John');
        expect(roomIdInput.value).toBe('room123');
    });

    test('calls onJoinGame prop when Start Game button is clicked with valid inputs', () => {
        const onJoinGameMock = jest.fn();
        render(<PlayerInput onJoinGame={onJoinGameMock} />);
        const nameInput = screen.getByLabelText(/Naam/i);
        const roomIdInput = screen.getByLabelText(/Room ID/i);
        const startGameButton = screen.getByText(/Start Game/i);
    
        fireEvent.change(nameInput, { target: { value: 'John' } });
        fireEvent.change(roomIdInput, { target: { value: 'room1' } });
        fireEvent.click(startGameButton);
    
        expect(onJoinGameMock).toHaveBeenCalledWith('room1', 'John');
      });



});
