import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/hooks';
import { BrowserRouter } from 'react-router-dom';
import * as ReactRouter from 'react-router-dom';
import * as dashboardSlice from '../store/dashboardSlice';

import DashboardsPage from '../pages/DashboardsPage';
import DashboardDetailPage from '../pages/DashboardDetailPage';
import CreateDashboardPage from '../pages/CreateDashboardPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GetAllDashboard', () => {
    test('check render all dashboards', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DashboardsPage />
                </BrowserRouter>
            </Provider>
        );
        expect(screen.getByRole('heading', { name: /All Dashboards/i })).toBeInTheDocument();

        await waitFor(() => {
            // Sử dụng getByRole để tìm heading thay vì text trực tiếp
            expect(screen.getByRole('heading', { name: /Dashboard #1/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Dashboard #2/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Dashboard #3/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Dashboard #4/i })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Dashboard #5/i })).toBeInTheDocument();
        });

        // Kiểm tra số lượng nút "View Details"
        expect(screen.getAllByText('View Details')).toHaveLength(5);

        // Kiểm tra số lượng images
        expect(document.querySelectorAll('img')).toHaveLength(5);
    });

    test('show error when fetching dashboards fails', async () => {
        jest.spyOn(dashboardSlice, 'fetchDashboards').mockImplementation(() => {
            return {
                type: 'dashboard/fetchAll/rejected',
                error: { message: 'Network Error' }
            } as any;
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DashboardsPage />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
        });
    });
});

describe('GetDashboardDetail', () => {
    test('check render dashboard detail', async () => {
        jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: '1' });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DashboardDetailPage />
                </BrowserRouter>
            </Provider>
        );

        // Check the page title
        expect(screen.getByRole('heading', { name: /Dashboard Detail/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Dashboard 1/i })).toBeInTheDocument();
            expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('quickchart.io/chart'));

            expect(screen.getByText(/Amount of users/i)).toBeInTheDocument();
            expect(screen.getByText(/Revenue/i)).toBeInTheDocument();
        });
    });

    test('check URL param incorrect', async () => {
        jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: 'invalid-id' });

        jest.spyOn(dashboardSlice, 'fetchDashboardDetail').mockImplementation(() => ({
            type: 'dashboard/fetchDetail/rejected',
            error: { message: 'Dashboard not found' },
        }) as any);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DashboardDetailPage />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Dashboard not found/i)).toBeInTheDocument();
        });
    });

    test('show error when fetching dashboard detail fails', async () => {
        jest.spyOn(dashboardSlice, 'fetchDashboardDetail').mockImplementation(() => {
            return {
                type: 'dashboard/fetchDetail/rejected',
                error: { message: 'Network Error' }
            } as any;
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DashboardDetailPage />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
        });
    });
});

describe("CreateDashboard", () => {
    test("submit form successfully", async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CreateDashboardPage />
                </BrowserRouter>
            </Provider>
        );

        // Điền giá trị cho Q1
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user0' }), {
            target: { value: '100' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue0' }), {
            target: { value: '1000' }
        });

        // Điền giá trị cho Q2
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user1' }), {
            target: { value: '200' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue1' }), {
            target: { value: '2000' }
        });

        // Điền giá trị cho Q3
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user2' }), {
            target: { value: '300' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue2' }), {
            target: { value: '3000' }
        });

        // Điền giá trị cho Q4
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user3' }), {
            target: { value: '400' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue3' }), {
            target: { value: '4000' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Dashboard created successfully!');
        });
    });

    test("network error when submit form", async () => {
        jest.spyOn(dashboardSlice, 'createDashboard').mockImplementation(() => {
            return {
                type: 'dashboard/create/rejected',
                error: { message: 'Network Error' }
            } as any;
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CreateDashboardPage />
                </BrowserRouter>
            </Provider>
        );

        // Điền giá trị cho Q1
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user0' }), {
            target: { value: '100' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue0' }), {
            target: { value: '1000' }
        });

        // Điền giá trị cho Q2
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user1' }), {
            target: { value: '200' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue1' }), {
            target: { value: '2000' }
        });

        // Điền giá trị cho Q3
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user2' }), {
            target: { value: '300' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue2' }), {
            target: { value: '3000' }
        });

        // Điền giá trị cho Q4
        fireEvent.change(screen.getByLabelText(/Amount of users:/i, { selector: '#user3' }), {
            target: { value: '400' }
        });
        fireEvent.change(screen.getByLabelText(/Revenue:/i, { selector: '#revenue3' }), {
            target: { value: '4000' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Create/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Network Error');
        });
    });
});