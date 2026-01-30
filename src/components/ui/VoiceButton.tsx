"use client";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface VoiceButtonProps {
    onTranscript: (text: string) => void;
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
    const { isListening, transcript, isSupported, error, startListening, stopListening, resetTranscript } = useVoiceInput();

    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
            resetTranscript();
        }
    }, [transcript, onTranscript, resetTranscript]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (!isSupported) {
        return (
            <button
                disabled
                className="p-3 rounded-xl bg-slate-800/50 text-slate-600 cursor-not-allowed"
                title="Voice input not supported in this browser"
            >
                <MicOff size={20} />
            </button>
        );
    }

    return (
        <motion.button
            onClick={isListening ? stopListening : startListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl transition-all ${isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                }`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
        >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </motion.button>
    );
}
