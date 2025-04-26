import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function InfoCard({ title, description, icon: Icon = FaInfoCircle }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="text-green-600 text-2xl" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
} 