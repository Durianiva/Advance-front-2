import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import loginIcon from "../assets/images/login.png";
import { PROFILE_KEY, REGISTERED_USER_KEY } from "../data/localData";
import "../mission.css";

const defaultProfile = {
  name: "Jennie Ruby Jane",
  email: "rubyjane@gmail.com",
  phone: "81234567890",
  countryCode: "+62",
};

function MyProfile() {
  const [profile, setProfile] = useState(loadProfile);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
  }

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <DashboardSidebar title="Ubah Profil" subtitle="Ubah data diri Anda" />
        <section className="dashboard-content profile-card">
          <div className="profile-summary">
            <img src={loginIcon} alt="Profil" />
            <div><h2>{profile.name}</h2><p>{profile.email}</p><button>Ganti Foto Profil</button></div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>Nama Lengkap<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
            <label>E-Mail<input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
            <label className="phone-label">No. Hp<div><span>{profile.countryCode || "+62"}</span><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div></label>
            <button className="green-button" type="submit">Simpan</button>
          </form>
          {saved && <p className="profile-saved">✓ Profil berhasil disimpan di database lokal.</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}

function loadProfile() {
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  if (savedProfile) return { ...defaultProfile, ...savedProfile };

  const registeredUser = JSON.parse(localStorage.getItem(REGISTERED_USER_KEY) || "null");
  if (!registeredUser) return defaultProfile;

  return {
    name: registeredUser.fullName,
    email: registeredUser.email,
    phone: registeredUser.noHp,
    countryCode: registeredUser.countryCode,
  };
}

export default MyProfile;
