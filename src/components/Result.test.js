import React from "react";
import Result from "./Result";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";  

describe('Result component', () => {
    test('renders winners with their points', () => {
        const players = [
          { id: 1, name: 'Player 1' },
          { id: 2, name: 'Player 2' },
        ];
    
        const points = {
          1: 10,
          2: 5,
        };
    
        render(<Result players={players} points={points} />);
    
        expect(screen.getByText('Winner')).toBeInTheDocument();
        expect(screen.getByText('Player 1: 10 punten')).toBeInTheDocument();
    });

    test('renders multiple winners in case of tie', () => {
        const players = [
            {id:1, name:'Player 1'},
            {id:2, name:'Player 2'}
        ];

        const points = {
            1:10,
            2:10
        };

        render(<Result players={players} points={points}/>);
        expect(screen.getByText('Winners')).toBeInTheDocument();
        expect(screen.getByText('Player 1: 10 punten')).toBeInTheDocument();
        expect(screen.getByText('Player 2: 10 punten')).toBeInTheDocument();
    });


});
