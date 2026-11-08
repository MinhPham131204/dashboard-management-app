import React from 'react';

type StatDisplayProps = {
  label: string;
  value: string | number;
};

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value }) => (
  <section className="text-center my-8">
    <h4 className="text-4xl font-bold">{value}</h4>
    <p className="text-gray-500 text-sm">{label}</p>
  </section>
);

export default StatDisplay;