import { builder } from '@builder.io/react';

// Optional: log the API key to verify it's being read correctly
console.log('Builder API Key:', process.env.NEXT_PUBLIC_BUILDER_API_KEY);

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');
export default builder;
