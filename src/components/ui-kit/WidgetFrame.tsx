import React from 'react';

type WidgetFrameProps = {
  title: string;
  children: React.ReactNode;
};

const WidgetFrame: React.FC<WidgetFrameProps> = ({ title, children }) => (
  <div className="border border-gray-300 rounded-lg p-4 mb-6">
    <h3 className="text-xl font-semibold mb-6">{title}</h3>
    <div>{children}</div>
  </div>
);

export default WidgetFrame;