import DynamicPage from '../../components/DynamicPage'

export default async function Page({ params }: { params: Promise<{ page: string[] }> }) {
  const resolved = await params
  return <DynamicPage params={resolved} />
}
