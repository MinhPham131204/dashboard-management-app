import React from 'react';

type ChartPlaceholderProps = {
  isLoading: boolean;
  error: string | undefined;
};

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center p-6"><span className="spinner" />Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }
  return null;
};

export default ChartPlaceholder;