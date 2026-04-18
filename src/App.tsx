/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Instagram, Youtube, Music, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [showContact, setShowContact] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    body: ""
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setTimeout(() => {
        setShowContact(false);
        setStatus("idle");
        setFormData({ firstName: "", lastName: "", subject: "", body: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white font-serif bg-black selection:bg-white/30">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        src="/vintage-room.jpg"
        alt="Carmanear Band Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      <AnimatePresence>
        {!showContact ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-between py-10 sm:py-16 px-6"
          >
            
            {/* Header - Socials */}
            <header className="z-10 flex gap-6 sm:gap-8 items-center justify-center opacity-90 drop-shadow-md">
              <a href="https://www.instagram.com/carmanear_/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 hover:scale-110 transition-all duration-300">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="https://www.youtube.com/@Carmanear" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 hover:scale-110 transition-all duration-300">
                <Youtube size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="hover:opacity-70 hover:scale-110 transition-all duration-300">
                <Music size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="hover:opacity-70 hover:scale-110 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.784-.963-.338.077-.67-.133-.746-.47-.077-.337.132-.67.47-.747 3.816-.873 7.076-.497 9.71 1.115.293.18.386.56.207.858zm1.2-3.153c-.226.368-.707.48-1.074.254-2.685-1.65-6.786-2.128-9.965-1.163-.42.127-.856-.11-1-.53-.13-.42.11-.855.53-1 3.65-1.11 8.24-.585 11.26 1.27.37.227.48.708.25 1.077zm.116-3.32c-3.21-1.9-8.498-2.073-11.53-1.15-.494.15-1.02-.128-1.17-.62-.15-.493.127-1.02.62-1.17 3.51-1.074 9.35-.873 13.06 1.323.44.258.585.836.327 1.275-.258.44-.836.586-1.275.328z"/>
                </svg>
              </a>
            </header>

            {/* Main Title - Centered */}
            <main className="z-10 flex flex-col items-center justify-center h-full w-full select-none cursor-default">
              <h1 
                className="text-center font-bold tracking-tight drop-shadow-2xl w-full px-2"
                style={{
                  fontSize: 'clamp(2.5rem, 11vw, 12rem)',
                  lineHeight: 0.85,
                  letterSpacing: '-0.03em',
                }}
              >
                Carmanear
              </h1>
            </main>

            {/* Footer - Contact */}
            <footer className="z-10 flex text-sm sm:text-base font-medium tracking-[0.15em] uppercase drop-shadow-lg opacity-95">
              <button 
                onClick={() => setShowContact(true)}
                className="hover:opacity-70 transition-opacity duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:-bottom-1 after:left-0 after:bg-white after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300 cursor-pointer"
              >
                Contact Us
              </button>
            </footer>

          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center py-10 px-6 z-20"
          >
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-md p-8 md:p-12 border border-white/10 shadow-2xl relative">
              <button 
                onClick={() => setShowContact(false)}
                className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
              >
                <X size={24} strokeWidth={1} />
              </button>
              
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 text-center text-white drop-shadow-sm">Contact</h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    placeholder="Subject Line"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                
                <div>
                  <textarea 
                    name="body"
                    required
                    placeholder="Message"
                    rows={4}
                    value={formData.body}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder:text-white/50 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className="mt-4 border border-white/50 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-300 font-serif disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  {status === "submitting" ? "Sending..." : status === "success" ? "Message Sent!" : "Send Inquiry"}
                </button>
                {status === "error" && (
                  <p className="text-red-400 text-xs text-center mt-2">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
