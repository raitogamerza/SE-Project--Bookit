import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SellerLayout from './components/layout/SellerLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
import SellerDashboard from './pages/seller/SellerDashboard'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

import UpdatePassword from './pages/auth/UpdatePassword'
import SellerLogin from './pages/auth/SellerLogin'
import SellerRegister from './pages/auth/SellerRegister'
import SellerGuide from './pages/seller/SellerGuide'
import AddBook from './pages/seller/AddBook'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
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
            <Route path="add-book" element={<AddBook />} />
            {/* Future routes: books, orders, etc. */}
          </Route>

          {/* Seller Auth Routes (Standalone - No Sidebar/User Navbar) */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />

          {/* Admin Routes - Authenticated Portal (Admin Layout) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* User/Public Routes - Main Site (Navbar + Footer) */}
          <Route path="/" element={<Layout />}>
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
            <Route path="book/:id" element={<BookDetail />} />

            {/* Guide pages visible to public/users */}
            <Route path="seller/guide" element={<SellerGuide />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
