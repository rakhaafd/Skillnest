import { useState } from 'react'
import './index.css'
import LoginAdmin from './Pages/Auth/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import AdminUserDetail from './Pages/Users/UserDetail';
import AdminUsers from './Pages/Users/Users';
import AdminItemDetail from './Fragments/DetailsItem'
import AdminEditItem from './Fragments/EditItem';
import AdminItems from './Pages/Items/Items';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/users/:id" element={<AdminUserDetail />} />
        <Route path="/items" element={<AdminItems />} />
        <Route path="/items/:id" element={<AdminItemDetail />} />
        <Route path="/edit-item/:id" element={<AdminEditItem />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
