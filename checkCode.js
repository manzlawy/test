(function(){
    const savedCode = localStorage.getItem("userCode");
    const storedCodes = JSON.parse(localStorage.getItem("codes") || "[]");
    const EXPIRY_DAYS = 30;

    // دالة للتحقق من صلاحية الكود
    function isCodeValid(code) {
        const now = Date.now();
        return storedCodes.some(c => {
            const notExpired = (now - c.created) < (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            return c.code === code && notExpired;
        });
    }

    // لو الكود مش موجود أو غير صالح → مسحه وحول المستخدم
    if (!savedCode || !isCodeValid(savedCode)) {
        localStorage.removeItem("userCode"); // مسح الكود القديم
        window.location.href = "code-entry.html"; // تحويل لصفحة إدخال الكود
    }
})();
