import { useCourses } from "../hooks/useCourses";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import loginIcon from "../assets/images/login.png";
import { getMyClass, saveClassLearning } from "../data/localData";
import { buildCourseModules, flattenLearningItems, getQuestions, typeIcons } from "../data/learning";
import "../learning.css";

function Learning() {
  const { id } = useParams();
  const { items: courseList } = useCourses();
  const course = courseList.find(item => String(item.id) === String(id));
  const classData = getMyClass(id);
  const modules = useMemo(() => course ? buildCourseModules(course) : [], [course]);
  const items = useMemo(() => course ? flattenLearningItems(course) : [], [course]);
  const [completed, setCompleted] = useState(() => new Set(classData?.completedItemIds || []));
  const [currentId, setCurrentId] = useState(classData?.currentItem || "pretest");
  const [scores, setScores] = useState(classData?.scores || {});
  const [progressOpen, setProgressOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const current = items.find((item) => item.id === currentId) || items[0];
  const currentIndex = items.findIndex((item) => item.id === current?.id);
  const progress = Math.round((completed.size / Math.max(items.length, 1)) * 100);

  if (!course) return <div className="learning-message">Kelas tidak ditemukan. <Link to="/beranda">Kembali</Link></div>;
  if (!classData) {
    return (
      <div className="learning-message">
        <i className="ri-lock-2-line"></i>
        <h1>Kelas belum tersedia</h1>
        <p>Selesaikan checkout terlebih dahulu agar semua modul dapat dipelajari.</p>
        <Link className="learning-primary" to={`/pembayaran/${course.id}`}>Checkout Kelas</Link>
      </div>
    );
  }

  function persist(nextCompleted, nextScores = scores, nextCurrent = currentId) {
    const nextProgress = Math.round((nextCompleted.size / items.length) * 100);
    saveClassLearning(course.id, {
      completedItemIds: [...nextCompleted],
      progress: nextProgress,
      status: nextProgress === 100 ? "Selesai" : nextProgress > 0 ? "Sedang Berjalan" : "Belum Dimulai",
      scores: nextScores,
      currentItem: nextCurrent,
      completedAt: nextProgress === 100 ? Date.now() : undefined,
    });
  }

  function completeCurrent(score) {
    const nextCompleted = new Set(completed).add(current.id);
    const nextScores = score === undefined ? scores : { ...scores, [current.id]: score };
    setCompleted(nextCompleted);
    setScores(nextScores);
    persist(nextCompleted, nextScores);
  }

  function selectItem(itemId) {
    setCurrentId(itemId);
    persist(completed, scores, itemId);
  }

  function move(offset) {
    const target = items[currentIndex + offset];
    if (target) selectItem(target.id);
  }

  return (
    <div className="learning-shell">
      <header className="learning-header">
        <Link to="/kelas-saya" className="learning-back" aria-label="Kembali ke kelas saya"><i className="ri-arrow-left-line"></i></Link>
        <div className="learning-title"><small>Video course</small><strong>{course.title}</strong></div>
        <div className="learning-progress-wrap">
          <button className="learning-progress-button" onClick={() => setProgressOpen(!progressOpen)} aria-expanded={progressOpen}>
            <span className="learning-progress-track"><span style={{ width: `${progress}%` }} /></span>
            <b>{progress}%</b><i className="ri-arrow-down-s-line"></i>
          </button>
          {progressOpen && (
            <div className="learning-progress-popover">
              <strong>{progress}% Modul Telah Selesai</strong>
              <p>{progress === 100 ? "Selamat! Semua aktivitas telah selesai." : "Selesaikan semua aktivitas untuk mendapatkan sertifikat."}</p>
              <Link className={progress === 100 ? "learning-primary" : "learning-primary disabled"} to={progress === 100 ? `/sertifikat/${course.id}` : "#"} onClick={(event) => progress !== 100 && event.preventDefault()}>
                <i className="ri-trophy-line"></i> Ambil Sertifikat
              </Link>
            </div>
          )}
        </div>
        <img className="learning-avatar" src={loginIcon} alt="Profil peserta" />
      </header>

      <main className="learning-layout">
        <section className="lesson-stage">
          <LessonContent
            item={current}
            course={course}
            completed={completed.has(current.id)}
            savedScore={scores[current.id]}
            onComplete={completeCurrent}
            onRetry={() => setScores((value) => ({ ...value, [current.id]: undefined }))}
          />
          <nav className="lesson-nav" aria-label="Navigasi aktivitas">
            <button className="learning-secondary" disabled={currentIndex <= 0} onClick={() => move(-1)}><i className="ri-arrow-left-line"></i> Sebelumnya</button>
            <button className="learning-primary" disabled={currentIndex >= items.length - 1} onClick={() => move(1)}>Selanjutnya <i className="ri-arrow-right-line"></i></button>
          </nav>
        </section>

        <aside className="module-sidebar">
          <div className="module-sidebar-title">Daftar Modul <span>{completed.size}/{items.length}</span></div>
          {modules.map((module) => (
            <details open key={module.id}>
              <summary>{module.title}</summary>
              <div className="module-list">
                {module.items.map((item) => (
                  <button key={item.id} className={`${current.id === item.id ? "active" : ""} ${completed.has(item.id) ? "done" : ""}`} onClick={() => selectItem(item.id)}>
                    <i className={completed.has(item.id) ? "ri-checkbox-circle-fill" : typeIcons[item.type]}></i>
                    <span><b>{item.title}</b><small>{item.meta}</small></span>
                  </button>
                ))}
              </div>
            </details>
          ))}
          <button className="review-button" onClick={() => setReviewOpen(true)}><i className="ri-star-line"></i> Beri Review & Rating</button>
        </aside>
      </main>

      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} onSubmit={() => { setReviewSent(true); setReviewOpen(false); }} />}
      {reviewSent && <div className="learning-toast"><i className="ri-checkbox-circle-fill"></i> Review berhasil dikirim.</div>}
    </div>
  );
}

function LessonContent({ item, course, completed, savedScore, onComplete, onRetry }) {
  if (item.type === "video") return <VideoLesson item={item} course={course} completed={completed} onComplete={onComplete} />;
  if (item.type === "summary") return <SummaryLesson item={item} course={course} completed={completed} onComplete={onComplete} />;
  return <QuizLesson item={item} course={course} savedScore={savedScore} completed={completed} onComplete={onComplete} onRetry={onRetry} />;
}

function VideoLesson({ item, course, completed, onComplete }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="lesson-content">
      <div className={`video-player ${playing ? "playing" : ""}`}>
        <div className="video-badge">VIDEO PEMBELAJARAN</div>
        <button aria-label={playing ? "Jeda video" : "Putar video"} onClick={() => setPlaying(!playing)}><i className={playing ? "ri-pause-fill" : "ri-play-fill"}></i></button>
        <div className="video-caption"><span>{item.title}</span><small>{course.title}</small></div>
      </div>
      <div className="lesson-copy">
        <div><span className="lesson-kicker">{item.meta} • Video</span><h1>{item.title}</h1><p>{item.description}</p></div>
        <button className={completed ? "learning-secondary complete" : "learning-primary"} onClick={() => !completed && onComplete()}>
          <i className={completed ? "ri-checkbox-circle-fill" : "ri-check-line"}></i> {completed ? "Sudah Selesai" : "Tandai Video Selesai"}
        </button>
      </div>
      <div className="learning-points"><h2>Poin yang akan dipelajari</h2><ul><li>Memahami tujuan dan konsep utama materi.</li><li>Mengenali penerapan di dunia kerja melalui studi kasus.</li><li>Menyiapkan catatan untuk rangkuman dan kuis modul.</li></ul></div>
    </div>
  );
}

function SummaryLesson({ item, course, completed, onComplete }) {
  function downloadSummary() {
    const content = `RANGKUMAN MODUL\n${course.title}\n\n1. Pahami konsep dan tujuan utama.\n2. Gunakan alur kerja yang terstruktur.\n3. Terapkan materi melalui studi kasus.\n4. Evaluasi hasil dan lakukan perbaikan.\n\nVideoBelajar`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url; link.download = `rangkuman-${course.id}.txt`; link.click(); URL.revokeObjectURL(url);
    if (!completed) onComplete();
  }
  return (
    <div className="lesson-content summary-page">
      <div className="summary-visual"><i className="ri-file-text-line"></i><span>RANGKUMAN</span></div>
      <div className="lesson-copy"><div><span className="lesson-kicker">Bacaan Modul</span><h1>{item.title}</h1><p>Unduh rangkuman untuk mengulang konsep penting yang telah dipelajari.</p></div><button className="learning-primary" onClick={downloadSummary}><i className="ri-download-2-line"></i> Download Rangkuman</button></div>
      <div className="summary-grid"><article><b>01</b><h3>Konsep dasar</h3><p>Kenali tujuan, istilah, dan batasan materi.</p></article><article><b>02</b><h3>Alur kerja</h3><p>Ikuti langkah secara berurutan dan terukur.</p></article><article><b>03</b><h3>Praktik</h3><p>Terapkan pemahaman pada situasi nyata.</p></article></div>
    </div>
  );
}

function QuizLesson({ item, course, savedScore, onComplete, onRetry }) {
  const questions = useMemo(() => getQuestions(course.title, item.type), [course.title, item.type]);
  const [answers, setAnswers] = useState({});
  const [number, setNumber] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(savedScore);
  const isPretest = item.type === "pretest";

  function finish() {
    const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 10 : 0), 0);
    setResult(score); setConfirmOpen(false);
    if (isPretest || score >= 70) onComplete(score);
  }

  function retry() { setAnswers({}); setNumber(0); setResult(undefined); onRetry(); }

  if (result !== undefined) {
    const passed = isPretest || result >= 70;
    return (
      <div className="quiz-result lesson-content">
        <div className={`result-banner ${passed ? "pass" : "fail"}`}><span>{passed ? "CONGRATS" : "TRY AGAIN"}</span></div>
        <span className="lesson-kicker">Hasil {isPretest ? "Pre-Test" : "Quiz"}</span><h1>{passed ? "Aktivitas selesai!" : "Sedikit lagi!"}</h1>
        <div className="result-stats"><div><small>Nilai</small><b>{result}</b></div><div><small>Soal</small><b>10</b></div><div><small>Benar</small><b>{result / 10}</b></div><div><small>Salah</small><b>{10 - result / 10}</b></div></div>
        <p>{passed ? "Progresmu sudah disimpan. Lanjutkan ke aktivitas berikutnya." : "Nilai minimal adalah 70. Pelajari kembali materi lalu coba lagi."}</p>
        {!passed && <button className="learning-secondary" onClick={retry}><i className="ri-restart-line"></i> Ulangi Quiz</button>}
      </div>
    );
  }

  const question = questions[number];
  return (
    <div className="quiz-layout">
      <aside className="question-list"><h2>List Soal</h2><div>{questions.map((_, index) => <button key={index} className={`${number === index ? "active" : ""} ${answers[index] !== undefined ? "answered" : ""}`} onClick={() => setNumber(index)}>{index + 1}</button>)}</div><p>Jawab semua soal untuk menyelesaikan {isPretest ? "pre-test" : "quiz"}.</p></aside>
      <div className="question-card"><span className="lesson-kicker">{isPretest ? "Pre-Test" : "Quiz"} • 10 Pertanyaan</span><h1>Pertanyaan {number + 1}</h1><p>{question.question}</p><div className="answer-list">{question.options.map((option, index) => <label className={answers[number] === index ? "selected" : ""} key={option}><input type="radio" name={`question-${number}`} checked={answers[number] === index} onChange={() => setAnswers({ ...answers, [number]: index })} /><span>{option}</span></label>)}</div><div className="quiz-actions"><button className="learning-secondary" disabled={number === 0} onClick={() => setNumber(number - 1)}>Sebelumnya</button>{number < 9 ? <button className="learning-primary" onClick={() => setNumber(number + 1)}>Selanjutnya</button> : <button className="learning-primary finish" disabled={Object.keys(answers).length < 10} onClick={() => setConfirmOpen(true)}>Selesaikan</button>}</div></div>
      {confirmOpen && <div className="learning-modal-backdrop"><div className="learning-modal"><div className="modal-icon"><i className="ri-question-answer-line"></i></div><h2>Selesaikan {isPretest ? "Pre-Test" : "Quiz"}?</h2><p>Jawaban akan dihitung dan hasilnya disimpan ke progres kelas.</p><div><button className="learning-secondary" onClick={() => setConfirmOpen(false)}>Batal</button><button className="learning-primary" onClick={finish}>Selesai</button></div></div></div>}
    </div>
  );
}

function ReviewModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  return <div className="learning-modal-backdrop"><div className="learning-modal review-modal"><h2>Tulis Review Terbaikmu!</h2><p>Bagikan pengalaman belajarmu untuk membantu peserta lain.</p><div className="rating-input">{[1,2,3,4,5].map((star) => <button aria-label={`${star} bintang`} key={star} onClick={() => setRating(star)}><i className={star <= rating ? "ri-star-fill" : "ri-star-line"}></i></button>)}</div><textarea placeholder="Masukkan review" value={review} onChange={(event) => setReview(event.target.value)} /><div><button className="learning-secondary" onClick={onClose}>Batal</button><button className="learning-primary" disabled={!rating || !review.trim()} onClick={onSubmit}>Kirim Review</button></div></div></div>;
}

export default Learning;
