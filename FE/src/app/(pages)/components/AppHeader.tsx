import React from 'react';
import ButtonLogin from './buttons/ButtonLogin';
import SlideWrapper from './slide/SlideWrapper';

const AppHeader = () => {
  return (
    <header className="w-full h-20 bg-gradient-to-r from-black via-black to-red-900 flex items-center px-6">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img src="/logo.png" className="h-14" alt="Logo" />
      </div>

      <ButtonLogin></ButtonLogin>

      {/* Menu */}
      <nav className="flex-1 flex justify-center space-x-10 text-white font-semibold text-sm tracking-wide">
        <a href="#" className="hover:text-red-400">
          TRANG CHỦ
        </a>
        <a href="#" className="hover:text-red-400">
          ACCOUNT
        </a>
        <a href="#" className="hover:text-red-400">
          MIDMAN
        </a>
        <a href="#" className="hover:text-red-400">
          THÔNG TIN CHỦ SHOP
        </a>
        <a href="#" className="hover:text-red-400">
          HƯỚNG DẪN
        </a>
      </nav>

      {/* Balance + User */}
      <div className="flex items-center space-x-3">
        {/* Balance */}
        <div className="relative">
          <div className="px-5  bg-red-900 border border-red-600 text-yellow-300 font-bold text-sm skew-x-[-15deg]">
            <span className="inline-block skew-x-[15deg]">10.000.000 VNĐ</span>
          </div>
        </div>

        {/* User */}
        <div className="relative">
          <div className="px-4 py-2 bg-red-900 border border-red-600 text-white skew-x-[-15deg]">
            <div className="flex items-center space-x-2 skew-x-[15deg]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 01112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
