import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import Game from "./Game";

describe('Game component testing', () => {

    test('renders without crashing', () => {
        render(<Game />
        )
    })

    test('allows entering player information and starting the game', () => {
        render(<Game />)

        const playerInput = screen.getByPlaceholderText(/Vul je naam in/i)
        const roomInput = screen.getByPlaceholderText(/Bijvoorbeeld: team1, MariaSchool2, groep2/i)
        const startButton = screen.getByText(/Start Game/i)

        // Check if input fields are initially empty
        expect(playerInput).toHaveValue('')
        expect(roomInput).toHaveValue('')

        fireEvent.change(playerInput, { target: { value: "player1" } })
        fireEvent.change(roomInput, { target: { value: "123" } })
        fireEvent.click(startButton)

        // Wait for the player name to be displayed in the document

        const userName = screen.getByText(/player1/i); // Using regular expression with case-insensitivity
        expect(userName).toBeInTheDocument();

    })




})