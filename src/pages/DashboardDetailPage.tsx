import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store/hooks';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardDetail } from '../store/dashboardSlice';

import WidgetFrame from '../components/ui-kit/WidgetFrame';
import ChartPlaceholder from '../components/ui-kit/ChartPlaceholder';
import StatDisplay from '../components/ui-kit/StatDisplay';

const DashboardDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { detail, loading, error } = useSelector((state: RootState) => state.dashboard);

  const check = loading || !!error;

  useEffect(() => {
    dispatch(fetchDashboardDetail(Number(id)));
  }, []);

  console.log("DashboardDetailPage component rendered");

  return (
    <div className="max-w-4xl mt-16 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Detail</h1>
      {
        check 
            ? <ChartPlaceholder isLoading={loading} error={error} />
            : (
                <>
                  <WidgetFrame title={`Dashboard ${detail?.id}`}>
                    <img src={detail?.iframeConfig.url} alt={`Dashboard ${detail?.id}`} />
                  </WidgetFrame>
                  <StatDisplay label="Amount of users" value={360} />
                  <StatDisplay label="Revenue" value={1000} />
                </>
              )
      }
    </div>
  );
};

export default DashboardDetailPage;