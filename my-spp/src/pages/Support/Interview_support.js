import React, { useState } from "react";
 
export default function InterviewSupport() {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = { email, contact, message };
  
    try {
      const res = await fetch("http://127.0.0.1:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      if (res.ok) {
        setResponse("✅ Email sent successfully!");
        setEmail("");
        setContact("");
        setMessage("");
      } else {
        setResponse("❌ Error: " + result.error);
      }
    } catch (error) {
      setResponse("❌ Failed to send request.");
    }
  
    // Clear the response message after 5 seconds
    setTimeout(() => {
      setResponse("");
    }, 5000);
  };
  
  

  return (
<div
  className="flex items-center justify-center h-[88vh] p-6"
  style={{
    backgroundImage:
      "url('https://t4.ftcdn.net/jpg/04/39/69/99/360_F_439699926_GkaQTcxPchsvvtdrZ98cFQh1a8HQICwP.jpg')",
    backgroundRepeat: "no-repeat", // ✅ Prevents repeating
    backgroundSize: "cover", // ✅ Stretches image to cover the whole div
    backgroundPosition: "center", // ✅ Centers the image
  }}
>


      <div className="relative w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-white">
        {/* Form Title */}
        <h1 className="text-3xl font-extrabold text-center mb-6 drop-shadow-lg">
          Contact Support
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-md text-white focus:ring-2 focus:ring-pink-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contact Number Input */}
          <div>
            <label className="block text-lg font-medium">Contact Number</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-md text-white focus:ring-2 focus:ring-blue-400 outline-none"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-lg font-medium">Message</label>
            <textarea
              className="w-full p-3 rounded-lg bg-white/20 backdrop-blur-md text-white focus:ring-2 focus:ring-purple-400 outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg text-lg font-semibold shadow-md transition transform hover:scale-105 hover:shadow-xl active:scale-95"
          >
            🚀 Send
          </button>
        </form>

        {/* Response Message */}
        {response && (
          <p className="mt-4 text-center text-lg font-medium">{response}</p>
        )}
      </div>
    </div>
  );
}
