import { listVendors } from '@/lib/repositories/vendorRepository'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const vendors = listVendors(20, 0)

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      <section className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Vendor Signups</h2>
        </div>
        <div className="divide-y">
          {vendors.length === 0 ? (
            <div className="p-4 text-gray-500">No vendors yet.</div>
          ) : (
            vendors.map(v => (
              <div key={v.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{v.businessName}</div>
                  <div className="text-sm text-gray-600">{v.contactName} • {v.email}</div>
                  <div className="text-sm text-gray-500">{v.businessType}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

