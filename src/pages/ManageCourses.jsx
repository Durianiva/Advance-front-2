import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCourses } from "../hooks/useCourses";
import "../manage-courses.css";
export default function ManageCourses() {
 const { items, add, edit, remove } = useCourses();
 const [selected, setSelected] = useState("");
 const [title, setTitle] = useState("");
 const [query, setQuery] = useState("");
 const [notice, setNotice] = useState(null);
 const [busy, setBusy] = useState(false);
 const current = items.find(item => String(item.id) === selected);
 const visible = items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
 function reset() { setSelected(""); setTitle(""); }
 function select(item) { setSelected(String(item.id)); setTitle(item.title); setNotice(null); }
 async function run(action, message) {
   setBusy(true); setNotice(null);
   try { await action(); setNotice({ type: "success", message }); }
   catch (error) { setNotice({ type: "error", message: error.message || "Perubahan gagal disimpan. Silakan coba lagi." }); }
   finally { setBusy(false); }
 }
 return <><Navbar /><main className="manage-page">
 <Link className="manage-back" to="/beranda"><i className="ri-arrow-left-line" aria-hidden="true" /> Kembali ke beranda</Link>
 <header className="manage-heading"><div><h1>Kelola Kelas</h1><p>Atur koleksi kelas pembelajaran Anda dalam satu tempat.</p></div><span className="manage-count">{items.length} kelas tersedia</span></header>
 {notice && <div className={`manage-notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</div>}
 <div className="manage-layout">
 <section className="manage-panel" aria-labelledby="course-list-title">
 <div className="manage-panel-heading"><h2 id="course-list-title">Daftar kelas</h2><button className="manage-primary" disabled={busy} onClick={() => { reset(); setNotice(null); }}>+ Tambah kelas</button></div>
 <label className="manage-search"><i className="ri-search-line" aria-hidden="true" /><input type="search" aria-label="Cari judul kelas" placeholder="Cari judul kelas..." value={query} onChange={e => setQuery(e.target.value)} /></label>
 <div className="manage-list">{visible.map(item => <button key={item.id} disabled={busy} className={`manage-row ${selected === String(item.id) ? "selected" : ""}`} onClick={() => select(item)} aria-pressed={selected === String(item.id)}>
 <img src={item.image} alt="" /><span><strong>{item.title}</strong><small>{item.breadcrumbCategory || item.category}</small></span><i className="ri-pencil-line" aria-hidden="true" /></button>)}</div>
 {!visible.length && <div className="manage-empty"><i className="ri-book-open-line" aria-hidden="true" /><p>{items.length ? "Tidak ada kelas yang cocok." : "Belum ada kelas. Tambahkan kelas pertama Anda."}</p></div>}
 </section>
 <section className="manage-panel manage-editor" aria-labelledby="editor-title">
 <span className="manage-editor-icon"><i className={current ? "ri-edit-box-line" : "ri-add-circle-line"} aria-hidden="true" /></span>
 <h2 id="editor-title">{current ? "Edit kelas" : "Tambah kelas baru"}</h2><p>{current ? "Perbarui judul kelas yang Anda pilih." : "Mulai dengan menambahkan judul kelas."}</p>
 <form onSubmit={event => { event.preventDefault(); run(async () => {
   if (current) await edit(current.id, { title: title.trim() });
   else { const { id: _id, ...template } = items[0] || {}; await add({ ...template, title: title.trim() }); }
   reset();
 }, current ? "Judul kelas berhasil diperbarui." : "Kelas baru berhasil ditambahkan."); }}>
 <label htmlFor="course-title">Judul kelas <span>*</span></label><input id="course-title" required maxLength={180} value={title} disabled={busy} placeholder="Masukkan judul kelas" onChange={event => setTitle(event.target.value)} />
 <small>{current ? "Perubahan judul juga ditampilkan di beranda." : "Gambar dan detail awal mengikuti kelas pertama; judul menggunakan isian Anda."}</small>
 <div className="manage-actions"><button className="manage-primary" disabled={busy || !title.trim()} type="submit">{busy ? "Menyimpan..." : current ? "Simpan perubahan" : "Tambah kelas"}</button>{current && <button className="manage-secondary" type="button" disabled={busy} onClick={reset}>Batal</button>}</div>
 {current && <div className="manage-danger"><h3>Hapus kelas</h3><p>Kelas akan dihapus dari koleksi. Tindakan ini tidak dapat dibatalkan.</p><button type="button" disabled={busy} onClick={() => {
 if (window.confirm(`Hapus kelas "${current.title}"?`)) run(async () => { await remove(current.id); reset(); }, "Kelas berhasil dihapus.");
 }}><i className="ri-delete-bin-line" aria-hidden="true" /> Hapus kelas</button></div>}
 </form></section></div></main><Footer /></>;
}
