import './styles.css';
import React, { useState, useEffect } from "react";
import { auth, loginWithGoogle, logoutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Oturum durumunu takip et
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Kullanıcı"
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const res = await loginWithGoogle();
    if (!res.success) {
      alert("Giriş yapılamadı: " + res.error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Bot yanıtı simülasyonu
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "Power AI yanıtı: Mesajınızı aldım!",
        sender: "bot"
      };
      setMessages((prev) => [...prev, prev ? [...prev, botMessage] : [botMessage]]);
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#0b0f19", color: "#60a5fa" }}>
        Yükleniyor...
      </div>
    );
  }

  // GİRİŞ YAPILMAMIŞSA: Şık Arka Plan Görselli & Tanıtımlı Ana Giriş Ekranı
  if (!user) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#0b0f19", 
        backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.75), rgba(11, 15, 25, 0.95)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#f3f4f6",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* ÜST BAR */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.4rem", fontWeight: "800", color: "#60a5fa" }}>
            <span>⚡</span>
            <span>Power AI</span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select style={{ backgroundColor: "rgba(30, 41, 59, 0.8)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 12px", borderRadius: "8px" }}>
              <option value="tr">TR Türkçe</option>
              <option value="en">EN English</option>
            </select>
            <button onClick={handleLogin} style={{ padding: "8px 16px", backgroundColor: "#1e293b", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Giriş Yap
            </button>
            <button onClick={handleLogin} style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Kayıt Ol
            </button>
          </div>
        </header>

        {/* ORTA TANITIM ALANI */}
        <main style={{ maxwidth: "1000px", margin: "40px auto", padding: "0 20px", textAlign: "center", flex: 1 }}>
          <h1 style={{ background: "linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "2.8rem", fontWeight: "800", marginBottom: "12px" }}>
            Power AI'a Hoş Geldiniz!
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "40px" }}>
            Yapay zekanın tüm gücü tek bir platformda.
          </p>

          {/* KARTLAR */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", textAlign: "left", marginBottom: "40px" }}>
            <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🖼️ 📄 📹</div>
              <h3 style={{ color: "#60a5fa", marginBottom: "8px" }}>Tüm Medyalarınızı Tek Noktadan Analiz Edin</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>Görselleri, videoları ve dokümanları tek tıkla yükleyin; Power AI sizin için özetlesin ve analiz etsin.</p>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🎵 ☁️</div>
              <h3 style={{ color: "#60a5fa", marginBottom: "8px" }}>Sekmeler Arasında Kaybolmaya Son</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>+ menüsü sayesinde Google Drive dosyalarınıza doğrudan erişin, Suno AI entegrasyonu ile müzik üretin.</p>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🎨 🌐 🛡️</div>
              <h3 style={{ color: "#60a5fa", marginBottom: "8px" }}>Tamamen Size Özel Arayüz ve Güvenlik</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>30'dan fazla dil desteği ve zengin renk temalarıyla çalışma alanınızı özelleştirin. Verileriniz güvende.</p>
            </div>
          </div>

          {/* GOOGLE İLE GİRİŞ BUTONU VE KVKK METNİ */}
          <div style={{ maxwidth: "420px", margin: "0 auto", background: "rgba(15, 23, 42, 0.85)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(16px)" }}>
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "16px"
              }}
            >
              Google ile Giriş Yap
            </button>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px" }}>
              🔒 <strong>KVKK & Gizlilik Bildirimi:</strong> Google ile giriş yaptığınızda kişisel verileriniz saklanmaz. Oturumunuz tamamen anonim kimlik kodu üzerinden yürütülür.
            </div>
          </div>
        </main>
      </div>
    );
  }

  // GİRİŞ YAPILMIŞSA: Ana Chat Arayüzü
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#0b0f19", color: "#f3f4f6" }}>
      {/* Üst Bar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", backgroundColor: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h2 style={{ margin: 0, background: "linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "800" }}>
          Power AI Chatbot
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "14px", color: "#94a3b8" }}>Hoş geldin, <strong style={{ color: "#ffffff" }}>{user.displayName}</strong></span>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 14px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Mesaj Alanı */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>Henüz mesaj yok. Bir şeyler yazarak sohbeti başlatın!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#2563eb" : "#1e293b",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "16px",
                maxWidth: "70%",
                wordBreak: "break-word",
                border: msg.sender === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Mesaj Gönderme Formu */}
      <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "15px", backgroundColor: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{ flex: 1, padding: "12px 16px", backgroundColor: "#1e293b", color: "#ffffff", border: "1px solid #334155", borderRadius: "20px", outline: "none", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}