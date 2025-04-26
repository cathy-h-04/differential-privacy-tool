import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://img.icons8.com/fluency/96/privacy-policy.png"
              alt="Privacy Logo"
              className="h-8 w-auto mr-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Privacy-Preserving Data Visualization
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 