import { useCourses } from "../hooks/useCourses";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentHeader from "../components/PaymentHeader";
import CheckoutCourseCard from "../components/CheckoutCourseCard";
import {
  createPendingOrder,
  failOrder,
  PAYMENT_DURATION_SECONDS,
} from "../data/localData";
import "../mission.css";

const bankLogos = {
  bca: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bank_Central_Asia.svg",
  bni: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bank_Negara_Indonesia_logo_(2004).svg",
  bri: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BRI_2025.svg",
  mandiri: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bank_Mandiri_logo_2016.svg",
};

function bankMethod(id, name, account) {
  return {
    id,
    name: `Bank ${name}`,
    logo: bankLogos[id],
    description: `Bayar melalui Virtual Account ${name}`,
    accountLabel: `Nomor Virtual Account ${name}`,
    account,
    instructions: [
      {
        title: `ATM ${name}`,
        steps: [
          `Masukkan kartu ATM dan PIN ${name} Anda`,
          "Pilih menu pembayaran atau transfer Virtual Account",
          `Masukkan nomor Virtual Account ${name} yang tertera di atas`,
          "Periksa nama penerima dan total pembayaran",
          "Konfirmasi transaksi dan simpan bukti pembayaran",
        ],
      },
      {
        title: `Mobile Banking ${name}`,
        steps: [
          `Buka aplikasi mobile banking ${name}`,
          "Pilih menu pembayaran atau Virtual Account",
          "Masukkan nomor Virtual Account yang tertera di atas",
          "Periksa rincian pesanan lalu konfirmasi pembayaran",
          "Masukkan PIN untuk menyelesaikan transaksi",
        ],
      },
    ],
  };
}

function walletMethod(id, name, logo, account) {
  return {
    id,
    name,
    logo,
    description: `Bayar langsung melalui aplikasi ${name}`,
    accountLabel: `Nomor tujuan ${name}`,
    account,
    instructions: [
      {
        title: `Aplikasi ${name}`,
        steps: [
          `Buka aplikasi ${name} di ponsel Anda`,
          "Pilih menu Bayar, Transfer, atau Scan",
          `Masukkan nomor tujuan ${name} yang tertera di atas`,
          "Pastikan nama penerima dan total pembayaran sudah benar",
          `Konfirmasi pembayaran menggunakan PIN ${name}`,
          "Simpan bukti transaksi sampai pesanan dinyatakan berhasil",
        ],
      },
    ],
  };
}

const paymentGroups = [
  {
    id: "bank",
    title: "Transfer Bank",
    items: [
      bankMethod("bca", "BCA", "11739 081234567890"),
      bankMethod("bni", "BNI", "8808 081234567890"),
      bankMethod("bri", "BRI", "12808 081234567890"),
      bankMethod("mandiri", "Mandiri", "89508 081234567890"),
    ],
  },
  {
    id: "wallet",
    title: "E-Wallet",
    items: [
      walletMethod("dana", "DANA", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_dana_blue.svg", "0812 3456 7890"),
      walletMethod("ovo", "OVO", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_ovo_purple.svg", "0812 3456 7890"),
      walletMethod("gopay", "GoPay", "https://commons.wikimedia.org/wiki/Special:Redirect/file/GoPay_logo.svg", "0812 3456 7890"),
      walletMethod("linkaja", "LinkAja", "https://commons.wikimedia.org/wiki/Special:Redirect/file/LinkAja.svg", "0812 3456 7890"),
      walletMethod("shopee", "ShopeePay", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shopee_logo.svg", "0812 3456 7890"),
    ],
  },
  {
    id: "card",
    title: "Kartu Kredit/Debit",
    items: [{
      id: "card",
      name: "Kartu Kredit atau Debit",
      description: "Bayar menggunakan kartu kredit atau debit",
      accountLabel: "Informasi kartu",
      account: "Masukkan data kartu pada tahap konfirmasi",
      hideCopyButton: true,
      logos: [
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mastercard_2019_logo.svg",
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Visa_Inc._logo_(2021%E2%80%93present).svg",
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/JCB_logo.svg",
      ],
      instructions: [{
        title: "Kartu Kredit/Debit",
        steps: [
          "Masukkan nomor kartu, masa berlaku, dan kode CVV",
          "Periksa kembali total pembayaran",
          "Tekan tombol Bayar Sekarang",
          "Selesaikan verifikasi keamanan dari bank penerbit kartu",
          "Tunggu sampai status pesanan dinyatakan berhasil",
        ],
      }],
    }],
  },
];

const paymentMethods = paymentGroups.flatMap((group) => group.items);

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: courseList } = useCourses();
  const course = courseList.find(item => String(item.id) === String(id));
  const [selectedMethod, setSelectedMethod] = useState("bca");
  const [openGroups, setOpenGroups] = useState({ bank: true, wallet: true, card: true });
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_DURATION_SECONDS);
  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod);

  useEffect(() => {
    if (!showInstructions || !expiresAt) return undefined;

    function updateCountdown() {
      setTimeLeft(Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0));
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [showInstructions, expiresAt]);

  useEffect(() => {
    if (showInstructions && timeLeft === 0 && currentOrderId) {
      failOrder(currentOrderId);
    }
  }, [showInstructions, timeLeft, currentOrderId]);

  if (!course) return <p className="page-message">Kelas tidak ditemukan.</p>;

  const hour = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minute = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const second = String(timeLeft % 60).padStart(2, "0");
  const isExpired = showInstructions && timeLeft === 0;

  function toggleGroup(groupId) {
    setOpenGroups((groups) => ({ ...groups, [groupId]: !groups[groupId] }));
  }

  function handleBuyNow() {
    const order = createPendingOrder({
      courseId: course.id,
      paymentMethod: selectedPaymentMethod.id,
      existingOrderId: currentOrderId,
    });

    setCurrentOrderId(order.id);
    setExpiresAt(order.expiresAt);
    setTimeLeft(PAYMENT_DURATION_SECONDS);
    setShowInstructions(true);
  }

  function handlePayment() {
    if (isExpired || !currentOrderId) return;
    navigate(`/pembayaran/sukses/${course.id}?orderId=${encodeURIComponent(currentOrderId)}`);
  }

  return (
    <div className="checkout-page">
      <PaymentHeader step={showInstructions ? 2 : 1} />

      {showInstructions && (
        <div className={isExpired ? "countdown-bar expired" : "countdown-bar"}>
          {isExpired ? (
            <strong>Waktu pembayaran habis. Pesanan dipindahkan ke status Gagal.</strong>
          ) : (
            <>Selesaikan pemesanan dalam <b>{hour}</b> : <b>{minute}</b> : <b>{second}</b></>
          )}
        </div>
      )}

      <main className="checkout-container">
        <div className="checkout-main-column">
          {!showInstructions ? (
            <section className="checkout-box">
              <h2>Metode Pembayaran</h2>
              {paymentGroups.map((group) => (
                <div className="payment-group" key={group.title}>
                  <button
                    type="button"
                    className="payment-group-title"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={openGroups[group.id]}
                  >
                    {group.title}
                    <i className={openGroups[group.id] ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                  </button>
                  {openGroups[group.id] && group.items.map((method) => (
                    <button
                      type="button"
                      className={selectedMethod === method.id ? "payment-option selected" : "payment-option"}
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <span className="payment-option-name"><PaymentLogo method={method} /> {method.name}</span>
                      {selectedMethod === method.id && <i className="ri-checkbox-circle-fill"></i>}
                    </button>
                  ))}
                </div>
              ))}
            </section>
          ) : (
            <section className="checkout-box">
              <h2>Metode Pembayaran</h2>
              <div className="virtual-account">
                <strong><PaymentLogo method={selectedPaymentMethod} /> {selectedPaymentMethod.name}</strong>
                <p>{selectedPaymentMethod.description}</p>
                <small>{selectedPaymentMethod.accountLabel}</small>
                <div>
                  <b>{selectedPaymentMethod.account}</b>
                  {!selectedPaymentMethod.hideCopyButton && (
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(selectedPaymentMethod.account.replaceAll(" ", ""))}
                    >
                      Salin
                    </button>
                  )}
                </div>
              </div>

              <OrderSummary course={course} />
              <div className="checkout-actions two-buttons">
                <button className="outline-button" onClick={() => setShowInstructions(false)}>Ganti Metode Pembayaran</button>
                <button className="green-button" disabled={isExpired} onClick={handlePayment}>
                  {isExpired ? "Pembayaran Kedaluwarsa" : "Bayar Sekarang"}
                </button>
              </div>
            </section>
          )}

          {!showInstructions && (
            <section className="checkout-box summary-box">
              <OrderSummary course={course} />
              <button className="green-button full-button" onClick={handleBuyNow}>Beli Sekarang</button>
            </section>
          )}

          {showInstructions && (
            <section className="checkout-box instruction-box">
              <h2>Tata Cara Pembayaran {selectedPaymentMethod.name}</h2>
              {selectedPaymentMethod.instructions.map((item) => (
                <details key={item.title}>
                  <summary>{item.title}</summary>
                  <ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                </details>
              ))}
            </section>
          )}
        </div>
        <CheckoutCourseCard course={course} />
      </main>
    </div>
  );
}

function PaymentLogo({ method }) {
  if (method.logos) {
    return (
      <span className="payment-card-logos" aria-hidden="true">
        {method.logos.map((logo) => <img src={logo} alt="" key={logo} />)}
      </span>
    );
  }

  return <img className={`payment-brand-logo ${method.id}`} src={method.logo} alt={method.name} />;
}

function OrderSummary({ course }) {
  return (
    <div className="order-summary">
      <h2>Ringkasan Pesanan</h2>
      <div><span>Video Learning: {course.title}</span><b>Rp 767.500</b></div>
      <div><span>Biaya Admin</span><b>Rp 7.000</b></div>
      <div className="summary-total"><span>Total Pembayaran</span><b>Rp 774.500</b></div>
    </div>
  );
}

export default Payment;
