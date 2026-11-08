import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { Provider } from 'react-redux';
import store from '../store/hooks';
import { BrowserRouter } from 'react-router-dom';

import * as authSlice from '../store/authSlice';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock sessionStorage
beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
  mockNavigate.mockClear();
});

describe('Login', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('shows error on wrong credentials', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/User Not Found/i)).toBeInTheDocument();
    });
  });

  test('redirects on correct credentials', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboards');
    });
  });

  test('show network error while submitting', async () => {
    // Mock fetchUser để reject với Network Error
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const mockFetchUser = jest.spyOn(authSlice, 'fetchUser').mockImplementation((user) => {
      return {
        type: 'auth/fetchUser/rejected',
        error: { message: 'Network Error' },
        meta: { arg: user }
      } as any;
    });

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });

    mockFetchUser.mockRestore();
  });
});