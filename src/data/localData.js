import courses from "./courses";

export const COURSE_KEY = "videobelajar_courses";
// Versi 2 digunakan supaya data contoh dari versi lama tidak ikut terbaca.
export const ORDER_KEY = "videobelajar_orders_v2";
export const CLASS_KEY = "videobelajar_classes_v2";
export const PROFILE_KEY = "videobelajar_profile";
export const REGISTERED_USER_KEY = "videobelajar_registered_user";
export const PAYMENT_DURATION_SECONDS = 3055;

// Mengambil data kelas dari database lokal browser.
export function getCourses() {
  const savedData = localStorage.getItem(COURSE_KEY);
  return savedData ? JSON.parse(savedData) : courses;
}

export function saveCourses(data) {
  localStorage.setItem(COURSE_KEY, JSON.stringify(data));
}

export function getCourseById(id) {
  return getCourses().find((course) => course.id === Number(id));
}

export function getOrders() {
  const savedData = localStorage.getItem(ORDER_KEY);
  const orders = savedData ? JSON.parse(savedData) : [];
  const now = Date.now();
  let hasExpiredOrder = false;

  const synchronizedOrders = orders.map((order) => {
    if (order.status === "Belum Bayar" && Number(order.expiresAt) <= now) {
      hasExpiredOrder = true;
      return { ...order, status: "Gagal", failedAt: now };
    }

    return order;
  });

  if (hasExpiredOrder) saveOrders(synchronizedOrders);
  return synchronizedOrders;
}

export function saveOrders(data) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(data));
}

export function createPendingOrder({ courseId, paymentMethod, existingOrderId }) {
  const now = Date.now();
  const expiresAt = now + (PAYMENT_DURATION_SECONDS * 1000);
  const orders = getOrders();
  const existingOrder = orders.find((order) => order.id === existingOrderId && order.status === "Belum Bayar");
  const order = {
    ...existingOrder,
    id: existingOrder?.id || `HEL/VI/${String(courseId).padStart(6, "0")}/${String(now).slice(-6)}`,
    courseId,
    paymentMethod,
    status: "Belum Bayar",
    date: formatOrderDate(now),
    createdAt: existingOrder?.createdAt || now,
    expiresAt,
    itemPrice: 767500,
    adminFee: 7000,
    amount: 774500,
  };

  saveOrders([order, ...orders.filter((item) => item.id !== order.id)]);
  return order;
}

export function failOrder(orderId) {
  const orders = getOrders();
  const now = Date.now();
  saveOrders(orders.map((order) => (
    order.id === orderId && order.status === "Belum Bayar"
      ? { ...order, status: "Gagal", failedAt: now }
      : order
  )));
}

export function completeOrder({ orderId, courseId }) {
  const orders = getOrders();
  const referencedOrder = orderId ? orders.find((order) => order.id === orderId) : null;
  const pendingOrder = orders.find((order) => (
    order.status === "Belum Bayar"
    && (order.id === orderId || (!orderId && order.courseId === courseId))
  ));
  const now = Date.now();

  // Efek React dapat dijalankan lebih dari sekali pada mode development.
  // Invoice yang sudah pernah diproses harus tetap menjadi operasi yang sama.
  if (referencedOrder && referencedOrder.status !== "Belum Bayar") {
    return referencedOrder.id;
  }

  if (pendingOrder) {
    saveOrders(orders.map((order) => (
      order.id === pendingOrder.id
        ? { ...order, status: "Berhasil", paidAt: now, date: formatOrderDate(now) }
        : order
    )));
    return pendingOrder.id;
  }

  const completedOrder = orders.find((order) => order.courseId === courseId && order.status === "Berhasil");
  if (completedOrder) return completedOrder.id;

  const invoice = `HEL/VI/${String(courseId).padStart(6, "0")}/${String(now).slice(-6)}`;
  saveOrders([{
    id: invoice,
    courseId,
    status: "Berhasil",
    date: formatOrderDate(now),
    createdAt: now,
    paidAt: now,
    itemPrice: 767500,
    adminFee: 7000,
    amount: 774500,
  }, ...orders]);
  return invoice;
}

function formatOrderDate(timestamp) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function getMyClasses() {
  const savedData = localStorage.getItem(CLASS_KEY);
  const classes = savedData ? JSON.parse(savedData) : [];
  return classes.map((item) => {
    const progress = Math.max(0, Math.min(100, Number(item.progress) || 0));
    return {
      ...item,
      progress,
      status: progress === 100 ? "Selesai" : progress > 0 ? "Sedang Berjalan" : "Belum Dimulai",
      completedItemIds: Array.isArray(item.completedItemIds) ? item.completedItemIds : [],
      scores: item.scores && typeof item.scores === "object" ? item.scores : {},
    };
  });
}

export function saveMyClasses(data) {
  localStorage.setItem(CLASS_KEY, JSON.stringify(data));
}

export function getMyClass(courseId) {
  return getMyClasses().find((item) => item.courseId === Number(courseId));
}

export function saveClassLearning(courseId, learning) {
  const classes = getMyClasses();
  const numericId = Number(courseId);
  const current = classes.find((item) => item.courseId === numericId) || {
    courseId: numericId,
    progress: 0,
    status: "Belum Dimulai",
    completedItemIds: [],
    scores: {},
  };
  const updated = { ...current, ...learning, updatedAt: Date.now() };
  const next = [updated, ...classes.filter((item) => item.courseId !== numericId)];
  saveMyClasses(next);
  return updated;
}
