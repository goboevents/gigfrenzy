export default function TestPage() {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Test Environment Variable</h1>
        <p>API Key: {process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'Not Found'}</p>
      </div>
    );
  }