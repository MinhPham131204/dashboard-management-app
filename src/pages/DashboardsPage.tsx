import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboards } from '../store/dashboardSlice';
import { AppDispatch, RootState } from '../store/hooks'; 

import WidgetFrame from '../components/ui-kit/WidgetFrame';
import ChartPlaceholder from '../components/ui-kit/ChartPlaceholder';
import LazyImage from '../components/LazyImage';

const DashboardsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboards, loading, error } = useSelector((state: RootState) => state.dashboard);

  const check: boolean = loading || !!error;

  useEffect(() => {
    dispatch(fetchDashboards());
  }, []);

  console.log("DashboardsPage component rendered");

  return (
    <div className="max-w-4xl mt-16 mx-auto">
      <h1 className="text-3xl font-bold mb-8">All Dashboards</h1>
      <div className="flex flex-wrap gap-6 mt-6">
        {check 
            ? <ChartPlaceholder isLoading={loading} error={error} />

            : (
                dashboards.map((db) => (
                  <WidgetFrame key={db.id} title={`Dashboard #${db.id}`}>
                    <LazyImage src={db.iframeConfig.url} alt={`Dashboard ${db.id}`} className='w-xs' id={db.id} />
                  </WidgetFrame>
                ))
              )
        }
      </div>
    </div>
  );
};

export default DashboardsPage;