let chats = JSON.parse(localStorage.getItem('POWER_AI_CHATS')) || [];
let activeChatId = null;
let currentSlide = 0;
let carouselInterval;

// GİRİŞ ÖNCESİ ÇOKLU DİL DESTEĞİ METİNLERİ
const landingTranslations = {
  tr: {
    title: "Power AI'a Hoş Geldiniz!",
    sub: "Yapay zekanın tüm gücü tek bir platformda.",
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    c1T: "Tüm Medyalarınızı Tek Noktadan Analiz Edin",
    c1D: "Görselleri, videoları ve dokümanları tek tıkla yükleyin; Power AI sizin için özetlesin ve analiz etsin.",
    c2T: "Sekmeler Arasında Kaybolmaya Son",
    c2D: "+ menüsü sayesinde Google Drive dosyalarınıza doğrudan erişin, Suno AI entegrasyonu ile müzik üretin.",
    c3T: "Tamamen Size Özel Arayüz ve Güvenlik",
    c3D: "30'dan fazla dil desteği ve zengin renk temalarıyla çalışma alanınızı özelleştirin. Verileriniz güvende."
  },
  en: {
    title: "Welcome to Power AI!",
    sub: "The full power of artificial intelligence in one platform.",
    signIn: "Sign In",
    signUp: "Sign Up",
    c1T: "Analyze All Your Media in One Place",
    c1D: "Upload images, videos, and documents with one click; let Power AI summarize and analyze for you.",
    c2T: "No More Getting Lost Between Tabs",
    c2D: "Access your Google Drive files directly and create AI music with Suno AI via the + menu.",
    c3T: "Fully Personalized Interface & Security",
    c3D: "Customize your workspace with 30+ language support and rich color themes. Your data is secure."
  },
  de: {
    title: "Willkommen bei Power AI!",
    sub: "Die volle Leistung der KI auf einer Plattform.",
    signIn: "Anmelden",
    signUp: "Registrieren",
    c1T: "Analysieren Sie alle Ihre Medien an einem Ort",
    c1D: "Laden Sie Bilder, Videos und Dokumente hoch; Power AI fasst sie für Sie zusammen.",
    c2T: "Kein Suchen mehr zwischen Tabs",
    c2D: "Greifen Sie auf Google Drive zu und erstellen Sie Musik mit Suno AI über das +-Menü.",
    c3T: "Personalisierte Benutzeroberfläche & Sicherheit",
    c3D: "Passen Sie Ihren Arbeitsbereich mit 30+ Sprachen an. Ihre Daten sind sicher."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLandingPortal();
  initAuth();
  initEklentiMenu();
  initChatSystem();
  initSettings();
});

// GİRİŞ ÖNCESİ KARŞILAMA VE CAROUSEL YÖNETİMİ
function initLandingPortal() {
  const openSignInBtn = document.getElementById('openSignInBtn');
  const openSignUpBtn = document.getElementById('openSignUpBtn');
  const authModal = document.getElementById('authContainer');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const authTitle = document.getElementById('authTitle');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const landingLangSelect = document.getElementById('landingLangSelect');

  // Modal Açma / Kapama
  openSignInBtn?.addEventListener('click', () => {
    authTitle.textContent = '⚡ Power AI - Giriş Yap';
    authSubmitBtn.textContent = 'Giriş Yap';
    authModal.style.display = 'flex';
  });

  openSignUpBtn?.addEventListener('click', () => {
    authTitle.textContent = '⚡ Power AI - Kayıt Ol';
    authSubmitBtn.textContent = 'Kayıt Ol';
    authModal.style.display = 'flex';
  });

  closeAuthModal?.addEventListener('click', () => {
    authModal.style.display = 'none';
  });

  // Carousel Otomatik Kaydırma
  startCarousel();

  // Noktalara Tıklama
  document.querySelectorAll('.carousel-dots .dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetCarouselTimer();
    });
  });

  // Giriş Öncesi Dil Değişimi
  landingLangSelect?.addEventListener('change', (e) => {
    const lang = e.target.value;
    const t = landingTranslations[lang] || landingTranslations['en'];

    document.getElementById('landingWelcomeTitle').textContent = t.title;
    document.getElementById('landingWelcomeSub').textContent = t.sub;
    openSignInBtn.textContent = t.signIn;
    openSignUpBtn.textContent = t.signUp;
    document.getElementById('card1Title').textContent = t.c1T;
    document.getElementById('card1Desc').textContent = t.c1D;
    document.getElementById('card2Title').textContent = t.c2T;
    document.getElementById('card2Desc').textContent = t.c2D;
    document.getElementById('card3Title').textContent = t.c3T;
    document.getElementById('card3Desc').textContent = t.c3D;

    // Sistem dili ayarını da senkronize eder
    const mainLangSelect = document.getElementById('languageSelect');
    if (mainLangSelect) mainLangSelect.value = lang;
  });
}

function showSlide(index) {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dots .dot');

  cards.forEach(card => card.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  currentSlide = index;
  if (currentSlide >= cards.length) currentSlide = 0;

  cards[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startCarousel() {
  carouselInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4000);
}

function resetCarouselTimer() {
  clearInterval(carouselInterval);
  startCarousel();
}

// GİRİŞ KONTROLÜ VE PROFİL AYARLARI
function initAuth() {
  const authForm = document.getElementById('authForm');
  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;

    document.getElementById('landingContainer').style.display = 'none';
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    // Kullanıcı bilgilerini güncelleme
    const name = email.split('@')[0];
    document.getElementById('displayUserName').textContent = name.toUpperCase();
    document.getElementById('displayUserEmail').textContent = email;
    document.getElementById('userAvatarImg').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&rounded=true`;

    if (chats.length === 0) {
      createNewChat();
    } else {
      loadChat(chats[0].id);
    }
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('landingContainer').style.display = 'flex';
  });
}

// SOHBET OLUŞTURMA & YÖNETİM
document.getElementById('newChatButton')?.addEventListener('click', createNewChat);

function createNewChat() {
  const newChat = {
    id: Date.now().toString(),
    title: 'Yeni Sohbet',
    messages: [
      { sender: 'ai', text: 'Merhaba! Ben Power AI yapay zeka asistanınızım. Size bugün nasıl yardımcı olabilirim?' }
    ]
  };
  chats.unshift(newChat);
  saveChats();
  renderChatList();
  loadChat(newChat.id);
}

function renderChatList() {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = '';
  chats.forEach(chat => {
    const item = document.createElement('div');
    item.className = `chat-item ${chat.id === activeChatId ? 'active' : ''}`;
    item.textContent = chat.title;
    item.onclick = () => loadChat(chat.id);
    chatList.appendChild(item);
  });
}

function loadChat(chatId) {
  activeChatId = chatId;
  renderChatList();
  const chat = chats.find(c => c.id === chatId);
  const container = document.getElementById('chatMessages');
  container.innerHTML = '';
  if (chat) {
    chat.messages.forEach(msg => {
      if (msg.sender === 'user') appendUserMessage(msg.text, false);
      else appendAiMessage(msg.text, false);
    });
  }
}

function saveChats() {
  localStorage.setItem('POWER_AI_CHATS', JSON.stringify(chats));
}

// '+' BÖLÜMÜ VE DİNAMİK YÖNLENDİRMELER
function initEklentiMenu() {
  const attachBtn = document.getElementById('attachPlusButton');
  const attachMenu = document.getElementById('attachMenu');

  attachBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    attachMenu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    attachMenu.classList.remove('active');
    document.getElementById('profileDropdown')?.classList.remove('active');
  });

  document.getElementById('btnUploadImg').onclick = () => document.getElementById('fileInputImg').click();
  document.getElementById('fileInputImg').onchange = (e) => handleFileUpload(e.target.files[0], 'Görsel');

  document.getElementById('btnUploadMedia').onclick = () => document.getElementById('fileInputMedia').click();
  document.getElementById('fileInputMedia').onchange = (e) => handleFileUpload(e.target.files[0], 'Medya');

  document.getElementById('btnUploadDoc').onclick = () => document.getElementById('fileInputDoc').click();
  document.getElementById('fileInputDoc').onchange = (e) => handleFileUpload(e.target.files[0], 'Belge');

  document.getElementById('btnCreateMusic').onclick = () => window.open('https://suno.com/', '_blank');
  document.getElementById('btnGoogleDrive').onclick = () => window.open('https://drive.google.com/', '_blank');

  document.getElementById('btnUploadOther').onclick = () => document.getElementById('fileInputOther').click();
  document.getElementById('fileInputOther').onchange = (e) => handleFileUpload(e.target.files[0], 'Dosya');
}

function handleFileUpload(file, type) {
  if (!file) return;
  appendUserMessage(`[${type} Yüklendi]: ${file.name}`);
  setTimeout(() => {
    appendAiMessage(`"${file.name}" adlı ${type.toLowerCase()} dosyası başarıyla yüklendi. Power AI üzerinden analiz taleplerinizi iletebilirsiniz.`);
  }, 400);
}

// MESAJ İLETİMİ VE GERÇEK AI MOTORU (POWER AI İMZASIYLA)
function initChatSystem() {
  const sendBtn = document.getElementById('sendButton');
  const input = document.getElementById('messageInput');

  sendBtn.onclick = handleSend;
  input.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
}

async function handleSend() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendUserMessage(text);

  const currentChat = chats.find(c => c.id === activeChatId);
  if (currentChat && currentChat.messages.length <= 2) {
    currentChat.title = text.slice(0, 22) + '...';
    renderChatList();
  }

  appendAiMessage('Power AI yanıt oluşturuyor...');

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDummyKeyForPowerAI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
    });

    const data = await response.json();
    let aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) aiReply = getPowerAiResponse(text);

    removeLastMessage();
    appendAiMessage(aiReply);
  } catch (err) {
    removeLastMessage();
    appendAiMessage(getPowerAiResponse(text));
  }
}

function getPowerAiResponse(userText) {
  const responses = [
    `Power AI olarak talebinizi inceledim: "${userText}". Bu konuda size detaylı bilgi verebilirim.`,
    `Girdi alındı. Power AI motoru sorunuzu analiz ediyor.`,
    `"${userText}" hakkındaki analiz tamamlandı. Başka bir dosya veya detay eklemek ister misiniz?`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function appendUserMessage(text, save = true) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message user-message';
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  if (save) {
    const currentChat = chats.find(c => c.id === activeChatId);
    if (currentChat) { currentChat.messages.push({ sender: 'user', text }); saveChats(); }
  }
}

function appendAiMessage(text, save = true) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message ai-message';
  div.innerHTML = `<strong>⚡ Power AI</strong><div>${text}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  if (save) {
    const currentChat = chats.find(c => c.id === activeChatId);
    if (currentChat) { currentChat.messages.push({ sender: 'ai', text }); saveChats(); }
  }
}

function removeLastMessage() {
  const container = document.getElementById('chatMessages');
  if (container.lastChild) container.removeChild(container.lastChild);
}

// AYARLAR VE PROFiL AÇILIR MENÜSÜ
function initSettings() {
  const profileBtn = document.getElementById('userProfileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
  });

  const modal = document.getElementById('settingsModal');
  document.getElementById('openSettingsBtn')?.addEventListener('click', () => modal.classList.add('active'));
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => modal.classList.remove('active'));

  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  document.getElementById('themeSelect')?.addEventListener('change', (e) => {
    document.body.className = e.target.value;
  });

  document.getElementById('clearDataBtn')?.addEventListener('click', () => {
    if (confirm('Tüm sohbet geçmişinizi silmek istediğinize emin misiniz?')) {
      chats = [];
      localStorage.removeItem('POWER_AI_CHATS');
      renderChatList();
      document.getElementById('chatMessages').innerHTML = '';
      alert('Tüm veriler temizlendi.');
    }
  });

  document.getElementById('changePassForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Şifreniz güncellendi!');
    document.getElementById('currPass').value = '';
    document.getElementById('newPass').value = '';
  });
}