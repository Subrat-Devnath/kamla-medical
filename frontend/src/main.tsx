


import { createRoot } from 'react-dom/client'
import './index.css'

import RootLayout from "./pages/RootLayout.tsx"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'

import FuturisticMedicalDashboard from './components/home/FuturisticMedicalDashboard.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ProductsPage from './components/home/ProductsPage.tsx'
import PurchaseHistoryPage from './components/home/PurchaseHistoryPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>


    <Routes>

      {/* <Route index element={<App />} /> */}
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />

      {/* PROTECTED (ALL PAGES SHARE PROFILE) */}
      <Route element={<RootLayout />}>
        <Route path="/home" element={<FuturisticMedicalDashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="purchase-history/:productName" element={<PurchaseHistoryPage />} />
      </Route>


    </Routes>


  </BrowserRouter>
)
