import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import PlayerRecord from "./PlayerRecord";

// Mocking fetch function
global.fetch = jest.fn();

describe('PlayerRecord component', () => {
  it('renders player records correctly', async () => {
    // Mocking fetch response for rendering records
    fetch.mockResolvedValueOnce({
      json: async () => [{ _id: '1', name: 'Test Player', startTime: '2024-04-23T14:19:44.733Z', exitTime: '2024-04-23T14:23:28.809Z', elapsedTime: '00:10:00' }],
    });

    render(<PlayerRecord />);

    // Wait for the component to fetch and render records
    await waitFor(() => expect(screen.getByText(/Test Player/i)).toBeInTheDocument());
    expect(screen.getByText('23/4/2024')).toBeInTheDocument(); // Assuming formatDate function formats date as 'DD/MM/YYYY'
    expect(screen.getByText('00:10:00')).toBeInTheDocument();
  });

  it('deletes a player record on delete button click', async () => {
    // Mocking fetch response for deletion
    fetch.mockResolvedValueOnce({});
    fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<PlayerRecord />);

    // Wait for the component to fetch and render records
    await waitFor(() => expect(screen.getByText(/Test Player/i)).toBeInTheDocument());

    // Click delete button
    fireEvent.click(screen.getByText('Delete'));

    // Wait for the component to re-render after deletion
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // One for initial render, one for deletion
    expect(fetch.mock.calls[1][0]).toEqual('https://memorygame-we7d.onrender.com/player/1');
  });

  it('deletes all player records on delete all button click', async () => {
    // Mocking fetch response for delete all
    fetch.mockResolvedValueOnce({});
    fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<PlayerRecord />);

    // Wait for the component to fetch and render records
    await waitFor(() => expect(screen.getByText(/Test Player/i)).toBeInTheDocument());

    // Click delete all button
    fireEvent.click(screen.getByText('Delete All'));

    // Wait for the component to re-render after deletion
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2)); // One for initial render, one for deletion
    expect(fetch.mock.calls[1][0]).toEqual('https://memorygame-we7d.onrender.com/player/delete-all');
  });
});
