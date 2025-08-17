  // 🟢 بيانات Supabase الخاصة بمشروعك
  const SUPABASE_URL = "https://pxwudmajnuxpnetxaixc.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4d3VkbWFqbnV4cG5ldHhhaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTg1MDgsImV4cCI6MjA3MTAzNDUwOH0.7xpONyH5i_Kt2zeZ2iyh_32qaQFCdvguwv5gp3yaRgo";

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const popup = document.getElementById("class-popup");
  const saveBtn = document.getElementById("save-class");
  const classSelect = document.getElementById("class-select");
  const checkBtn = document.getElementById("check-class-btn");

  // ✅ عرض البوب أب
  function showPopup() {
    popup.classList.remove("hidden");
  }

  // ✅ إخفاء البوب أب
  function hidePopup() {
    popup.classList.add("hidden");
  }

  // ✅ جلب الصف الدراسي
  async function fetchClass(userId) {
    const { data, error } = await supabase
      .from("students_classes")
      .select("class_name")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching class:", error.message);
      return null;
    }
    return data?.class_name;
  }

  // ✅ حفظ الصف الدراسي
  async function saveClass(userId, className) {
    const { error } = await supabase
      .from("students_classes")
      .upsert({ user_id: userId, class_name: className });

    if (error) {
      console.error("Error saving class:", error.message);
      alert("حصل خطأ فى الحفظ ❌");
    } else {
      alert("تم حفظ الصف الدراسي بنجاح ✅");
      hidePopup();
    }
  }

  // ✅ أول ما يدخل المستخدم
  window.addEventListener("load", async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const userId = user.id;
      const className = await fetchClass(userId);

      if (!className) {
        showPopup();
      }
    }
  });

  // ✅ عند الضغط على زرار الحفظ
  saveBtn.addEventListener("click", async () => {
    const className = classSelect.value;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("محتاج تسجل دخول الأول!");
      return;
    }

    if (!className) {
      alert("اختر الصف الدراسي أولاً!");
      return;
    }

    await saveClass(user.id, className);
  });

  // ✅ عند الضغط على زرار "تحقق"
  checkBtn.addEventListener("click", () => {
    showPopup();
  });

