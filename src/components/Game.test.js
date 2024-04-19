import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import Game from "./Game";

describe('Game component testing', () => {

    test('renders without crashing', () => {
        render(<Game />
        )
    })

    test('allows entering player information and starting the game.', async() => {
       
        render(<Game />)

        const playerInput = screen.getByPlaceholderText(/Vul je naam in/i)
        const roomInput = screen.getByPlaceholderText(/Bijvoorbeeld: team1, MariaSchool2, groep2/i)
        const startButton = screen.getByText(/Start Game/i)
        
        fireEvent.change(playerInput, { target: { value: "player1" } })
        fireEvent.change(roomInput, { target: { value: "123" } })
        fireEvent.click(startButton)
        
      

        await waitFor(() => {
            expect(playerInput).toHaveTheValue('player1')
        })

    })




})