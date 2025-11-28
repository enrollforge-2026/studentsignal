import React from 'react';
import { Link } from 'react-router-dom';

const LoggedInFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <div>© 2025 Student Signal</div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoggedInFooter;
