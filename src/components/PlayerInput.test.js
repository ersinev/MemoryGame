import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Updated import statement
import PlayerInput from "./PlayerInput";

describe('Game component for testing', () => {
    
    test('should render player input page', () => {
        render(<PlayerInput/>);
        const startButton = screen.getByText(/Start Game/i);
        expect(startButton).toBeInTheDocument();  
    });

});
