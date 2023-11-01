import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginView from './LoginView'
import '@testing-library/jest-dom'
import { MemoryRouter } from "react-router-dom";
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);
const store = mockStore({});

test("username field required error shows when username field is missing when submit button is clicked", async () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
  <Provider store={store}>
    <MemoryRouter>
      <LoginView />
    </MemoryRouter>
  </Provider>
  );

  // Find the username input field and the submit button
  const usernameInput = getByPlaceholderText('Username');
  const submitButton = getByText('Submit');

  // Click the submit button without entering a username
  fireEvent.click(submitButton);

  // Find the userError span
  const userErrorSpan = getByText('Username Field is required');
  
  // Assert that the userError span is rendered
  expect(userErrorSpan).toBeInTheDocument();
})

test("password field required error shows when password field is missing when submit button is clicked", async () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
  <Provider store={store}>
    <MemoryRouter>
      <LoginView />
    </MemoryRouter>
  </Provider>
  );

  // Find the username input field and the submit button
  const passwordInput = getByPlaceholderText('Password');
  const submitButton = getByText('Submit');

  // Click the submit button without entering a username
  fireEvent.click(submitButton);

  // Find the userError span
  const passwordErrorSpan = getByText('Password Field is required');
  
  // Assert that the userError span is rendered
  expect(passwordErrorSpan).toBeInTheDocument();
})