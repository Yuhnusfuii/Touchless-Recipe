"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { GestureEngine, DetectedGesture } from "@/ai-engine/GestureEngine";

export default function PlaygroundPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // UI State for logs
  const [lastGesture, setLastGesture] = useState<DetectedGesture>("NONE");
  const [voiceLog, setVoiceLog] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const gestureEngineRef = useRef<GestureEngine>(new GestureEngine());

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setHandLandmarker(landmarker);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize MediaPipe:", error);
      }
    }
    initMediaPipe();
  }, []);

  // Frame processing loop
  useEffect(() => {
    if (!isReady || !handLandmarker) return;

    let animationFrameId: number;
    let lastVideoTime = -1;

    const renderLoop = async () => {
      if (
        webcamRef.current && 
        webcamRef.current.video && 
        webcamRef.current.video.readyState === 4 &&
        canvasRef.current
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Sync canvas size to video size
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const currentTimeInMs = performance.now();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          
          const results = handLandmarker.detectForVideo(video, currentTimeInMs);
          
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (results.landmarks && results.landmarks.length > 0) {
              // Draw landmarks for debug
              results.landmarks.forEach((hand) => {
                // Pass landmarks to Gesture Engine
                gestureEngineRef.current.processFrame(hand, (gesture) => {
                  setLastGesture(gesture);
                });

                // Draw points
                hand.forEach((point) => {
                  const x = point.x * canvas.width;
                  const y = point.y * canvas.height;
                  ctx.beginPath();
                  ctx.arc(x, y, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = "red";
                  ctx.fill();
                });
              });
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady, handLandmarker]);

  // Voice Recognition (Web Speech API)
  const toggleListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceLog("Trình duyệt không hỗ trợ Speech Recognition");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return; // It will stop naturally or we can keep a ref to recognition and stop it.
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN'; // Vietnamese
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceLog("Đang nghe...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceLog(`Đã nghe: "${transcript}"`);
      
      // Fake command logic
      if (transcript.includes("tiếp theo") || transcript.includes("bước tiếp")) {
         setVoiceLog(`Lệnh ĐIỀU KHIỂN: Chuyển bước tiếp theo!`);
      }
    };

    recognition.onerror = (event: any) => {
      setVoiceLog(`Lỗi Voice: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isListening]);

  // Text to Speech
  const speakTest = () => {
    if (!('speechSynthesis' in window)) {
      alert("Trình duyệt không hỗ trợ Text-to-Speech");
      return;
    }
    
    setIsSpeaking(true);
    const msg = new SpeechSynthesisUtterance("Xin chào, đây là trợ lý nấu ăn thông minh. Chúc bạn một ngày tốt lành!");
    msg.lang = 'vi-VN';
    msg.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          AI Playground & Proof of Concept
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera & Gestures */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-blue-400 mr-2">1.</span> Vision & Gestures
            </h2>
            
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4 border-2 border-gray-700">
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900/80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                  <span className="ml-4 text-blue-400 font-medium">Loading MediaPipe...</span>
                </div>
              )}
              
              <Webcam
                ref={webcamRef}
                audio={false}
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" // mirror effect
                videoConstraints={{ facingMode: "user" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10 pointer-events-none"
              />
            </div>

            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Cử chỉ nhận diện được:</p>
              <div className="text-3xl font-bold text-emerald-400 h-10 flex items-center">
                {lastGesture !== "NONE" ? lastGesture : "Waiting for gesture..."}
              </div>
              <div className="text-gray-500 text-xs mt-4 space-y-2">
                <p><strong className="text-gray-300">Hướng dẫn để tay:</strong> Bàn tay cần cách camera khoảng 30-50cm.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Vuốt Trái / Phải:</strong> YÊU CẦU xòe thẳng cả 5 ngón tay (Open Palm) rồi lướt ngang. Điều này giúp tránh bị vô tình quẹt trúng khi đang cầm dao/đũa nấu ăn.</li>
                  <li><strong>Cuộn Lên / Xuống:</strong> BẮT BUỘC chĩa 2 ngón Trỏ và Giữa lên (các ngón khác gập lại), vuốt dọc biên độ lớn.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Voice & Audio */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 space-y-8">
            {/* Speech Recognition */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="text-purple-400 mr-2">2.</span> Voice Control
              </h2>
              <button 
                onClick={toggleListening}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {isListening ? '🛑 Đang nghe... Nhấn để dừng' : '🎤 Bắt đầu nhận diện giọng nói'}
              </button>
              
              <div className="mt-4 bg-gray-900 p-4 rounded-xl border border-gray-700 min-h-[100px]">
                <p className="text-gray-400 text-sm mb-1">Log kết quả (Thử nói "Bước tiếp theo"):</p>
                <div className="text-lg font-medium text-white break-words">
                  {voiceLog || "..."}
                </div>
              </div>
            </div>

            {/* Text to Speech */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="text-orange-400 mr-2">3.</span> AI Assistant (TTS)
              </h2>
              <button 
                onClick={speakTest}
                disabled={isSpeaking}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center ${
                  isSpeaking
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
                }`}
              >
                {isSpeaking ? '🔊 Đang đọc...' : '🔊 Test đọc công thức'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
