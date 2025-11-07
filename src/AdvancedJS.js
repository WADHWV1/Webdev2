import React, { useEffect, useRef, useState } from "react";
import faqData from "./faq.json";

// =============== MAIN COMPONENT ===============
export default function Advanced() {
  const [demo, setDemo] = useState(1);

  // ==================================================
  // DEMO 1: SVG MAP (EIT Campus)
  // ==================================================
  const [showInfo, setShowInfo] = useState(false);

  const handleRegionClick = (region) => {
    if (region === "hawkesBay") setShowInfo(!showInfo);
  };

  // ==================================================
  // DEMO 2: USER PREFERENCES + IMAGE UPLOAD
  // ==================================================
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "16px");
  const [uploadedImage, setUploadedImage] = useState(localStorage.getItem("uploadedImage") || null);

  useEffect(() => {
    document.body.style.backgroundColor = theme === "light" ? "#f9f9f9" : "#1b2b3b";
    document.body.style.color = theme === "light" ? "#000" : "#fff";
    document.body.style.fontSize = fontSize;
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
  }, [theme, fontSize]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleFontSize = () => setFontSize(fontSize === "16px" ? "18px" : "16px");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        localStorage.setItem("uploadedImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ==================================================
  // DEMO 3: DRAG AND DROP
  // ==================================================
  const [selectedPhone, setSelectedPhone] = useState(null);
  const phones = ["iPhone", "Samsung Galaxy", "Nokia"];

  function onDragStart(e, phone) {
    e.dataTransfer.setData("text/plain", phone);
  }
  function onDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setSelectedPhone(data);
  }
  function onDragOver(e) {
    e.preventDefault();
  }

  // ==================================================
  // DEMO 4: FAQ + SLIDESHOW
  // ==================================================
  const [faqSearch, setFaqSearch] = useState("");
  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Manual slideshow
  const images = ["/phones/iphone.jpg", "/phones/samsung.jpg", "/phones/nokia.jpg"];
  const [slideIndex, setSlideIndex] = useState(0);

  // Auto slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // ==================================================
  // DEMO 5: CHATBOT
  // ==================================================
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const CHAT_RESPONSES = {
    bond: "The bond is a refundable amount that covers potential damage to the courtesy phone.",
    warranty: "The warranty lasts for 24 months from the purchase date.",
    service: "A small service fee applies for out-of-warranty repairs.",
    hello: ["Hi there!", "Hello! How can I assist you today?", "Hey! Need help with something?"],
    thanks: ["You're welcome!", "Glad to help!", "No problem at all!"],
  };

  const getBotReply = (userText) => {
    const lower = userText.toLowerCase();
    const keyFound = Object.keys(CHAT_RESPONSES).find((key) => lower.includes(key));
    if (keyFound) {
      const reply = CHAT_RESPONSES[keyFound];
      return Array.isArray(reply)
        ? reply[Math.floor(Math.random() * reply.length)]
        : reply;
    }
    return "Hmm... Try asking about bond, warranty, or service!";
  };

  const handleChatSend = (e) => {
    if (e.key === "Enter" && chatInput.trim()) {
      const userMsg = chatInput.trim();
      setChatMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
      setChatInput("");
      setIsTyping(true);

      setTimeout(() => {
        const botReply = getBotReply(userMsg);
        setChatMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
        setIsTyping(false);
      }, 800);
    }
  };

  // ==================================================
  // DEMO 6: GEOLOCATION + DISTANCE
  // ==================================================
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const eitCoords = { lat: -39.5326, lng: 176.8617 };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserLocation({ lat, lng });
      const d = getDistance(lat, lng, eitCoords.lat, eitCoords.lng);
      setDistance(d.toFixed(2));
    });
  };

  // ==================================================
  // RESET FUNCTION
  // ==================================================
  function initAll() {
    setDemo(1);
    setTheme("light");
    setFontSize("16px");
    setSelectedPhone(null);
    setFaqSearch("");
    setChatMessages([]);
    setUploadedImage(null);
    localStorage.clear();
    alert("All demos reset successfully!");
  }

  // ==================================================
  // LAYOUT
  // ==================================================
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center", background: "#1b2b3b", color: "#fff", padding: "10px" }}>
        JavaScript Extension
      </h2>

      <div style={{ display: "flex", gap: "1rem", background: "#1b2b3b", padding: "10px" }}>
        {/* Sidebar Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", minWidth: "140px" }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => setDemo(n)}
              style={{
                marginBottom: 8,
                backgroundColor: demo === n ? "#fbc531" : "#2980b9",
                color: "#fff",
                cursor: "pointer",
                padding: "10px",
                borderRadius: 4,
                border: "none",
                fontWeight: demo === n ? "bold" : "normal",
              }}
            >
              {`Demo ${n}`}
            </button>
          ))}
          <button
            onClick={initAll}
            style={{
              marginTop: "auto",
              backgroundColor: "#27ae60",
              color: "#fff",
              padding: "8px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
            }}
          >
            Initialize All
          </button>
        </nav>

        {/* Main Demo Area */}
        <section
          style={{
            flexGrow: 1,
            borderRadius: 6,
            backgroundColor: "#f6f8fa",
            padding: 16,
            minHeight: 500,
          }}
        >
          {/* DEMO 1 - SVG Map */}
          {demo === 1 && (
            <>
              <h3>Interactive NZ Map</h3>
              <svg viewBox="0 0 300 800" width="100%" height="400">
                {/* South Island */}
                <path
                  d="M150 700 L160 720 L170 750 L180 740 L190 700 Z"
                  fill="#666"
                  stroke="#fff"
                  strokeWidth="1"
                />
                {/* North Island */}
                <path
                  d="M170 500 L180 520 L190 540 L200 520 L210 490 Z"
                  fill="#666"
                  stroke="#fff"
                  strokeWidth="1"
                />
                {/* Hawke's Bay region */}
                <path
                  d="M200 520 L205 515 L210 505 L215 510 L210 520 L205 525 Z"
                  fill="#002b80"
                  stroke="#fff"
                  strokeWidth="1"
                  onClick={() => handleRegionClick("hawkesBay")}
                  style={{ cursor: "pointer" }}
                />
                {showInfo && (
                  <foreignObject x="120" y="460" width="160" height="80">
                    <div
                      style={{
                        background: "#fff",
                        border: "2px solid red",
                        borderRadius: "6px",
                        padding: "6px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      <b>EIT Campus</b>
                      <br />
                      501 Gloucester St, Taradale, Napier 4112
                    </div>
                  </foreignObject>
                )}
              </svg>
              <p style={{ fontSize: 12 }}>*Click Hawke’s Bay region to toggle campus info.</p>
            </>
          )}

          {/* DEMO 2 - Preferences & Image Upload */}
          {demo === 2 && (
            <>
              <h3>User Preferences</h3>
              <button onClick={toggleTheme} style={{ marginRight: 8 }}>
                Toggle Theme
              </button>
              <button onClick={toggleFontSize}>Toggle Font Size</button>

              <div style={{ marginTop: 16 }}>
                <h4>Upload Repair Phone Image</h4>
                <input type="file" onChange={handleImageUpload} />
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    style={{ width: 200, marginTop: 10, borderRadius: 8 }}
                  />
                )}
              </div>
            </>
          )}

          {/* DEMO 3 - Drag and Drop */}
          {demo === 3 && (
            <>
              <h3>Drag & Drop - Select Courtesy Phone</h3>
              <div style={{ display: "flex", gap: 20 }}>
                <ul style={{ listStyle: "none", paddingLeft: 0, width: 120 }}>
                  {phones.map((p) => (
                    <li
                      key={p}
                      draggable
                      onDragStart={(e) => onDragStart(e, p)}
                      style={{
                        margin: "6px 0",
                        padding: 8,
                        border: "1px solid #ccc",
                        cursor: "grab",
                        background: "#fff",
                      }}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  style={{
                    flexGrow: 1,
                    height: 100,
                    border: "2px dashed #777",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: selectedPhone ? "#d4edda" : "#f8f9fa",
                    fontWeight: "bold",
                  }}
                >
                  {selectedPhone ? `Selected: ${selectedPhone}` : "Drop phone here"}
                </div>
              </div>
            </>
          )}

          {/* DEMO 4 - FAQ + Slideshow */}
          {demo === 4 && (
            <>
              <h3>FAQ + Smartphone Gallery</h3>
              <input
                type="text"
                placeholder="Search FAQ..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                style={{ width: "100%", maxWidth: 400, marginBottom: 12 }}
              />
              <div style={{ marginBottom: 20 }}>
                {filteredFaqs.map(({ question, answer }, idx) => (
                  <div key={idx} style={{ marginBottom: 10 }}>
                    <strong>{question}</strong>
                    <p>{answer}</p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center" }}>
                <img
                  src={images[slideIndex]}
                  alt="Phone"
                  style={{ width: 250, borderRadius: 8 }}
                />
                <div>
                  <button onClick={() => setSlideIndex((slideIndex - 1 + images.length) % images.length)}>
                    ◀
                  </button>
                  <button onClick={() => setSlideIndex((slideIndex + 1) % images.length)}>▶</button>
                </div>
              </div>
            </>
          )}

          {/* DEMO 5 - Chatbot */}
          {demo === 5 && (
            <>
              <h3>Chatbot Assistant</h3>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  height: 200,
                  padding: 10,
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  marginBottom: 8,
                }}
              >
                {chatMessages.map((msg, i) => (
                  <p key={i} style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
                    <b>{msg.from === "user" ? "You" : "Bot"}:</b> {msg.text}
                  </p>
                ))}
                {isTyping && <p><i>Bot is typing...</i></p>}
              </div>
              <input
                type="text"
                placeholder="Type message and press Enter"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatSend}
                style={{ width: "100%", padding: 8 }}
              />
            </>
          )}

          {/* DEMO 6 - Geolocation */}
          {demo === 6 && (
            <>
              <h3>Find Nearest Shop</h3>
              <button onClick={getUserLocation}>Get My Location</button>
              {userLocation && (
                <p>
                  You are at ({userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}).
                  <br />
                  Distance to EIT Campus: <b>{distance} km</b>
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <footer style={{ textAlign: "center", marginTop: 10, fontSize: 12 }}>
        Advanced Web Design © 2025
      </footer>
    </div>
  );
}
