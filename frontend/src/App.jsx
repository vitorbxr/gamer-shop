// Configuramos as rotas principais da aplicação
// Criamos a estrutura básica com navbar fixa
// Definimos as principais páginas que precisaremos criar

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'

// Importação das páginas (vamos criar em seguida)
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'

function App() {
  return (
    <Box>
      <Navbar />
      <Box pt="64px"> {/* Espaço para a navbar fixa */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App