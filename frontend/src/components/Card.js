import React from 'react';

export default function Card({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform ${className}`}>
      <div className="flex items-center mb-4">
        <Icon className="text-blue-500 text-2xl mr-3" />
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
} 