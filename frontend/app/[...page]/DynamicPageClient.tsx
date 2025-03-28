'use client';

import { useEffect, useState } from 'react';
import { builder, BuilderComponent } from '@builder.io/react';

console.log('DynamicPageClient: API Key from process.env:', process.env.NEXT_PUBLIC_BUILDER_API_KEY);
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');

interface DynamicPageClientProps {
  params: { page: string[] };
}

export default function DynamicPageClient({ params }: DynamicPageClientProps) {
  const [builderPage, setBuilderPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const path = '/' + (params.page ? params.page.join('/') : '');

  useEffect(() => {
    console.log('Fetching Builder.io content for URL:', path);
    builder.get('page', { userAttributes: { urlPath: path } })
      .promise()
      .then((content) => {
        console.log('Builder.io content fetched:', content);
        setBuilderPage(content);
      })
      .catch((error) => {
        console.error('Error fetching Builder content:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return builderPage ? (
    <BuilderComponent model="page" content={builderPage} />
  ) : (
    <main style={{ padding: '2rem' }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  );
}
