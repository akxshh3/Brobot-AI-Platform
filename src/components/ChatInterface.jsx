import { useState, useRef, useEffect } from 'react';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import styles from './ChatInterface.module.css';

export default function ChatInterface({ provider, apiKey, model, temp, maxTokens, systemPrompt, onClose }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('brobot_ai_chat');
    return saved ? JSON.parse(saved) : [{ text: `Hello! I am your ${provider.toUpperCase()} Brobot. How can I help you today?`, isUser: false }];
  });
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('brobot_ai_chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; 

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Your browser does not support Voice Recognition.");
        return;
      }
      recognitionRef.current?.start();
    }
  };

  const speakText = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Premium'));
    if (!bestVoice) bestVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en-US');
    if (bestVoice) utterance.voice = bestVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const clearMemory = () => {
    setMessages([{ text: `Memory cleared. I am your ${provider.toUpperCase()} Brobot. How can I help you today?`, isUser: false }]);
    localStorage.removeItem('brobot_ai_chat');
    window.speechSynthesis.cancel();
  };

  const handleSendMessage = async (textToSend = inputText) => {
    const finalInput = typeof textToSend === 'string' ? textToSend.trim() : inputText.trim();
    if (!finalInput) return;
    setInputText("");
    setError(null);
    
    const newMessages = [...messages, { text: finalInput, isUser: true }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let aiText = "";

      if (provider === 'groq') {
        const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
        const messageHistory = newMessages.map(m => ({
          role: m.isUser ? "user" : "assistant",
          content: m.text
        }));
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...messageHistory
          ],
          model: model,
          temperature: temp,
          max_tokens: maxTokens
        });
        aiText = chatCompletion.choices[0]?.message?.content || "";
      } 
      else if (provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ 
          model: model,
          systemInstruction: systemPrompt
        });
        
        const historyText = newMessages.map(m => `${m.isUser ? 'User' : 'AI'}: ${m.text}`).join('\n');
        const result = await geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: historyText }] }],
          generationConfig: {
            temperature: temp,
            maxOutputTokens: maxTokens,
          }
        });
        aiText = result.response.text();
      }
      else if (provider === 'openai') {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        const messageHistory = newMessages.map(m => ({
          role: m.isUser ? "user" : "assistant",
          content: m.text
        }));
        const chatCompletion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...messageHistory
          ],
          model: model,
          temperature: temp,
          max_tokens: maxTokens
        });
        aiText = chatCompletion.choices[0]?.message?.content || "";
      }
      else if (provider === 'anthropic') {
        const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
        const messageHistory = newMessages.map(m => ({
          role: m.isUser ? "user" : "assistant",
          content: m.text
        }));
        const msg = await anthropic.messages.create({
          model: model,
          system: systemPrompt,
          max_tokens: maxTokens,
          temperature: temp,
          messages: messageHistory,
        });
        aiText = msg.content[0].text;
      } else {
        throw new Error(`Provider ${provider} is not fully integrated yet!`);
      }
      
      setMessages(prev => [...prev, { text: aiText, isUser: false }]);
      speakText(aiText);
      
    } catch (err) {
      console.error(err);
      setError(`Error connecting to neural net: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <span>⚡</span> Active Link: {provider.toUpperCase()} ({model.split('/').pop()})
        </div>
        <div className={styles.headerControls}>
          <button className={styles.iconBtn} onClick={() => {
            setIsMuted(!isMuted);
            if (!isMuted) window.speechSynthesis.cancel();
          }} title={isMuted ? "Unmute Voice" : "Mute Voice"}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button className={styles.iconBtn} onClick={clearMemory} title="Clear Memory">
            🗑️
          </button>
          <button className={styles.iconBtn} onClick={onClose} title="Close Chat">
            ✕
          </button>
        </div>
      </div>

      <div className={styles.chatContainer} ref={chatContainerRef}>
        {error && (
          <div className={`${styles.message} ${styles.errorMessage}`}>
            ⚠️ {error}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.messageWrapper} ${msg.isUser ? styles.userWrapper : styles.aiWrapper}`}>
            {!msg.isUser && (
              <div className={`${styles.chatDp} ${styles.aiDp}`}>
                <span>🤖</span>
              </div>
            )}
            <div className={`${styles.message} ${msg.isUser ? styles.userMessage : styles.aiMessage}`}>
              {msg.text}
            </div>
            {msg.isUser && (
              <div className={`${styles.chatDp} ${styles.userDp}`}>
                👤
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
            <div className={`${styles.chatDp} ${styles.aiDp}`}>
              <span>🤖</span>
            </div>
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.typingIndicator}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <button 
          className={`${styles.micButton} ${isListening ? styles.micListening : ''}`}
          onClick={toggleListen}
          title="Click to speak"
        >
          🎙️
        </button>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type your message or use voice..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || isListening}
        />
        <button 
          className={styles.sendButton} 
          onClick={() => handleSendMessage()}
          disabled={isLoading || isListening || !inputText.trim()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
