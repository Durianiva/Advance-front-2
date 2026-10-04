import { Routes, Route } from "react-router-dom";
import ManageCourses from "./pages/ManageCourses";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyProfile from "./pages/MyProfile";
import MyClasses from "./pages/MyClasses";
import MyOrders from "./pages/MyOrders";
import Learning from "./pages/Learning";
import Certificate from "./pages/Certificate";
// # routing
function App() {
  return (
    <Routes>
      <Route path="/kelola-kelas" element={<ManageCourses />} />
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/beranda" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/kelas/:id" element={<CourseDetail />} />
      <Route path="/pembayaran/:id" element={<Payment />} />
      <Route path="/pembayaran/sukses/:id" element={<PaymentSuccess />} />
      <Route path="/profil" element={<MyProfile />} />
      <Route path="/kelas-saya" element={<MyClasses />} />
      <Route path="/pesanan-saya" element={<MyOrders />} />
      <Route path="/belajar/:id" element={<Learning />} />
      <Route path="/sertifikat/:id" element={<Certificate />} />
    </Routes>
  );
}

export default App;
