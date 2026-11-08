import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import store from '../store/hooks';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import DashboardsPage from '../pages/DashboardsPage';
import CreateDashboardPage from '../pages/CreateDashboardPage';
import App from '../App';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe("Sidebar", () => {
    test('test rendering when click Dashboard item on Sidebar', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/dashboards']}>
                    <Routes>
                    <Route path="/dashboards" element={<MainPage />}>
                        <Route index element={<DashboardsPage />} />
                        <Route path="create" element={<CreateDashboardPage />} />
                    </Route>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Dashboard', { exact: true }));

        await waitFor(() => {
            expect(screen.getByText(/All Dashboards/i)).toBeInTheDocument();

            expect(screen.getAllByRole('heading', { name: /Dashboard #/i })).toHaveLength(5);
            expect(screen.getAllByText('View Details')).toHaveLength(5);

            expect(document.querySelectorAll('img')).toHaveLength(5);

            // Kiểm tra đường dẫn hình ảnh của dashboard đầu tiên
            const firstImage = document.querySelector('img') as HTMLImageElement;
            expect(firstImage.src).toContain('quickchart.io/chart');
        });
    });

    test('test rendering when click Create Dashboard item on Sidebar', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/dashboards']}>
                    <Routes>
                        <Route path="/dashboards" element={<MainPage />}>
                            <Route index element={<DashboardsPage />} />
                            <Route path="create" element={<CreateDashboardPage />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText(/Create Dashboard/i));
        
        await waitFor(() => {
            expect(screen.getByText(/Create new dashboard/i)).toBeInTheDocument();

            expect(screen.getAllByText(/Amount of users:/i)).toHaveLength(4);
            expect(screen.getAllByText(/Revenue:/i)).toHaveLength(4);

            expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
        });
    });

    test('test logic when click Log Out', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <MainPage />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Log Out', { exact: true }));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
})

describe("Routing", () => {
    test('Not Found URL', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/not-found']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
        });
    });

    test('test protected route in dashboard', async () => {
        // 1. Cài đặt redux store để mô phỏng trạng thái đã đăng nhập
        const authenticatedStore = configureStore({
            reducer: {
                auth: (state = { isAuth: true, loading: false, error: undefined }, action) => state,
                dashboard: (state = { dashboards: [], detail: undefined, loading: false, error: undefined }, action) => state
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        });

        // 2. Render App với URL ban đầu là /dashboards để xác nhận đã đăng nhập
        const { unmount } = render(
            <Provider store={authenticatedStore}>
                <MemoryRouter initialEntries={['/dashboards']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        // 3. Kiểm tra rằng DashboardsPage được hiển thị
        await waitFor(() => {
            expect(screen.getByText(/All Dashboards/i)).toBeInTheDocument();
        });

        // 4. Unmount và render lại với URL là /login để mô phỏng việc nhập URL
        unmount();
        render(
            <Provider store={authenticatedStore}>
                <MemoryRouter initialEntries={['/login']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboards');
        });
    });

    test('test protected route in login', async () => {
        // 1. Cài đặt redux store để mô phỏng trạng thái chưa đăng nhập
        const authenticatedStore = configureStore({
            reducer: {
                auth: (state = { isAuth: false, loading: false, error: undefined }, action) => state,
                dashboard: (state = { dashboards: [], detail: undefined, loading: false, error: undefined }, action) => state
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                }),
        });

        // 2. Render App với URL ban đầu là /login để xác nhận chưa đăng nhập
        const { unmount } = render(
            <Provider store={authenticatedStore}>
                <MemoryRouter initialEntries={['/login']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        // 3. Kiểm tra rằng LoginPage được hiển thị
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        });

        // 4. Unmount và render lại với URL là /dashboards để mô phỏng việc nhập URL
        unmount();
        render(
            <Provider store={authenticatedStore}>
                <MemoryRouter initialEntries={['/dashboards']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    })
});