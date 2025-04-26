import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Privacy-Preserving Data Visualization</p>
          <p className="text-sm mt-2">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
} 