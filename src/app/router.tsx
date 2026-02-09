import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { ListingDetail } from '../pages/ListingDetail'
import { NewListing } from '../pages/NewListing'
import { EditListing } from '../pages/EditListing'
import { About } from '../pages/About'
import { Layout } from './layout/Layout'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/listings/:id/edit" element={<EditListing />} />
          <Route path="/new" element={<NewListing />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

