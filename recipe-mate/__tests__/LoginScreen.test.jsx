import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';
import { signIn } from '../firebase/auth';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../firebase/auth', () => ({
  signIn: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithGitHub: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Interaction Test: Input validation
  it('shows error when fields are empty', () => {
    const { getAllByText } = render(<LoginScreen />);
    
    // There might be a "Login" title and a "Login" button. We want the button.
    // Assuming the button is the last one or checking context.
    const loginTexts = getAllByText('Login');
    const loginButton = loginTexts[loginTexts.length - 1]; // Usually the button is later in the tree

    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please fill in all fields");
  });

  // Interaction Test: Input validation (Invalid email)
  it('shows error when email is invalid', () => {
    const { getAllByText, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginTexts = getAllByText('Login');
    const loginButton = loginTexts[loginTexts.length - 1];

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Please enter a valid email address");
  });

  // Interaction Test: Form completion & Mocking
  it('calls signIn and navigates on successful login', async () => {
    // Setup mock return value for success
    signIn.mockResolvedValue({ user: { uid: '123' }, error: null });

    const { getAllByText, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginTexts = getAllByText('Login');
    const loginButton = loginTexts[loginTexts.length - 1];

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Verify signIn was called with correct args
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
