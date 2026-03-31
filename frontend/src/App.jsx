import { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SellerLayout from './components/layout/SellerLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ProtectedUserRoute from './components/auth/ProtectedUserRoute'
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import NotFound from './pages/public/NotFound'
import BookDetail from './pages/public/BookDetail'
import Explore from './pages/public/Explore'
import MyLibrary from './pages/user/MyLibrary'
import Profile from './pages/user/Profile'
import ReadPage from './pages/user/ReadPage'
import Checkout from './pages/payment/Checkout'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import SellerDashboard from './pages/seller/SellerDashboard'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

import UpdatePassword from './pages/auth/UpdatePassword'
import SellerLogin from './pages/auth/SellerLogin'
import SellerRegister from './pages/auth/SellerRegister'
import SellerForgotPassword from './pages/auth/SellerForgotPassword'
import SellerUpdatePassword from './pages/auth/SellerUpdatePassword'
import SellerGuide from './pages/seller/SellerGuide'
import AddBook from './pages/seller/AddBook'
import EditBook from './pages/seller/EditBook'
import MyBooks from './pages/seller/MyBooks'
import Withdrawals from './pages/seller/Withdrawals'
import SellerSettings from './pages/seller/SellerSettings'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageBooks from './pages/admin/ManageBooks'
import ManageWithdrawals from './pages/admin/ManageWithdrawals'
import AdminSettings, { applyGlobalTheme, getAvailableThemes } from './pages/admin/AdminSettings'

function App() {
  useEffect(() => {
    const savedThemeName = localStorage.getItem('bookit_admin_theme')
    if (savedThemeName) {
      const foundTheme = getAvailableThemes().find(t => t.name === savedThemeName)
      if (foundTheme) applyGlobalTheme(foundTheme)
    }
  }, [])

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Seller Routes - Authenticated Portal (Sidebar Layout) */}
          <Route path="/seller" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SellerDashboard />} />
            <Route path="books" element={<MyBooks />} />
            <Route path="add-book" element={<AddBook />} />
            <Route path="edit-book/:id" element={<EditBook />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>

          {/* Seller Auth Routes (Standalone - No Sidebar/User Navbar) */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/forgot-password" element={<SellerForgotPassword />} />
          <Route path="/seller/update-password" element={<SellerUpdatePassword />} />

          {/* Admin Routes - Authenticated Portal (Admin Layout) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="books" element={<ManageBooks />} />
            <Route path="edit-book/:id" element={<EditBook />} />
            <Route path="withdrawals" element={<ManageWithdrawals />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* User/Public Routes - Main Site (Navbar + Footer) */}
          <Route path="/" element={<Layout />}>

            {/* Unprotected Public Routes */}
            <Route path="seller/guide" element={<SellerGuide />} />

            {/* Protected User-Only Routes */}
            <Route element={<ProtectedUserRoute> <Outlet /> </ProtectedUserRoute>}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="update-password" element={<UpdatePassword />} />
              <Route path="explore" element={<Explore />} />
              <Route path="my-library" element={<MyLibrary />} />
              <Route path="profile" element={<Profile />} />
              <Route path="read/:id" element={<ReadPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment/success" element={<PaymentSuccess />} />
              <Route path="book/:id" element={<BookDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>

          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
