import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { fortuneGuides } from '../lib/fortune-guide';
import { getOgTags } from '../lib/og-tags';

const Guide: React.FC = () => {
  const ogTags = getOgTags({
    title: '[가입X/100%무료] 운세 가이드 - 무운',
    description: '사주 명리학의 기본 개념부터 개운법, 도화살의 진실까지, 무운에서 제공하는 다양한 운세 가이드를 만나보세요.',
    url: 'https://muunsaju.com/guide',
  });

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>{ogTags.title}</title>
        {Object.entries(ogTags).map(([key, value]) => (
          <meta key={key} property={key.startsWith('og:') ? key : `og:${key}`} content={value} />
        ))}
      </Helmet>
      <h1 className="text-3xl font-bold mb-6 text-center">운세 가이드</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
        사주 명리학의 기본 개념부터 실생활에 적용할 수 있는 개운법, 그리고 흥미로운 운세 이야기까지.
        무운이 제공하는 다양한 운세 가이드를 통해 자신과 주변을 더 깊이 이해해 보세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fortuneGuides.map((guide) => (
          <Link key={guide.id} href={`/guide/${guide.id}`}>
            <a className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{guide.title}</h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm">{guide.description}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Guide;
