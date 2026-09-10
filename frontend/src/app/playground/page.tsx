"use client";

import React, { useRef, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Webcam from "react-webcam";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  ArrowLeft,
  CheckCircle2,
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Flame,
  Globe,
  Hand,
  ListChecks,
  Loader2,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from "lucide-react";
import { GestureEngine, DetectedGesture } from "@/ai-engine/GestureEngine";
import { useLanguage } from "@/components/language-provider";
import { askCookingAssistant, recipeApi, type RecipeItem } from "@/lib/api";
import { trackCookingActivity } from "@/lib/activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fallbackTranslateInstruction,
  translateArea,
  translateCategory,
  translateDifficulty,
  translateIngredientName,
  translateMeasure,
  translateRecipeTitle,
  translateTextToVietnamese,
} from "@/lib/translate";
import { cn } from "@/lib/utils";
import { VoiceAssistantModal } from "@/components/playground/VoiceAssistantModal";
import { FinishCookingModal } from "@/components/playground/FinishCookingModal";

type SpeechRecognitionEvent = Event & {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionErrorEvent = Event & { error: string };

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const DEFAULT_FALLBACK_RECIPE: RecipeItem = {
  id: "52772",
  title: "Teriyaki Chicken Casserole",
  description: "Japanese style chicken casserole with savory teriyaki glaze, steamed rice, and fresh vegetables.",
  category: "Chicken",
  area: "Japanese",
  prepTime: 30,
  difficulty: "Easy",
  calories: 450,
  imageUrl: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  videoUrl: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  source: "TheMealDB",
  ingredients: [
    { name: "Soy Sauce", measure: "3/4 cup" },
    { name: "Water", measure: "1/2 cup" },
    { name: "Brown Sugar", measure: "1/4 cup" },
    { name: "Ground Ginger", measure: "1/2 tsp" },
    { name: "Minced Garlic", measure: "1/2 tsp" },
    { name: "Cornstarch", measure: "4 Tablespoons" },
    { name: "Chicken Breasts", measure: "2 sliced" },
    { name: "Stir Fry Vegetables", measure: "1 bag" },
    { name: "Brown Rice", measure: "3 cups" },
  ],
  steps: [
    {
      stepNumber: 1,
      instruction: "Preheat oven to 350°F (175°C). In a small bowl, combine cornstarch and water to create a slurry.",
      timerSeconds: 120,
    },
    {
      stepNumber: 2,
      instruction: "In a small saucepan over medium heat, combine soy sauce, brown sugar, ginger, and garlic. Bring to a simmer.",
      timerSeconds: 180,
    },
    {
      stepNumber: 3,
      instruction: "Stir in cornstarch mixture and cook until the sauce thickens and turns glossy.",
      timerSeconds: 120,
    },
    {
      stepNumber: 4,
      instruction: "Place sliced chicken breasts and mixed vegetables into a 9x13 inch baking dish.",
    },
    {
      stepNumber: 5,
      instruction: "Pour the warm teriyaki sauce evenly over the chicken and vegetables.",
    },
    {
      stepNumber: 6,
      instruction: "Bake in the preheated oven for 30 minutes until chicken is cooked through and sauce is bubbly.",
      timerSeconds: 1800,
    },
    {
      stepNumber: 7,
      instruction: "Serve hot over a bowl of steamed brown rice. Enjoy your calm, touchless kitchen creation!",
    },
  ],
};

function subscribeActiveRecipe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getActiveRecipeSnapshot() {
  return localStorage.getItem("active_cooking_recipe");
}

function getActiveRecipeServerSnapshot() {
  return null;
}

function getStepDurationSeconds(instruction: string, stepIndex: number, totalSteps: number, prepTimeMinutes: number) {
  const text = instruction.toLowerCase();
  const explicitMinutes = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to|–|đến)\s*(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|phút)/i);
  const singleMinutes = text.match(/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|phút)/i);
  const seconds = text.match(/(\d+(?:\.\d+)?)\s*(?:seconds?|secs?|giây)/i);
  const hours = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|giờ)/i);

  if (explicitMinutes) {
    return Math.round(((Number(explicitMinutes[1]) + Number(explicitMinutes[2])) / 2) * 60);
  }
  if (singleMinutes) return Math.round(Number(singleMinutes[1]) * 60);
  if (seconds) return Math.max(15, Math.round(Number(seconds[1])));
  if (hours) return Math.round(Number(hours[1]) * 3600);

  let estimate = 90;
  if (/preheat|pre-heat|làm nóng|làm nguội|cool|rest|nghỉ|marinat|ướp|chill|ủ|rise|proof/.test(text)) estimate = 15 * 60;
  else if (/bake|roast|nướng|baked|boil|luộc|simmer|đun|hấp|steam|chiên|fry|sauté|saute/.test(text)) estimate = 12 * 60;
  else if (/chop|slice|dice|mince|cut|cắt|thái|băm|gọt|peel|rửa|wash/.test(text)) estimate = 6 * 60;
  else if (/mix|stir|combine|whisk|trộn|khuấy|đánh|combine|add|thêm/.test(text)) estimate = 4 * 60;
  else if (/serve|garnish|plate|phục vụ|trang trí|dọn/.test(text)) estimate = 3 * 60;

  const remainingPrepSeconds = Math.max(0, prepTimeMinutes * 60 - estimate * totalSteps);
  return Math.max(30, Math.round(estimate + remainingPrepSeconds / Math.max(1, totalSteps) * (stepIndex === 0 ? 1.2 : 0.8)));
}

function getRecipeStepDuration(recipe: RecipeItem, stepIndex: number) {
  const step = recipe.steps[stepIndex];
  return step?.timerSeconds && step.timerSeconds > 0
    ? step.timerSeconds
    : getStepDurationSeconds(step?.instruction || "", stepIndex, recipe.steps.length, recipe.prepTime);
}

const COOKING_PROGRESS_KEY = "active_cooking_progress";
const SMART_FRIDGE_STORAGE_KEY = "smart_fridge_day";

function publishCookingProgress(recipe: RecipeItem, stepIndex: number, timer: number, isTimerRunning: boolean) {
  localStorage.setItem(COOKING_PROGRESS_KEY, JSON.stringify({
    recipeTitle: recipe.title,
    stepIndex,
    totalSteps: recipe.steps.length,
    timerSeconds: timer,
    isTimerRunning,
    timerEndAt: isTimerRunning ? Date.now() + timer * 1000 : null,
  }));
  window.dispatchEvent(new Event("cooking-progress-change"));
}

function markSmartFridgeMealComplete(mealId: string) {
  const stored = localStorage.getItem(SMART_FRIDGE_STORAGE_KEY);
  if (!stored) return;
  try {
    const snapshot = JSON.parse(stored) as { date?: string; completedMealIds?: string[] };
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (snapshot.date === today) {
      localStorage.setItem(SMART_FRIDGE_STORAGE_KEY, JSON.stringify({
        ...snapshot,
        completedMealIds: [...new Set([...(snapshot.completedMealIds || []), mealId])],
      }));
    }
  } catch {
    localStorage.removeItem(SMART_FRIDGE_STORAGE_KEY);
  }
}

function getPreferredSpeechVoice(language: "en" | "vi", voices: SpeechSynthesisVoice[]) {
  const locale = language === "vi" ? "vi-VN" : "en-US";
  const localeVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
  const femaleVoicePattern = /female|feminine|woman|girl|hoaimy|zira|samantha|karen|susan|siri/i;

  return (
    localeVoices.find((voice) => femaleVoicePattern.test(voice.name)) ||
    localeVoices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase()) ||
    localeVoices[0]
  );
}

const VOICE_ASSISTANT_LOCALE = "vi-VN";
const VOICE_ASSISTANT_LANGUAGE = "vi";

export default function PlaygroundPage() {
  const { setLanguage, isVietnamese } = useLanguage();
  const router = useRouter();

  // Active Recipe State via useSyncExternalStore + hydration
  const storedJson = useSyncExternalStore(
    subscribeActiveRecipe,
    getActiveRecipeSnapshot,
    getActiveRecipeServerSnapshot
  );

  const [recipe, setRecipe] = useState<RecipeItem>(DEFAULT_FALLBACK_RECIPE);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [translatedSteps, setTranslatedSteps] = useState<Record<number, string>>({});
  const [completionNotice, setCompletionNotice] = useState<string>("");
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

  // Camera & MediaPipe State
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [lastGesture, setLastGesture] = useState<DetectedGesture>("NONE");
  const [gestureNotice, setGestureNotice] = useState<string>("");

  // Step Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(() => {
    return getRecipeStepDuration(recipe, 0);
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Voice & Speech State
  const [voiceLog, setVoiceLog] = useState<string>("");
  const [assistantReply, setAssistantReply] = useState<string>("");
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [assistantConversation, setAssistantConversation] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceSessionActiveRef = useRef(false);
  const voiceRestartTimeoutRef = useRef<number | null>(null);

  const gestureEngineRef = useRef<GestureEngine>(new GestureEngine());

  useEffect(() => {
    let storedRecipe: RecipeItem | null = null;
    try {
      storedRecipe = storedJson ? JSON.parse(storedJson) as RecipeItem : null;
    } catch {
      return;
    }
    if (storedRecipe?.title === recipe.title && recipe.steps.length > 0) {
      publishCookingProgress(recipe, currentStepIndex, timerSeconds, isTimerRunning);
    }
  }, [currentStepIndex, isTimerRunning, recipe, storedJson, timerSeconds]);

  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => setSpeechVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    return () => window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
  }, []);

  // Record initial cooking start & streak
  useEffect(() => {
    if (recipe && recipe.id && recipe.steps.length > 0) {
      trackCookingActivity({
        recipeId: recipe.id,
        currentStepIndex: 0,
        totalSteps: recipe.steps.length,
        isHandsFree: true,
      });
    }
  }, [recipe]);

  // Load the active recipe after hydration so server and client render the same initial tree.
  useEffect(() => {
    if (!storedJson) return;

    try {
      const parsed = JSON.parse(storedJson) as RecipeItem;
      queueMicrotask(() => setRecipe(parsed));

      const savedProgress = localStorage.getItem(COOKING_PROGRESS_KEY);
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress) as { recipeTitle?: string; stepIndex?: number; timerSeconds?: number; isTimerRunning?: boolean; timerEndAt?: number | null };
          if (progress.recipeTitle === parsed.title) {
            const remainingSeconds = progress.isTimerRunning && progress.timerEndAt
              ? Math.max(0, Math.ceil((progress.timerEndAt - Date.now()) / 1000))
              : Math.max(progress.timerSeconds || 0, 0);
            queueMicrotask(() => {
              setCurrentStepIndex(Math.min(Math.max(progress.stepIndex || 0, 0), Math.max(parsed.steps.length - 1, 0)));
              setTimerSeconds(remainingSeconds || getRecipeStepDuration(parsed, progress.stepIndex || 0));
              setIsTimerRunning(progress.isTimerRunning === true && remainingSeconds > 0);
            });
          }
        } catch {
          localStorage.removeItem(COOKING_PROGRESS_KEY);
        }
      }

      if (!parsed.steps || parsed.steps.length === 0) {
        recipeApi.getRecipeById(parsed.id).then((fullRecipe) => {
          if (fullRecipe && fullRecipe.steps.length > 0) {
            setRecipe(fullRecipe);
          }
        });
      }
    } catch (e) {
      console.error("Failed to parse stored recipe", e);
    }
  }, [storedJson]);

  // Translate all recipe steps naturally into Vietnamese when isVietnamese is true
  useEffect(() => {
    if (!isVietnamese || !recipe.steps || recipe.steps.length === 0) return;

    let active = true;
    recipe.steps.forEach((s, idx) => {
      translateTextToVietnamese(s.instruction).then((viText) => {
        if (active && viText) {
          setTranslatedSteps((prev) => ({
            ...prev,
            [idx]: viText,
          }));
        }
      });
    });

    return () => {
      active = false;
    };
  }, [isVietnamese, recipe.steps]);

  const getStepText = useCallback(
    (stepIndex: number, originalText: string) => {
      if (!isVietnamese) return originalText;
      return translatedSteps[stepIndex] || fallbackTranslateInstruction(originalText);
    },
    [isVietnamese, translatedSteps]
  );

  // Read current step aloud using the selected language
  const speakCurrentStep = useCallback(() => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceLog(isVietnamese ? "Trình duyệt chưa hỗ trợ đọc văn bản." : "Text-to-speech unsupported.");
      return;
    }
    window.speechSynthesis.cancel(); // stop previous speech

    const step = recipe.steps[currentStepIndex];
    if (!step) return;

    setIsSpeaking(true);
    const instructionText = getStepText(currentStepIndex, step.instruction);
    const textToSpeak = isVietnamese
      ? `Bước ${step.stepNumber}: ${instructionText}`
      : `Step ${step.stepNumber}: ${step.instruction}`;

    const msg = new SpeechSynthesisUtterance(textToSpeak);
    msg.lang = isVietnamese ? "vi-VN" : "en-US";
    const voice = getPreferredSpeechVoice(isVietnamese ? "vi" : "en", speechVoices);
    if (voice) {
      msg.voice = voice;
    } else if (isVietnamese) {
      setVoiceLog("Chưa tìm thấy giọng tiếng Việt. Hãy cài Vietnamese voice trong Windows.");
    }
    msg.rate = 0.95;
    msg.onend = () => setIsSpeaking(false);
    msg.onerror = () => {
      setIsSpeaking(false);
      setVoiceLog(isVietnamese ? "Không thể phát giọng đọc tiếng Việt." : "Unable to play speech.");
    };
    window.speechSynthesis.speak(msg);
  }, [currentStepIndex, getStepText, isVietnamese, recipe.steps, speechVoices]);

  const speakAssistantReply = useCallback((reply: string) => {
    setAssistantReply(reply);
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(reply);
    message.lang = VOICE_ASSISTANT_LOCALE;
    const voice = getPreferredSpeechVoice(VOICE_ASSISTANT_LANGUAGE, speechVoices);
    if (voice) message.voice = voice;
    else setVoiceLog("Chưa tìm thấy giọng nữ tiếng Việt. Hãy cài Vietnamese voice trong Windows.");
    message.rate = 0.95;
    setIsSpeaking(true);
    message.onend = () => setIsSpeaking(false);
    message.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(message);
  }, [speechVoices]);

  const finishCooking = useCallback(() => {
    voiceSessionActiveRef.current = false;
    if (voiceRestartTimeoutRef.current !== null) {
      window.clearTimeout(voiceRestartTimeoutRef.current);
      voiceRestartTimeoutRef.current = null;
    }
    recognitionRef.current?.stop();
    setShowFinishConfirmation(false);
    setIsTimerRunning(false);
    localStorage.removeItem("active_cooking_progress");
    window.dispatchEvent(new Event("cooking-progress-change"));
    if (recipe.returnPath === "/smart-fridge" && recipe.fridgeMealId) {
      markSmartFridgeMealComplete(recipe.fridgeMealId);
    }
    void trackCookingActivity({
      recipeId: recipe.id,
      currentStepIndex: recipe.steps.length - 1,
      totalSteps: recipe.steps.length,
      isHandsFree: true,
    });
    speakAssistantReply(
      isVietnamese
        ? "Chúc mừng bạn đã hoàn thành món ăn! Món ăn thật tuyệt vời, chúc bạn ngon miệng!"
        : "Congratulations on completing your meal! It looks wonderful. Enjoy your food!"
    );
    window.setTimeout(() => router.replace(recipe.returnPath || "/"), 3500);
  }, [isVietnamese, recipe, router, speakAssistantReply]);

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < recipe.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setIsTimerRunning(false);
      setTimerSeconds(getRecipeStepDuration(recipe, nextIdx));
      setGestureNotice(isVietnamese ? "👉 Sang bước tiếp theo" : "👉 Next step");
      setTimeout(() => setGestureNotice(""), 2000);

      // Track cooking activity & >50% completion
      trackCookingActivity({
        recipeId: recipe.id,
        currentStepIndex: nextIdx,
        totalSteps: recipe.steps.length,
        isHandsFree: true,
      }).then((res) => {
        if (res.isNewlyCompleted) {
          setCompletionNotice(
            isVietnamese
              ? "🎉 Tuyệt vời! Bạn đã hoàn thành trên 50% các bước nấu. Món ăn này đã được tính vào 'Món đã thực hiện'!"
              : "🎉 Awesome! You completed over 50% of the steps. Recorded as a cooked meal!"
          );
          setTimeout(() => setCompletionNotice(""), 6000);
        }
      });
    }
  }, [currentStepIndex, isVietnamese, recipe]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setIsTimerRunning(false);
      setTimerSeconds(getRecipeStepDuration(recipe, prevIdx));
      setGestureNotice(isVietnamese ? "👈 Quay lại bước trước" : "👈 Previous step");
      setTimeout(() => setGestureNotice(""), 2000);
    }
  }, [currentStepIndex, isVietnamese, recipe]);

  const selectStepByIndex = useCallback((idx: number) => {
    setCurrentStepIndex(idx);
    setIsTimerRunning(false);
    setTimerSeconds(getRecipeStepDuration(recipe, idx));

    trackCookingActivity({
      recipeId: recipe.id,
      currentStepIndex: idx,
      totalSteps: recipe.steps.length,
      isHandsFree: true,
    }).then((res) => {
      if (res.isNewlyCompleted) {
        setCompletionNotice(
          isVietnamese
            ? "🎉 Tuyệt vời! Bạn đã hoàn thành trên 50% các bước nấu. Món ăn này đã được tính vào 'Món đã thực hiện'!"
            : "🎉 Awesome! You completed over 50% of the steps. Recorded as a cooked meal!"
        );
        setTimeout(() => setCompletionNotice(""), 6000);
      }
    });
  }, [isVietnamese, recipe]);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
        setHandLandmarker(landmarker);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize MediaPipe:", error);
      }
    }
    initMediaPipe();
  }, []);

  // Frame processing loop for Camera & Gesture Engine
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
              const activeHand = results.landmarks.reduce((largestHand, hand) => {
                const getArea = (candidate: typeof hand) => {
                  const xValues = candidate.map((point) => point.x);
                  const yValues = candidate.map((point) => point.y);
                  return (Math.max(...xValues) - Math.min(...xValues)) * (Math.max(...yValues) - Math.min(...yValues));
                };
                return getArea(hand) > getArea(largestHand) ? hand : largestHand;
              });

              results.landmarks.forEach((hand) => {
                if (hand === activeHand) {
                  gestureEngineRef.current.processFrame(hand, (gesture) => {
                    setLastGesture(gesture);

                    // Note: Due to mirror effect (-scale-x-100), SWIPE_RIGHT on camera equals physical swipe left, etc.
                    if (gesture === "SWIPE_RIGHT" || gesture === "SWIPE_LEFT") {
                      if (gesture === "SWIPE_RIGHT") {
                        handleNextStep();
                      } else {
                        handlePrevStep();
                      }
                    }
                  });
                }

                // Draw hand landmarks overlay
                hand.forEach((point) => {
                  const x = point.x * canvas.width;
                  const y = point.y * canvas.height;
                  ctx.beginPath();
                  ctx.arc(x, y, 4, 0, 2 * Math.PI);
                  ctx.fillStyle = "#34d399";
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
  }, [isReady, handLandmarker, handleNextStep, handlePrevStep]);

  // Voice Recognition Handler
  const toggleListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setVoiceLog(isVietnamese ? "Trình duyệt chưa hỗ trợ nhận diện giọng nói." : "Speech recognition unsupported.");
      return;
    }

    if (voiceSessionActiveRef.current) {
      voiceSessionActiveRef.current = false;
      if (voiceRestartTimeoutRef.current !== null) {
        window.clearTimeout(voiceRestartTimeoutRef.current);
        voiceRestartTimeoutRef.current = null;
      }
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    voiceSessionActiveRef.current = true;
    const recognition = new SpeechRecognition();
    recognition.lang = VOICE_ASSISTANT_LOCALE;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceLog("Đang lắng nghe tiếng Việt...");
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript.toLowerCase() || "";
      const commandText = transcript.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      setVoiceLog(`"${transcript}"`);
      let reply = `Mình nghe thấy: ${transcript}. Bạn có thể nói tiếp theo, quay lại, đọc hướng dẫn hoặc bắt đầu hẹn giờ.`;
      let handledLocally = false;

      // Voice commands handling
      if (showFinishConfirmation && /^(co|yes|xac nhan|dong y|tiep tuc)$/.test(commandText.trim())) {
        finishCooking();
        reply = "Đã xác nhận hoàn thành. Chúc mừng bạn đã hoàn thành món ăn!";
        handledLocally = true;
      } else if (showFinishConfirmation && /^(khong|no|huy|cancel)$/.test(commandText.trim())) {
        setShowFinishConfirmation(false);
        reply = "Mình đã hủy hoàn thành món. Bạn có thể tiếp tục nấu.";
        handledLocally = true;
      } else if (
        commandText.includes("tiep theo") ||
        commandText === "tiep" ||
        commandText.includes("next") ||
        commandText.includes("buoc sau")
      ) {
        handleNextStep();
        reply = "Đã chuyển sang bước tiếp theo. Mình sẽ đồng hành cùng bạn.";
        handledLocally = true;
      } else if (
        commandText.includes("quay lai") ||
        commandText.includes("buoc truoc") ||
        commandText.includes("back") ||
        commandText.includes("previous")
      ) {
        handlePrevStep();
        reply = "Đã quay lại bước trước để bạn kiểm tra.";
        handledLocally = true;
      } else if (
        commandText.includes("doc") ||
        commandText.includes("read") ||
        commandText.includes("huong dan")
      ) {
        speakCurrentStep();
        reply = "Mình sẽ đọc hướng dẫn của bước hiện tại.";
        handledLocally = true;
      } else if (
        (commandText.includes("bat dau") || commandText.includes("start")) &&
        (commandText.includes("hen gio") || commandText.includes("timer") || commandText.includes("dem nguoc"))
      ) {
        setIsTimerRunning(true);
        reply = "Đã bắt đầu hẹn giờ cho bước này.";
        handledLocally = true;
      } else if (commandText.includes("dat lai") || commandText.includes("reset") || commandText.includes("restart")) {
        setIsTimerRunning(false);
        setTimerSeconds(getRecipeStepDuration(recipe, currentStepIndex));
        reply = "Đã đặt lại hẹn giờ cho bước hiện tại.";
        handledLocally = true;
      } else if (commandText.includes("dung hen gio") || commandText.includes("pause") || commandText.includes("stop timer")) {
        setIsTimerRunning(false);
        reply = "Đã tạm dừng hẹn giờ.";
        handledLocally = true;
      } else if (commandText.includes("bat camera") || commandText.includes("mo camera") || commandText.includes("camera on")) {
        setIsCameraEnabled(true);
        reply = "Đã bật camera và nhận diện cử chỉ.";
        handledLocally = true;
      } else if (commandText.includes("tat camera") || commandText.includes("dong camera") || commandText.includes("camera off")) {
        setIsCameraEnabled(false);
        reply = "Đã tắt camera.";
        handledLocally = true;
      } else if (commandText.includes("an camera") || commandText.includes("hide camera")) {
        setIsCameraVisible(false);
        reply = "Đã ẩn camera, nhận diện vẫn tiếp tục hoạt động.";
        handledLocally = true;
      } else if (commandText.includes("hien camera") || commandText.includes("show camera")) {
        setIsCameraVisible(true);
        reply = "Đã hiện camera.";
        handledLocally = true;
      } else if (commandText.includes("tieng viet") || commandText.includes("vietnamese") || commandText === "vi") {
        setLanguage("vi");
        reply = "Đã chuyển sang tiếng Việt.";
        handledLocally = true;
      } else if (commandText.includes("tieng anh") || commandText.includes("english") || commandText === "en") {
        setLanguage("en");
        reply = "Switched to English.";
        handledLocally = true;
      } else if (commandText.includes("hoan thanh") || commandText.includes("complete meal") || commandText.includes("finish cooking")) {
        setShowFinishConfirmation(true);
        reply = "Bạn có chắc muốn hoàn thành món ăn không? Hãy nói có để xác nhận hoặc không để tiếp tục nấu.";
        handledLocally = true;
      } else if (commandText.includes("dung tro ly") || commandText.includes("tat tro ly") || commandText.includes("stop listening")) {
        voiceSessionActiveRef.current = false;
        recognition.stop();
        setIsListening(false);
        reply = "Mình đã dừng trợ lý giọng nói.";
        handledLocally = true;
      } else {
        const stepMatch = commandText.match(/\b(?:buoc|step)\s*(\d+)\b/);
        if (stepMatch) {
          const requestedStep = Number(stepMatch[1]) - 1;
          if (requestedStep >= 0 && requestedStep < recipe.steps.length) {
            selectStepByIndex(requestedStep);
            reply = `Đã chuyển đến bước ${requestedStep + 1}.`;
          } else {
            reply = `Món này chỉ có ${recipe.steps.length} bước.`;
          }
          handledLocally = true;
        } else {
          const ingredientIndex = recipe.ingredients.findIndex((ingredient) => {
            const ingredientName = ingredient.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return commandText.includes(ingredientName);
          });
          if (ingredientIndex >= 0 && (commandText.includes("danh dau") || commandText.includes("check") || commandText.includes("chuan bi"))) {
            setCheckedIngredients((previous) => ({ ...previous, [ingredientIndex]: true }));
            reply = `Đã đánh dấu ${recipe.ingredients[ingredientIndex].name} là đã chuẩn bị.`;
            handledLocally = true;
          }
        }
      }

      if (handledLocally) {
        setAssistantConversation((previous) => [...previous, { role: "user" as const, text: transcript }, { role: "assistant" as const, text: reply }].slice(-8));
        speakAssistantReply(reply);
        return;
      }

      setVoiceLog("Đang suy nghĩ về câu hỏi của bạn...");
      try {
        const answer = await askCookingAssistant(transcript, {
          recipeTitle: recipe.title,
          ingredients: recipe.ingredients.map((ingredient) => `${ingredient.measure} ${ingredient.name}`),
          steps: recipe.steps.map((step, index) => getStepText(index, step.instruction)),
          currentStep: currentStepIndex,
          timerSeconds,
          timerRunning: isTimerRunning,
          conversation: assistantConversation,
        });
        setAssistantConversation((previous) => [...previous, { role: "user" as const, text: transcript }, { role: "assistant" as const, text: answer }].slice(-8));
        speakAssistantReply(answer);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Trợ lý bếp hiện không phản hồi.";
        setVoiceLog(errorMessage);
        speakAssistantReply("Mình chưa kết nối được với trợ lý AI. Bạn thử lại sau một chút nhé.");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceLog(`Voice error: ${event.error}`);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        voiceSessionActiveRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (voiceSessionActiveRef.current) {
        voiceRestartTimeoutRef.current = window.setTimeout(() => {
          voiceRestartTimeoutRef.current = null;
          if (!voiceSessionActiveRef.current) return;
          try {
            recognition.start();
          } catch {
            if (voiceSessionActiveRef.current) {
              recognition.onend?.();
            }
          }
        }, 250);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [assistantConversation, currentStepIndex, finishCooking, getStepText, handleNextStep, handlePrevStep, isTimerRunning, isVietnamese, recipe, selectStepByIndex, setLanguage, speakAssistantReply, speakCurrentStep, timerSeconds, showFinishConfirmation]);

  useEffect(() => {
    return () => {
      voiceSessionActiveRef.current = false;
      if (voiceRestartTimeoutRef.current !== null) {
        window.clearTimeout(voiceRestartTimeoutRef.current);
      }
      recognitionRef.current?.stop();
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStep = recipe.steps[currentStepIndex] || {
    stepNumber: 1,
    instruction: "Prepare your workspace and fresh ingredients.",
  };

  return (
    <div className="min-h-screen bg-[#0b1412] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-950/80 bg-[#0b1412]/95 px-4 py-2.5 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-900/70 bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-900"
            >
              <ArrowLeft className="size-3.5" />
              <span>{isVietnamese ? "Về trang chủ" : "Dashboard"}</span>
            </Link>

            <div className="hidden h-4 w-px bg-emerald-900 sm:block" />

            <div className="hidden items-center gap-2 md:flex">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#17352d] text-[#f3d7a3]">
                <Hand className="size-3" />
              </span>
              <span className="text-xs font-semibold text-emerald-100">
                {isVietnamese ? "Chế độ nấu rảnh tay" : "Hands-free Cooking Mode"}
              </span>
            </div>
          </div>

          {/* Quick Voice & Audio Actions in Header */}
          <div className="flex items-center gap-2">
            {/* Voice Assistant Guide */}
            <button
              type="button"
              onClick={() => setIsVoiceGuideOpen(true)}
              title={isVietnamese ? "Hướng dẫn trợ lý giọng nói" : "Voice assistant guide"}
              aria-label={isVietnamese ? "Hướng dẫn trợ lý giọng nói" : "Voice assistant guide"}
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-200 transition hover:bg-amber-900/50"
            >
              <CircleHelp className="size-3.5" />
              <span className="hidden sm:inline">{isVietnamese ? "Trợ lý giọng nói" : "Voice assistant"}</span>
            </button>

            {/* Voice Control Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition",
                isListening
                  ? "animate-pulse border-red-500 bg-red-500/20 text-red-200"
                  : "border-purple-500/50 bg-purple-950/40 text-purple-200 hover:bg-purple-900/50"
              )}
            >
              <Mic className="size-3.5" />
              <span className="hidden sm:inline">
                {isListening
                  ? isVietnamese
                    ? "Đang nghe..."
                    : "Listening..."
                  : isVietnamese
                    ? "Giọng nói"
                    : "Voice"}
              </span>
            </button>

            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={speakCurrentStep}
              disabled={isSpeaking}
              className="flex items-center gap-1.5 rounded-lg border border-orange-500/50 bg-orange-950/40 px-2.5 py-1 text-xs font-semibold text-orange-200 transition hover:bg-orange-900/50 disabled:opacity-50"
            >
              {isSpeaking ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              <span className="hidden sm:inline">
                {isSpeaking
                  ? isVietnamese
                    ? "Đang đọc..."
                    : "Reading..."
                  : isVietnamese
                    ? "Đọc bước"
                    : "Read"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraEnabled((enabled) => !enabled)}
              title={isCameraEnabled ? (isVietnamese ? "Tắt camera" : "Turn camera off") : (isVietnamese ? "Bật camera" : "Turn camera on")}
              aria-label={isCameraEnabled ? (isVietnamese ? "Tắt camera" : "Turn camera off") : (isVietnamese ? "Bật camera" : "Turn camera on")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition",
                isCameraEnabled
                  ? "border-emerald-700 bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900"
                  : "border-red-500/50 bg-red-950/40 text-red-200 hover:bg-red-900/50"
              )}
            >
              {isCameraEnabled ? <Camera className="size-3.5" /> : <CameraOff className="size-3.5" />}
              <span className="hidden sm:inline">{isCameraEnabled ? (isVietnamese ? "Camera" : "Camera") : (isVietnamese ? "Bật cam" : "Turn on")}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraVisible((visible) => !visible)}
              title={isCameraVisible ? (isVietnamese ? "Ẩn camera" : "Hide camera") : (isVietnamese ? "Hiện camera" : "Show camera")}
              aria-label={isCameraVisible ? (isVietnamese ? "Ẩn camera nhưng vẫn tiếp tục nhận diện" : "Hide camera while keeping detection active") : (isVietnamese ? "Hiện camera" : "Show camera")}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-800 bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-900"
            >
              {isCameraVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              <span className="hidden sm:inline">{isCameraVisible ? (isVietnamese ? "Ẩn cam" : "Hide cam") : (isVietnamese ? "Hiện cam" : "Show cam")}</span>
            </button>

            {recipe.videoUrl && (
              <a
                href={recipe.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-900/50"
              >
                <Video className="size-3.5 text-red-400" />
                <span className="hidden sm:inline">{isVietnamese ? "Video" : "Video"}</span>
              </a>
            )}

            {/* Clear Dual-State Language Switcher */}
            <div className="flex items-center rounded-lg border border-emerald-800 bg-emerald-950 p-0.5 text-xs font-semibold shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-0.5 transition",
                  isVietnamese
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                )}
              >
                <span>🇻🇳</span>
                <span>VI</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-0.5 transition",
                  !isVietnamese
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                )}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl p-3 sm:p-5 lg:p-6">
        {/* Compact Dish Header Card & Mini Camera Bar */}
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-emerald-900/70 bg-gradient-to-r from-[#12211c] via-[#172b25] to-[#12211c] p-3.5 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
          {/* Left: Dish Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-emerald-700/40 sm:size-16">
              <Image
                src={recipe.imageUrl || "/images/roasted-harvest-bowl.jpg"}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge className="border-none bg-[#d97742] px-2 py-0.5 text-[10px] text-white">
                  {translateCategory(recipe.category, isVietnamese)}
                </Badge>
                {recipe.area && (
                  <Badge variant="secondary" className="bg-emerald-950/80 px-2 py-0.5 text-[10px] text-emerald-200">
                    <Globe className="mr-1 size-2.5" />
                    {translateArea(recipe.area, isVietnamese)}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-[11px] text-gray-300">
                  <Clock className="size-3 text-[#d97742]" />
                  {recipe.prepTime} {isVietnamese ? "phút" : "mins"}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-300">
                  <Flame className="size-3 text-orange-400" />
                  {recipe.calories} kcal
                </span>
                <span className="rounded bg-emerald-950/70 px-1.5 py-0.5 text-[10px] text-emerald-300">
                  {translateDifficulty(recipe.difficulty, isVietnamese)}
                </span>
              </div>
              <h1 className="mt-1 font-serif text-lg font-bold text-white sm:text-xl">
                {translateRecipeTitle(recipe.title, isVietnamese)}
              </h1>
            </div>
          </div>

          {/* Right: Compact PiP Camera Widget (Small & Elegant) */}
          <div className="flex items-center justify-between gap-3 border-t border-emerald-900/50 pt-2.5 sm:border-t-0 sm:pt-0">
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-800/80 bg-black shadow-inner sm:h-24 sm:w-36">
              {!isReady && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/90">
                  <Loader2 className="size-4 animate-spin text-emerald-400" />
                  <span className="mt-1 text-[9px] text-emerald-300">
                    {isVietnamese ? "Đang nạp AI" : "AI Loading"}
                  </span>
                </div>
              )}

              {isCameraEnabled && (
                <div className={cn("absolute inset-0 transition-opacity", !isCameraVisible && "pointer-events-none opacity-0")}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="absolute inset-0 h-full w-full object-cover -scale-x-100"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover -scale-x-100"
                  />
                </div>
              )}

              {!isCameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-emerald-300">
                  <CameraOff className="size-5" />
                </div>
              )}

              {/* Live badge overlay */}
              <div className="absolute bottom-1 left-1 right-1 z-20 flex items-center justify-between rounded bg-black/75 px-1.5 py-0.5 text-[9px]">
                <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {lastGesture === "SWIPE_RIGHT"
                    ? isVietnamese
                      ? "👉 Vuốt phải"
                      : "👉 Swipe Right"
                    : lastGesture === "SWIPE_LEFT"
                      ? isVietnamese
                        ? "👈 Vuốt trái"
                        : "👈 Swipe Left"
                      : isVietnamese
                        ? "Chờ bàn tay..."
                        : "Waiting..."}
                </span>
              </div>
            </div>

            {/* Mini Gesture Cheatsheet */}
            <div className="text-[11px] text-gray-300">
              <div className="flex items-center gap-1 text-emerald-300">
                <Hand className="size-3 text-[#d97742]" />
                <span className="font-semibold">{isVietnamese ? "Cử chỉ:" : "Gestures:"}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-gray-400">
                {isVietnamese ? "👉 Phải: Tiếp | 👈 Trái: Lùi" : "👉 Right: Next | 👈 Left: Prev"}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Celebration Notification */}
        {completionNotice && (
          <div className="mb-4 flex items-center justify-center animate-in fade-in slide-in-from-top-2">
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-amber-400/80 bg-gradient-to-r from-amber-600 to-[#d97742] px-5 py-2.5 text-xs font-bold text-white shadow-2xl">
              <Sparkles className="size-4 text-[#f3d7a3] animate-spin" />
              <span>{completionNotice}</span>
            </div>
          </div>
        )}

        {/* Gesture feedback notification toast */}
        {gestureNotice && (
          <div className="mb-4 flex items-center justify-center">
            <div className="inline-flex animate-bounce items-center gap-2 rounded-full border border-emerald-400 bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xl">
              <Sparkles className="size-3.5 text-[#f3d7a3]" />
              <span>{gestureNotice}</span>
            </div>
          </div>
        )}

        {/* Main Cooking Viewport: 8 Cols (Step in Focus) + 4 Cols (Ingredients & Roadmap) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Main Focus: Cooking Steps (8 Cols) */}
          <div className="space-y-4 lg:col-span-8">
            {/* Big Active Step Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-800/80 bg-[#12211c] p-5 shadow-xl sm:p-7">
              {/* Header: Step Number, Title & Smart Timer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-[#d97742] text-sm font-bold text-white shadow-sm">
                    {currentStep.stepNumber}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {isVietnamese
                      ? `Bước ${currentStep.stepNumber} / ${recipe.steps.length}`
                      : `Step ${currentStep.stepNumber} of ${recipe.steps.length}`}
                  </span>
                </div>

                {/* Step Timer Control */}
                {timerSeconds > 0 && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-800/50 bg-amber-950/40 px-3 py-1">
                    <Clock className="size-3.5 text-amber-300" />
                    <span className="font-mono text-base font-bold text-amber-300">
                      {formatTimer(timerSeconds)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning((prev) => !prev)}
                      className={cn(
                        "ml-1 flex size-6 items-center justify-center rounded-md text-xs font-semibold transition",
                        isTimerRunning
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      )}
                    >
                      {isTimerRunning ? <Pause className="size-3" /> : <Play className="size-3 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(getRecipeStepDuration(recipe, currentStepIndex));
                      }}
                      className="text-amber-400 hover:text-amber-200"
                    >
                      <RotateCcw className="size-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Large High-Contrast Step Text */}
              <div className="py-6 sm:py-8">
                <p className="font-serif text-xl font-medium leading-relaxed text-emerald-50 sm:text-2xl lg:text-3xl">
                  {getStepText(currentStepIndex, currentStep.instruction)}
                </p>
              </div>

              {/* Step Progress Bar */}
              <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#d97742] transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
                  }}
                />
              </div>

              {/* Bottom Actions: Previous / Next Step & Read */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="h-11 flex-1 gap-1.5 border-emerald-900 bg-emerald-950/50 text-xs font-semibold text-emerald-200 hover:bg-emerald-900 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                  <span>{isVietnamese ? "Bước trước" : "Previous"}</span>
                </Button>

                <Button
                  onClick={handleNextStep}
                  disabled={currentStepIndex === recipe.steps.length - 1}
                  className="h-11 flex-1 gap-1.5 bg-[#d97742] text-xs font-semibold text-white shadow-md hover:bg-[#bf6132] disabled:opacity-40"
                >
                  <span>{isVietnamese ? "Bước tiếp theo" : "Next Step"}</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFinishConfirmation(true)}
                className="mt-4 h-11 w-full gap-2 border-emerald-800 bg-emerald-950/40 text-sm font-semibold text-emerald-200 hover:bg-emerald-900"
              >
                <CheckCircle2 className="size-4" />
                {isVietnamese ? "Hoàn thành món" : "Complete meal"}
              </Button>
            </div>

            {/* Quick All-Steps Timeline Road */}
            <div className="rounded-2xl border border-emerald-900/70 bg-[#12211c] p-4 shadow-md">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                {isVietnamese ? "Lộ trình các bước" : "Step Timeline"}
              </h3>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {recipe.steps.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => selectStepByIndex(idx)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition",
                      idx === currentStepIndex
                        ? "border border-emerald-500 bg-emerald-950/80 shadow-sm"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        idx === currentStepIndex
                          ? "bg-[#d97742] text-white"
                          : "bg-emerald-950 text-emerald-300"
                      )}
                    >
                      {s.stepNumber}
                    </span>
                    <p
                      className={cn(
                        "line-clamp-2 leading-snug",
                        idx === currentStepIndex ? "font-medium text-white" : "text-gray-400"
                      )}
                    >
                      {getStepText(idx, s.instruction)}
                    </p>
                    <span className="ml-auto shrink-0 pt-0.5 font-mono text-[10px] text-amber-300">
                      {formatTimer(getRecipeStepDuration(recipe, idx))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Ingredients & Preparation (4 Cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-emerald-900/70 bg-[#12211c] p-4 shadow-md sm:p-5">
              <div className="mb-3 flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="size-4 text-emerald-400" />
                  <h3 className="font-serif text-base font-bold text-white">
                    {isVietnamese ? `Nguyên liệu (${recipe.ingredients.length})` : `Ingredients (${recipe.ingredients.length})`}
                  </h3>
                </div>
                <span className="text-[10px] text-gray-400">
                  {isVietnamese ? "Tích để chuẩn bị" : "Check to prepare"}
                </span>
              </div>

              {/* Ingredients Checklist with Scroll */}
              <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setCheckedIngredients((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }))
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs transition",
                        isChecked
                          ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-200 line-through opacity-65"
                          : "border-emerald-950 bg-[#09110f] text-gray-200 hover:border-emerald-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={cn(
                            "size-3.5 shrink-0 transition",
                            isChecked ? "text-emerald-400" : "text-gray-600"
                          )}
                        />
                        <span className="font-medium">
                          {translateIngredientName(ing.name, isVietnamese)}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#d97742]">
                        {translateMeasure(ing.measure, isVietnamese)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assistant Tips Card */}
            <div className="rounded-2xl border border-emerald-950 bg-[#09110f] p-3.5 text-xs text-gray-400">
              {voiceLog && (
                <div className="mb-2.5 rounded-lg border border-purple-900/60 bg-purple-950/30 p-2 text-[11px] text-purple-200">
                  <span className="font-semibold text-gray-400">{isVietnamese ? "Khẩu lệnh:" : "Heard:"}</span> {voiceLog}
                </div>
              )}
              <p className="font-semibold text-emerald-300">
                {isVietnamese ? "💬 Khẩu lệnh giọng nói hỗ trợ:" : "💬 Supported Voice Commands:"}
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-gray-300">
                <li>• &ldquo;{isVietnamese ? "tiếp theo" : "next"}&rdquo; : {isVietnamese ? "Bước kế tiếp" : "Next step"}</li>
                <li>• &ldquo;{isVietnamese ? "quay lại" : "back"}&rdquo; : {isVietnamese ? "Bước trước" : "Previous step"}</li>
                <li>• &ldquo;{isVietnamese ? "đọc hướng dẫn" : "read step"}&rdquo; : {isVietnamese ? "Đọc to câu hướng dẫn" : "Read step aloud"}</li>
                <li>• &ldquo;{isVietnamese ? "bắt đầu hẹn giờ" : "start timer"}&rdquo; : {isVietnamese ? "Bật đồng hồ đếm ngược" : "Start timer"}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <VoiceAssistantModal
        isVietnamese={isVietnamese}
        isOpen={isVoiceGuideOpen}
        voiceLog={voiceLog}
        assistantReply={assistantReply}
        isListening={isListening}
        onClose={() => setIsVoiceGuideOpen(false)}
        onStart={() => { setIsVoiceGuideOpen(false); if (!isListening) toggleListening(); }}
      />

      <FinishCookingModal
        isVietnamese={isVietnamese}
        isOpen={showFinishConfirmation}
        onCancel={() => setShowFinishConfirmation(false)}
        onConfirm={finishCooking}
      />
    </div>
  );
}

