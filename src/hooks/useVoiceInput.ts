import { useCallback, useEffect, useRef, useState } from "react";

// Minimal Web Speech API wrapper. Frontend only — no audio is ever sent or stored.
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useVoiceInput(opts?: { lang?: string }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(!!getRecognitionCtor());
  }, []);

  const start = useCallback(
    (onFinal?: (text: string) => void) => {
      const Ctor = getRecognitionCtor();
      if (!Ctor) return false;
      const rec = new Ctor();
      rec.lang = opts?.lang ?? "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onresult = (e: any) => {
        let finalText = "";
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interim += r[0].transcript;
        }
        const text = (finalText || interim).trim();
        setTranscript(text);
        if (finalText && onFinal) onFinal(finalText.trim());
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
        return true;
      } catch {
        setListening(false);
        return false;
      }
    },
    [opts?.lang]
  );

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  return { supported, listening, transcript, start, stop, setTranscript };
}
