// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import Wishlist from './pages/Wishlist'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'
import Settings from './pages/admin/Settings'
import OrderSuccess from './pages/OrderSuccess';
import Coupons from './pages/admin/Coupons';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Box>
            <Navbar />
            <Box pt="64px">
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rotas Protegidas */}
                <Route 
                  path="/cart" 
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <PrivateRoute>
                      <OrderHistory />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/wishlist" 
                  element={
                    <PrivateRoute>
                      <Wishlist />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/orderSuccess" 
                  element={
                    <PrivateRoute>
                      <OrderSuccess />
                    </PrivateRoute>
                  } 
                />

                {/* Rotas do Admin */}
                <Route 
                  path="/admin/*" 
                  element={
                    <PrivateRoute adminOnly>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/coupons" element={<Coupons />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </Box>
          </Box>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App;