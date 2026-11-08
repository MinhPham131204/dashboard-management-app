import Dashboard from '../model/Dashboard';
import User from '../model/User';

// Mock response types
type ApiResponse<T> = {
  statusCode: number;
  body: {
    code: string;
    message: string;
    status: string;
    error: string | null;
    data: T;
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const iframeList: Dashboard[] = [
  {
    id: 1,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 2,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 3,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 4,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 5,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 6,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 7,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
  {
    id: 8,
    iframeConfig: {
      url: "https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'], datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}",
    },
  },
];

export async function getAllDashboards(): Promise<
  ApiResponse<{ iframeList: Dashboard[] }>
> {
  // await wait(700);
  return {
    statusCode: 200,
    body: {
      code: "0000",
      message: "success",
      status: "fetched",
      error: null,
      data: { iframeList: iframeList },
    },
  };
}

export async function getDashboardDetail(id: number): Promise<
  ApiResponse<{ iframe: Dashboard }>
> {
  await wait(700);
  if (isNaN(id) || id < 1 || id > iframeList.length) {
    throw new Error("Dashboard Not Found");
  }
  return {
    statusCode: 200,
    body: {
      code: "0000",
      message: "success",
      status: "fetched",
      error: null,
      data: {
        iframe: {
          ...iframeList[id - 1],
          type: "dashboard"
        }
      },
    },
  };
}

export async function createDashboardApi(
  data: unknown
): Promise<ApiResponse<{}>> {
  await wait(700);
  return {
    statusCode: 201, // giống HTTP 201 Created
    body: {
      code: "0000",
      message: "Dashboard created successfully!",
      status: "fetched",
      error: null,
      data: {},
    },
  };
}

export async function handleLogin(
  user: User
): Promise<ApiResponse<{}>> {
  await wait(700);
  if (user.username.trim() === "admin" && user.password === "12345678") {
    return {
      statusCode: 200,
      body: {
        code: "0000",
        message: "success",
        status: "logged_in",
        error: null,
        data: { user: { id: 1, name: "Admin" } },
      },
    };
  }
  return {
    statusCode: 401,
    body: {
      code: "0001",
      message: "User Not Found",
      status: "failed",
      error: "Unauthorized",
      data: {},
    },
  };
}