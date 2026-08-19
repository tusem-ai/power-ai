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
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#0b0f19", color: "#60a5fa" }}>
        Yükleniyor...
      </div>
    );
  }

  // GİRİŞ YAPILMAMIŞSA: KVKK Uyumlu Koyu Tema Login Ekranı
  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0b0f19", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ backgroundColor: "#0f172a", padding: "40px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
          
          {/* Mavi/Beyaz Gradyan Başlık */}
          <h1 style={{ background: "linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px", fontWeight: "800" }}>
            Power AI
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Sohbete başlamak için giriş yapın</p>

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px",
              transition: "0.2s"
            }}
          >
            Google ile Giriş Yap
          </button>

          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
            🔒 <strong style={{ color: "#f8fafc" }}>KVKK & Gizlilik Bildirimi:</strong> Google ile giriş yaptığınızda e-posta adresiniz, adınız veya kişisel verileriniz veritabanımızda saklanmaz. Oturumunuz tamamen anonim kimlik kodu üzerinden yürütülür.
          </div>
        </div>
      </div>
    );
  }

  // GİRİŞ YAPILMIŞSA: Ana Koyu Tema Chat Arayüzü
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