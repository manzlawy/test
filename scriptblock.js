 document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('🚫 ممنوع الضغط بالزر اليمين في هذا الموقع');
  });

  // منع اختصارات فتح أدوات المطور (Ctrl+Shift+I أو F12 أو Ctrl+U)
  document.addEventListener('keydown', function(e) {
    if (e.keyCode == 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.keyCode == 85)) { // Ctrl+U
      e.preventDefault();
      alert('🚫 الوصول للكود ممنوع');
    }
  });