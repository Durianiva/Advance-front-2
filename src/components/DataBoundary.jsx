import { useCourses } from "../hooks/useCourses";
export default function DataBoundary({ children }) {
 const { status, error, refresh } = useCourses();
 if (status === "failed") return <main className="container"><p role="alert">Gagal memuat kelas: {error}</p><button onClick={() => refresh().catch(() => {})}>Coba lagi</button></main>;
 if (status !== "succeeded") return <main className="container"><p role="status">Memuat kelas...</p></main>;
 return children;
}
