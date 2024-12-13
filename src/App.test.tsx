import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('axios');

test.only('Page loaded', async () => {
  render(<App />);
  const title = screen.getByText('Upload File');
  expect(title).toBeInTheDocument();

  //Upload button disabled
  const submitButton = await screen.findByTestId('submit-button');
  expect(submitButton).toBeDisabled();

  //List Data button disabled
  const listButton = await screen.findByTestId('list-button');
  expect(listButton).toBeDisabled();
})

test.only('Verify upload file', async () => {
  const file = new File(['data'], "data.csv", { type: "text/csv" });
  const { getByTestId } = render(<App />);

  let input = getByTestId("file-input");
  await waitFor(() =>
    fireEvent.change(input, {
      target: { files: [file] },
    })
  );
  userEvent.upload(input, file);
  expect(input.files.length).toBe(1);

  //Upload button enabled when file uploaded
  const submitButton = await screen.findByTestId('submit-button');
  expect(submitButton).toBeEnabled();
});

