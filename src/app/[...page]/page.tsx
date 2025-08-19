import DynamicPage from '../../components/DynamicPage'

interface PageProps {
  params: {
    page: string[]
  }
}

export default function Page({ params }: PageProps) {
  return <DynamicPage params={params} />
}
