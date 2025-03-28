import DynamicPageClient from './DynamicPageClient';

export default async function DynamicPage({ params }: { params: Promise<{ page: string[] }> }) {
  const resolvedParams = await params;
  console.log('DynamicPage params:', resolvedParams); // Should now log something like { page: ['test-page'] }
  return <DynamicPageClient params={resolvedParams} />;
}
