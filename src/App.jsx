import { Route, Routes } from 'react-router-dom'
import { RequireAdmin, RequireAuth } from './auth/RouteGuards'
import { Layout } from './components/Layout'
import { CataloguePage } from './pages/CataloguePage'
import { LoanDetailPage } from './pages/LoanDetailPage'
import { LoansPage } from './pages/LoansPage'
import { LoginPage } from './pages/LoginPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { MembersPage } from './pages/MembersPage'
import { NewLoanPage } from './pages/NewLoanPage'
import { OverduePage } from './pages/OverduePage'
import { ReportPage } from './pages/ReportPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<CataloguePage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="loans/new" element={<NewLoanPage />} />
          <Route path="loans/:id" element={<LoanDetailPage />} />
          <Route path="overdue" element={<OverduePage />} />
          <Route element={<RequireAdmin />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="report" element={<ReportPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
