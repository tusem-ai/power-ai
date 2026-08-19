// ==========================================
// KULLANICI GİRİŞ VE KAYIT YÖNETİMİ
// ==========================================

const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitButton = document.getElementById('authSubmitButton');
const authMessage = document.getElementById('authMessage');
const currentUserEmail = document.getElementById('currentUserEmail');
const logoutButton = document.getElementById('logoutButton');

// Giriş Ekranını Kapatıp Ana Uygulamayı Açan Fonksiyon
function showAppScreen(user) {
  if (authScreen) {
    authScreen.setAttribute('hidden', 'true');
    authScreen.style.setProperty('display', 'none', 'important');
  }
  
  if (appScreen) {
    appScreen.removeAttribute('hidden');
    appScreen.style.setProperty('display', 'flex', 'important');
  }

  if (currentUserEmail && user) {
    currentUserEmail.textContent = user.email;
  }
}

// Giriş Ekranını Gösteren Fonksiyon
function showAuthScreen() {
  if (authScreen) {
    authScreen.removeAttribute('hidden');
    authScreen.style.setProperty('display', 'flex', 'important');
  }
  
  if (appScreen) {
    appScreen.setAttribute('hidden', 'true');
    appScreen.style.setProperty('display', 'none', 'important');
  }
}

// Oturum Kontrolü ve Dinleyici
function initAuth() {
  if (typeof supabaseClient === 'undefined') return;

  // 1. Mevcut Oturumu Kontrol Et
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user) {
      showAppScreen(session.user);
    } else {
      showAuthScreen();
    }
  });

  // 2. Oturum Değişikliğini Dinle
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      showAppScreen(session.user);
    } else {
      showAuthScreen();
    }
  });
}

// Form Gönderildiğinde
if (authForm) {
  authForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = authEmail ? authEmail.value.trim() : '';
    const password = authPassword ? authPassword.value.trim() : '';

    if (!email || !password) {
      if (authMessage) authMessage.textContent = 'Lütfen tüm alanları doldurun.';
      return;
    }

    if (authMessage) authMessage.textContent = 'Giriş yapılıyor...';
    if (authSubmitButton) authSubmitButton.disabled = true;

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      if (data && data.user) {
        if (authMessage) authMessage.textContent = 'Giriş başarılı!';
        showAppScreen(data.user);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (authMessage) {
        authMessage.textContent = 'Hata: ' + (error.message || 'Giriş yapılamadı.');
      }
    } finally {
      if (authSubmitButton) authSubmitButton.disabled = false;
    }
  });
}

// Çıkış Butonu
if (logoutButton) {
  logoutButton.addEventListener('click', async function () {
    if (typeof supabaseClient !== 'undefined') {
      await supabaseClient.auth.signOut();
    }
    showAuthScreen();
  });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', initAuth);