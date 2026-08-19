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

    // Bot yanıtı simülasyonu (Kendi yapay zeka/API kodunuzu buraya ekleyebilirsiniz)
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        Yükleniyor...
      </div>
    );
  }

  // GİRİŞ YAPILMAMIŞSA: KVKK Uyumlu Login Ekranı
  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f4f6f8", fontFamily: "sans-serif", padding: "20px" }}>
        <div style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textCenter: "center", maxWidth: "400px", width: "100%", textAlign: "center" }}>
          <h1 style={{ color: "#333", marginBottom: "8px" }}>Power AI</h1>
          <p style={{ color: "#666", marginBottom: "24px" }}>Sohbete başlamak için giriş yapın</p>

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4285F4",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            Google ile Giriş Yap
          </button>

          <div style={{ fontSize: "12px", color: "#888", lineHeight: "1.4", borderTop: "1px solid #eee", paddingTop: "15px" }}>
            🔒 <strong>KVKK & Gizlilik Bildirimi:</strong> Google ile giriş yaptığınızda e-posta adresiniz, adınız veya kişisel verileriniz veritabanımızda saklanmaz. Oturumunuz tamamen anonim kimlik kodu üzerinden yürütülür.
          </div>
        </div>
      </div>
    );
  }

  // GİRİŞ YAPILMIŞSA: Ana Chat Arayüzü
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
      {/* Üst Bar */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0" }}>
        <h2 style={{ margin: 0, color: "#333" }}>Power AI Chatbot</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "14px", color: "#555" }}>Hoş geldin, <strong>{user.displayName}</strong></span>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 14px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Mesaj Alanı */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>Henüz mesaj yok. Bir şeyler yazarak sohbeti başlatın!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e9ecef",
                color: msg.sender === "user" ? "#fff" : "#333",
                padding: "10px 16px",
                borderRadius: "18px",
                maxWidth: "70%",
                wordBreak: "break-word"
              }}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Mesaj Gönderme Formu */}
      <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "15px", backgroundColor: "#fff", borderTop: "1px solid #e0e0e0" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı yazın..."
          style={{ flex: 1, padding: "12px", border: "1px solid #ccc", borderRadius: "20px", outline: "none", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "12px 24px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontWeight: "bold" }}
        >
          Gönder
        </button>
      </form>
    </div>
  );
}