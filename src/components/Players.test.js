import React from "react";
import Players from "./Players";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
 

describe('Player Components', () => {

    test('should render players with points', () => {
        const players = [
            {id:1, name:'Player 1'},
            {id:2, name:'Player 2'},
        ]

        const points = {
            1:10,
            2:5
        }

        render(<Players players={players} points={points}/>)
        expect(screen.getByText('Player 1: 10')).toBeInTheDocument()
        expect(screen.getByText('Player 2: 5')).toBeInTheDocument()

    })

    test('should highlight current player turn', () => {
        const players = [
          { id: 1, name: 'Player 1' },
          { id: 2, name: 'Player 2' },
        ];
        const points = {
          1: 10,
          2: 5,
        };
        const currentTurn = 1;
    
        const { getByText } = render(
          <Players players={players} currentTurn={currentTurn} points={points} />
        );
    
        expect(getByText('Player 1: 10')).toHaveStyle('backgroundColor: green');
        expect(getByText('Player 2: 5')).toHaveStyle('backgroundColor: transparent');
    });

})