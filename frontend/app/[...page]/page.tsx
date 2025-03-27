'use client';

import { useEffect, useState } from 'react';
import { builder, BuilderComponent } from '@builder.io/react';
import builderConfig from '../../builder-config';

// A fallback component if no Builder page is found
const NotFound = () => (
  <main style={{ padding: '2rem' }}>
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </main>
);

export default function DynamicPage({ params }: { params: { page: string[] } }) {
  const [builderPage, setBuilderPage] = useState<any>(null);
  const path = '/' + (params.page ? params.page.join('/') : '');

  useEffect(() => {
    // Fetch the page content from Builder.io using the URL path
    builder.get('page', {
      userAttributes: { urlPath: path }
    }).promise().then((content) => {
      setBuilderPage(content);
    }).catch((error) => {
      console.error('Error fetching Builder content:', error);
    });
  }, [path]);

  // If a Builder page was returned, render it; otherwise, render NotFound
  return builderPage ? <BuilderComponent model="page" content={builderPage} /> : <NotFound />;
}
