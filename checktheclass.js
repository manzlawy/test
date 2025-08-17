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

  // ✅ جلب الصف الدراسي من localStorage
  function fetchClass() {
    return localStorage.getItem("class_name");
  }

  // ✅ حفظ الصف الدراسي في localStorage
  function saveClass(className) {
    localStorage.setItem("class_name", className);
    alert("تم حفظ الصف الدراسي ✅");
    hidePopup();
  }

  // ✅ أول ما يدخل المستخدم
  window.addEventListener("load", () => {
    const className = fetchClass();
    if (!className) {
      showPopup();
    }
  });

  // ✅ عند الضغط على زرار الحفظ
  saveBtn.addEventListener("click", () => {
    const className = classSelect.value;
    if (!className) {
      alert("اختر الصف الدراسي أولاً!");
      return;
    }
    saveClass(className);
  });

  // ✅ زرار تحقق
  checkBtn.addEventListener("click", () => {
    showPopup();
  });
