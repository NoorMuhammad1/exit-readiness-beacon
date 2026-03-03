// AI Voice Widget — PE Ready Advisor
// Floating conversational AI guide powered by ElevenLabs
// Embeds on all 3 MVP modules + Reality Check results

import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, X, Volume2, Loader2 } from 'lucide-react';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;

export interface AIVoiceContext {
  module: string;
  user_name?: string;
  revenue?: number;
  ebitda?: number;
  perceived_value?: number;
  pe_value?: number;
  gap?: number;
  industry?: string;
}

interface AIVoiceWidgetProps {
  context: AIVoiceContext;
}

export default function AIVoiceWidget({ context }: AIVoiceWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onDisconnect: () => {},
    onError: (msg: string) => setError(msg),
  });

  const { status, isSpeaking } = conversation;
  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';

  const startConversation = useCallback(async () => {
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Build dynamic variables — only include defined values
      const dynamicVariables: Record<string, string | number> = {
        module: context.module,
      };
      if (context.user_name) dynamicVariables.user_name = context.user_name;
      if (context.revenue)        dynamicVariables.revenue = context.revenue;
      if (context.ebitda)         dynamicVariables.ebitda = context.ebitda;
      if (context.perceived_value) dynamicVariables.perceived_value = context.perceived_value;
      if (context.pe_value)       dynamicVariables.pe_value = context.pe_value;
      if (context.gap)            dynamicVariables.gap = context.gap;
      if (context.industry)       dynamicVariables.industry = context.industry;

      await conversation.startSession({
        agentId: AGENT_ID,
        dynamicVariables,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone in your browser.');
      } else {
        setError('Could not start session. Please try again.');
      }
    }
  }, [conversation, context]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (isActive || isConnecting) {
      // Don't close while active — user must stop first
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = async () => {
    if (isActive || isConnecting) {
      await endConversation();
    }
    setIsOpen(false);
    setError(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      {isOpen && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-72 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-green-400 animate-pulse' :
                isConnecting ? 'bg-yellow-400 animate-pulse' :
                'bg-white/30'
              }`} />
              <span className="text-sm font-semibold text-white">PE Ready Advisor</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/40 hover:text-white/80 transition-colors"
              aria-label="Close advisor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-5 space-y-4">
            {/* Module label */}
            <p className="text-xs text-white/40 uppercase tracking-widest">{context.module}</p>

            {/* Status display */}
            {!isActive && !isConnecting && (
              <p className="text-sm text-white/70 leading-relaxed">
                Ask me anything about this module, or let me walk you through it.
              </p>
            )}
            {isConnecting && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Connecting...</span>
              </div>
            )}
            {isActive && (
              <div className="flex items-center gap-3">
                {isSpeaking ? (
                  <>
                    <Volume2 className="w-5 h-5 text-accent animate-pulse" />
                    <span className="text-sm text-white/80">Advisor is speaking...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-green-400 animate-pulse" />
                    <span className="text-sm text-white/80">Listening...</span>
                  </>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            )}

            {/* Action button */}
            {!isActive && !isConnecting ? (
              <button
                onClick={startConversation}
                className="w-full py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Start Conversation
              </button>
            ) : (
              <button
                onClick={endConversation}
                disabled={isConnecting}
                className="w-full py-2.5 bg-white/10 text-white/80 text-sm font-semibold rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MicOff className="w-4 h-4" />
                End Conversation
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={handleToggle}
        aria-label="Open PE Ready Advisor"
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-semibold text-sm transition-all ${
          isActive
            ? 'bg-accent text-white ring-2 ring-accent/50 ring-offset-2 ring-offset-background'
            : 'bg-[#0d0d0d] border border-white/20 text-white hover:border-white/40'
        }`}
      >
        {isActive ? (
          <Volume2 className="w-4 h-4 animate-pulse" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        <span>AI Advisor</span>
        {isActive && (
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        )}
      </button>
    </div>
  );
}
