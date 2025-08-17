// checktheclass.js — LocalStorage + Clerk integration (no backend)

(function () {
  // عناصر الواجهة
  const popup       = document.getElementById("class-popup");
  const saveBtn     = document.getElementById("save-class");
  const classSelect = document.getElementById("class-select");
  const checkBtn    = document.getElementById("check-class-btn");
  const badgeEl     = document.getElementById("current-class-badge");
  const userMetaEl  = document.getElementById("userMeta");

  // مفاتيح التخزين: نخزن لكل مستخدم key منفصل
  const keyFor = (userId) => `gelvano:profile:${userId}`;

  const readProfile = (userId) => {
    try { return JSON.parse(localStorage.getItem(keyFor(userId)) || "null"); }
    catch { return null; }
  };

  const writeProfile = (userId, profile) => {
    localStorage.setItem(keyFor(userId), JSON.stringify(profile));
  };

  // UI helpers
  const showPopup = () => {
    popup.classList.remove("gv-hidden");
    document.body.classList.add("gv-no-scroll");
    // فوكس على السلكت لسهولة الإختيار
    setTimeout(() => classSelect?.focus(), 30);
  };

  const hidePopup = () => {
    popup.classList.add("gv-hidden");
    document.body.classList.remove("gv-no-scroll");
  };

  const updateBadge = (className) => {
    if (!badgeEl) return;
    if (className) {
      badgeEl.textContent = `صفك: ${className}`;
      badgeEl.classList.remove("gv-hidden");
    } else {
      badgeEl.classList.add("gv-hidden");
      badgeEl.textContent = "";
    }
  };

  // منع إغلاق البوب أب بالضغط خارج الكرت
  popup?.addEventListener("click", (e) => {
    const card = e.target.closest(".gv-popup__card");
    if (!card) {
      // مفيش إلغاء.. تجاهل أي ضغط على الخلفية
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  // تحميل Clerk ثم المنطق كله
  const init = async () => {
    try { await Clerk.load(); } catch (e) { console.error("Clerk load error:", e); }

    const ensureForUser = (user) => {
      // اظهار/اخفاء زرار و بادج حسب حالة الدخول
      if (!user) {
        updateBadge(null);
        checkBtn?.classList.add("gv-hidden");
        hidePopup();
        return;
      }
      checkBtn?.classList.remove("gv-hidden");

      // بيانات المستخدم للعرض في البوب أب
      const firstName = user.firstName || user.username || "";
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";

      if (userMetaEl) {
        userMetaEl.textContent = [firstName && `الاسم: ${firstName}`, email && `البريد: ${email}`]
          .filter(Boolean).join(" • ");
      }

      // قراءة بروفايل المستخدم
      const existing = readProfile(user.id);
      const savedClass = existing?.className || null;
      updateBadge(savedClass);

      // أول مرة: لازم يختار صف
      if (!savedClass) {
        classSelect.value = "";
        showPopup();
      }
    };

    // حالة حالية
    ensureForUser(Clerk.user);

    // أي تغيير في الجلسة
    Clerk.addListener(({ user }) => {
      ensureForUser(user);
    });

    // زر التحفظ
    saveBtn?.addEventListener("click", () => {
      const user = Clerk.user;
      if (!user) return;

      const className = classSelect.value;
      if (!className) {
        alert("اختر الصف الدراسي أولًا!");
        classSelect.focus();
        return;
      }

      // نجمع بيانات المستخدم ونحفظها
      const profile = {
        userId: user.id,
        className,
        firstName: user.firstName || user.username || "",
        username: user.username || "",
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
        savedAt: new Date().toISOString()
      };
      writeProfile(user.id, profile);
      updateBadge(className);
      hidePopup();
      alert("تم حفظ الصف الدراسي بنجاح ✅");
    });

    // زر التحقق (لفتح البوب أب وقت ما يحب يغير الصف)
    checkBtn?.addEventListener("click", () => {
      const user = Clerk.user;
      if (!user) return;
      const existing = readProfile(user.id);
      if (existing?.className) {
        classSelect.value = existing.className;
      }
      showPopup();
    });
  };

  // شغّل بعد تحميل الصفحة
  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();
