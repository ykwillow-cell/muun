import React from 'react';
import { useParams, Redirect, Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { fortuneGuides } from '../lib/fortune-guide';
import { getOgTags } from '../lib/og-tags';

const GuideDetail: React.FC = () => {
  const params = useParams();
  const guideId = params.id;
  const guide = fortuneGuides.find((g) => g.id === guideId);

  if (!guide) {
    return <Redirect to="/guide" />;
  }

  const ogTags = getOgTags({
    title: `[가입X/100%무료] ${guide.title} - 무운`,
    description: guide.description,
    url: `https://muunsaju.com/guide/${guide.id}`,
  });

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Helmet>
        <title>{ogTags.title}</title>
        {Object.entries(ogTags).map(([key, value]) => (
          <meta key={key} property={key.startsWith('og:') ? key : `og:${key}`} content={value} />
        ))}
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{guide.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{guide.description}</p>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </div>
      <div className="mt-8 text-center">
        <Link href="/guide">
          <a className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            목록으로 돌아가기
          </a>
        </Link>
      </div>
    </div>
  );
};

export default GuideDetail;
