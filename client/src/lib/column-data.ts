import { columns as rawColumns } from './column-data-30';

export interface ColumnData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  author: string;
  publishedDate: string;
  readTime: number;
  thumbnail: string;
  content: string;
  keywords: string[];
  relatedServiceUrl?: string;
}

export const COLUMN_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'basic', label: '사주 기초' },
  { id: 'luck', label: '개운법' },
  { id: 'relationship', label: '관계 & 궁합' },
  { id: 'health', label: '건강 & 운' },
  { id: 'money', label: '재물운' },
  { id: 'flow', label: '운명의 흐름' }
];

export const columns: ColumnData[] = rawColumns.map(col => ({
  ...col,
  // Ensure data consistency if needed
  categoryLabel: COLUMN_CATEGORIES.find(c => c.id === col.category)?.label || '운세'
}));

export function getColumnById(id: string): ColumnData | undefined {
  return columns.find(col => col.id === id);
}

export function getColumnsByCategory(category: string): ColumnData[] {
  if (category === 'all') return columns;
  return columns.filter(col => col.category === category);
}

export function getAllColumns(): ColumnData[] {
  return columns;
}

export function getLatestColumns(limit: number = 3): ColumnData[] {
  return [...columns]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}
