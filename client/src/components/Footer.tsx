import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">무운(Muun)</h3>
            <p className="text-sm">
              무운은 사주, 운세, 타로 등 동서양의 다양한 운명학 콘텐츠를 무료로 제공하는 서비스입니다.
              개인의 삶을 더 깊이 이해하고, 현명한 선택을 할 수 있도록 돕습니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">빠른 링크</h3>
            <ul className="space-y-2">
              <li><Link href="/guide"><a className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">운세 가이드</a></Link></li>
              <li><Link href="/about"><a className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">회사 소개</a></Link></li>
              <li><Link href="/contact"><a className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">문의하기</a></Link></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">법률 및 정책</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy"><a className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">개인정보처리방침</a></Link></li>
              <li><Link href="/terms"><a className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">이용약관</a></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Muun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
