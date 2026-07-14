import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminBarbers from './pages/admin/Barbers';
import AdminServices from './pages/admin/Services';
import AdminCustomers from './pages/admin/Customers';
import AdminGallery from './pages/admin/Gallery';
import AdminProducts from './pages/admin/Products';
import AdminBlogs from './pages/admin/Blogs';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminSettings from './pages/admin/Settings';
import AdminContacts from './pages/admin/Contacts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="team" element={<Team />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
      </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="barbers" element={<AdminBarbers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="blog" element={<AdminBlogs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="barbers" element={<AdminBarbers />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="gallery" in element={<AdminGallery />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="blog" element={<AdminBlogs />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
