import AppLayout from '@/components/AppLayout'
import CategoryBarChart from './components/CategoryBarChart'
import DashboardHeader from './components/DashboardHeader'
import KPIBentoGrid from './components/KPIBentoGrid'
import SalesAreaChart from './components/SalesAreaChart'
import StockAlertsFeed from './components/StockAlertsFeed'
import TopProductsTable from './components/TopProductsTable'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <DashboardHeader />
        <KPIBentoGrid />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesAreaChart />
          </div>
          <div className="lg:col-span-1">
            <CategoryBarChart />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopProductsTable />
          </div>
          <div className="lg:col-span-1">
            <StockAlertsFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
