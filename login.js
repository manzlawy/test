window.addEventListener("load", async () => {
  try {
    await Clerk.load();

    const signInEl  = document.getElementById("sign-in");
    const signUpEl  = document.getElementById("sign-up");
    const mainEl    = document.getElementById("main-content");
    const nameEl    = document.getElementById("studentNameDisplay");
    const userBtnEl = document.getElementById("user-button");

    // 🔹 خزّن الرابط الحالي إذا المستخدم مش مسجّل دخول
    if (!Clerk.user && !sessionStorage.getItem("clerk:returnTo")) {
      sessionStorage.setItem("clerk:returnTo", window.location.href);
    }

    // 🔹 دالة لإرجاع المستخدم للرابط المحفوظ أو الصفحة الحالية
    const getReturnTo = () => {
      return sessionStorage.getItem("clerk:returnTo") || window.location.href;
    };

    // عرض التطبيق
    const showApp = () => {
      if (signInEl) signInEl.style.display = "none";
      if (signUpEl) signUpEl.style.display = "none";
      if (mainEl) mainEl.style.display = "block";

      if (nameEl) {
        nameEl.textContent = `مرحباً بالدكتور/ة ${Clerk.user?.firstName || "طالب"}`;
        nameEl.style.display = "block";
      }

      if (userBtnEl) {
        Clerk.mountUserButton(userBtnEl, {
          appearance: { elements: { avatarBox: { width: "40px", height: "40px" } } }
        });
      }
    };

    // عرض واجهات SignIn / SignUp بدون redirect تلقائي
    const showAuth = () => {
      if (mainEl) mainEl.style.display = "none";

      if (signInEl) {
        Clerk.mountSignIn(signInEl, {
          afterSignInUrl: getReturnTo() // ارجع للرابط المحفوظ
        });
      }

      if (signUpEl) {
        Clerk.mountSignUp(signUpEl, {
          afterSignUpUrl: getReturnTo() // ارجع للرابط المحفوظ
        });
      }
    };

    // إذا المستخدم مسجّل دخول بالفعل
    if (Clerk.user) {
      const returnTo = getReturnTo();
      sessionStorage.removeItem("clerk:returnTo"); // امسح القيمة بعد الرجوع
      if (returnTo !== window.location.href) {
        window.location.replace(returnTo);
        return;
      }
      showApp();
    } else {
      showAuth();
    }

    // استمع لتغيير حالة المستخدم بعد SignIn / SignUp
    Clerk.addListener(({ user }) => {
      if (user) {
        const returnTo = getReturnTo();
        sessionStorage.removeItem("clerk:returnTo");
        if (returnTo !== window.location.href) {
          window.location.replace(returnTo);
        } else {
          showApp();
        }
      }
    });

  } catch (error) {
    console.error("خطأ في Clerk:", error);
  }
});
