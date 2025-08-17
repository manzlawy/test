// checktheclass.js

// ✅ الاتصال مع Neon DB
const sql = window.neon(
  "postgresql://neondb_owner:npg_i6shUjkuB2cl@ep-sparkling-pine-af3w4uq9-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require"
);

const popup = document.getElementById("class-popup");
const saveBtn = document.getElementById("save-class");
const classSelect = document.getElementById("class-select");
const checkBtn = document.getElementById("check-class-btn");

// ✅ إنشاء الجدول لو مش موجود
async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      class_name TEXT
    )
  `;
}

// ✅ جلب الصف الدراسي من Neon
async function fetchClass(userId) {
  const rows = await sql`SELECT class_name FROM students WHERE id = ${userId}`;
  return rows.length ? rows[0].class_name : null;
}

// ✅ حفظ أو تحديث الصف الدراسي
async function saveClass(userId, className) {
  await sql`
    INSERT INTO students (id, class_name)
    VALUES (${userId}, ${className})
    ON CONFLICT (id) DO UPDATE SET class_name = ${className}
  `;
}

// ✅ عرض البوكس
function showPopup() {
  popup.classList.remove("hidden");
}

// ✅ إخفاء البوكس
function hidePopup() {
  popup.classList.add("hidden");
}

// ✅ أول ما يدخل اليوزر
window.addEventListener("load", async () => {
  await Clerk.load();
  if (Clerk.user) {
    const userId = Clerk.user.id;

    await initDB();
    const className = await fetchClass(userId);

    if (!className) {
      showPopup();
    }
  }
});

// ✅ عند الضغط على زرار الحفظ
saveBtn.addEventListener("click", async () => {
  const className = classSelect.value;
  const userId = Clerk.user.id;

  await saveClass(userId, className);
  hidePopup();
});

// ✅ عند الضغط على زرار "تحقق من صفك الدراسي"
checkBtn.addEventListener("click", () => {
  showPopup();
});
