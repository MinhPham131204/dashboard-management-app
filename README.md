# Dashboard Management Web Application

A simple dashboard management web application built with React, featuring global state management with Redux, performance optimization via Lazy Loading, and comprehensive unit testing.

## 🚀 Key Features

* **User Authentication:** Simulated login flow with secure session verification using Redux global state.
* **Dashboard Overview:** Centralized list showcasing all created dashboards with quick status and metric previews.
* **Dashboard Detail View:** Dedicated, dynamic interface for inspecting specific dashboard details and data components.
* **Create New Dashboard:** Interactive form interface to instantly configure and register new dashboards.

## 🛠️ Tech Stack

* **Core Framework:** React, React Router
* **State Management:** Redux / Redux Toolkit (Authentication & Dashboard data management)
* **Optimization:** React `lazy()` and `Suspense` for route-based Lazy Loading
* **Testing Suite:** Jest & React Testing Library (RTL) for component unit tests

## ⚡ Getting Started

### Prerequisites

Ensure you have Node.js (v16.0.0 or higher) and npm/yarn installed on your local environment.

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/MinhPham131204/dashboard-management-app.git

cd dashboard-management-app
```

2. **Install Project dependendency:**
```bash
npm install
# or
yarn install
```

3. **Start the application:**
```bash
npm run dev
# or
yarn start
```

Then open your browser and navigate to http://localhost:5173

### Running tests

Execute the automated unit testing suite covering component rendering, user interactions, and state updates:

```bash
npm test
# or
yarn test
```