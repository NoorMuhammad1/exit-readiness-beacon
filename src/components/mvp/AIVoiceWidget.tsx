// AI Voice Widget — PE Ready Advisor
// Narration-first: agent explains the module, then opens for Q&A.
// Phase flow: idle → narrating (agent speaks, mic locked) → qa (full conversation)

import { useState, useCallback, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, X, Volume2, Loader2, ChevronRight, MessageCircle } from 'lucide-react';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;

// How long (ms) the agent must be silent after first speaking before we
// auto-advance from narration → Q&A. Prevents switching on short mid-sentence pauses.
const NARRATION_SILENCE_THRESHOLD = 3500;

export interface AIVoiceContext {
  module: string;
  narrationTopic?: string;   // what the agent should narrate (passed as dynamic variable)
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

type Phase = 'narrating' | 'qa';

export default function AIVoiceWidget({ context }: AIVoiceWidgetProps) {
  const [isOpen, setIsOpen]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [phase, setPhase]       = useState<Phase>('narrating');

  // Track whether the agent has ever started speaking in this session
  const hasEverSpoken     = useRef(false);
  const silenceTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conversation = useConversation({
    onConnect:    () => { setError(null); setPhase('narrating'); },
    onDisconnect: () => { hasEverSpoken.current = false; setPhase('narrating'); },
    onError:      (msg: string) => setError(msg),
  });

  const { status, isSpeaking } = conversation;
  const isActive     = status === 'connected';
  const isConnecting = status === 'connecting';

  // ── Narration phase tracker ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive || phase === 'qa') return;

    if (isSpeaking) {
      // Agent started speaking — record this and cancel any pending silence timer
      hasEverSpoken.current = true;
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    } else if (hasEverSpoken.current) {
      // Agent went silent after having spoken — start the threshold timer
      silenceTimer.current = setTimeout(() => {
        setPhase('qa');
      }, NARRATION_SILENCE_THRESHOLD);
    }

    return () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [isSpeaking, isActive, phase]);

  // ── Session management ──────────────────────────────────────────────────────
  const startConversation = useCallback(async () => {
    setError(null);
    hasEverSpoken.current = false;
    setPhase('narrating');

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const dynamicVariables: Record<string, string | number> = {
        module: context.module,
        narration_mode: 'true',
      };
      if (context.narrationTopic)   dynamicVariables.narration_topic   = context.narrationTopic;
      if (context.user_name)        dynamicVariables.user_name         = context.user_name;
      if (context.revenue)          dynamicVariables.revenue           = context.revenue;
      if (context.ebitda)           dynamicVariables.ebitda            = context.ebitda;
      if (context.perceived_value)  dynamicVariables.perceived_value   = context.perceived_value;
      if (context.pe_value)         dynamicVariables.pe_value          = context.pe_value;
      if (context.gap)              dynamicVariables.gap               = context.gap;
      if (context.industry)         dynamicVariables.industry          = context.industry;

      await conversation.startSession({ agentId: AGENT_ID, dynamicVariables });
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone in your browser.');
      } else {
        setError('Could not start session. Please try again.');
      }
    }
  }, [conversation, context]);

  const endConversation = useCallback(async () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    await conversation.endSession();
  }, [conversation]);

  const handleClose = async () => {
    if (isActive || isConnecting) await endConversation();
    setIsOpen(false);
    setError(null);
    setPhase('narrating');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded panel ── */}
      {isOpen && (
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-80 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors ${
                isActive     ? (phase === 'narrating' ? 'bg-blue-400 animate-pulse' : 'bg-green-400 animate-pulse')
                : isConnecting ? 'bg-yellow-400 animate-pulse'
                : 'bg-white/30'
              }`} />
              <span className="text-sm font-semibold text-white">PE Ready Advisor</span>
              {isActive && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  phase === 'narrating'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {phase === 'narrating' ? 'Explaining' : 'Q&A'}
                </span>
              )}
            </div>
            <button onClick={handleClose} className="text-white/40 hover:text-white/80 transition-colors" aria-label="Close advisor">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-5 space-y-4">
            <p className="text-xs text-white/40 uppercase tracking-widest">{context.module}</p>

            {/* ── Not yet started ── */}
            {!isActive && !isConnecting && (
              <>
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 space-y-1.5">
                  <p className="text-sm font-semibold text-blue-300">How it works</p>
                  <ol className="text-sm text-white/60 space-y-1 list-none">
                    <li className="flex gap-2"><span className="text-blue-400 font-bold">1.</span> Advisor explains this module</li>
                    <li className="flex gap-2"><span className="text-blue-400 font-bold">2.</span> You listen — mic is off during explanation</li>
                    <li className="flex gap-2"><span className="text-blue-400 font-bold">3.</span> Then ask any questions you have</li>
                  </ol>
                </div>
                {error && <p className="text-xs text-red-400 leading-relaxed">{error}</p>}
                <button
                  onClick={startConversation}
                  className="w-full py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Start Explanation
                </button>
              </>
            )}

            {/* ── Connecting ── */}
            {isConnecting && (
              <div className="flex items-center gap-2 text-yellow-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Connecting advisor...</span>
              </div>
            )}

            {/* ── Narration phase ── */}
            {isActive && phase === 'narrating' && (
              <>
                <div className="flex items-center gap-3 py-2">
                  {isSpeaking ? (
                    <>
                      <div className="flex gap-0.5 items-end h-6">
                        {[3, 5, 7, 4, 6].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-blue-400 rounded-full animate-pulse"
                            style={{ height: `${h * 3}px`, animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-white/80">Advisor is explaining...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-blue-400/60" />
                      <span className="text-sm text-white/50 italic">Preparing next section...</span>
                    </>
                  )}
                </div>

                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/40 mb-1">During the explanation you can say:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['"Slow down"', '"Repeat that"', '"Pause"'].map((hint) => (
                      <span key={hint} className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-md">
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPhase('qa')}
                  className="w-full py-2 text-sm text-white/50 hover:text-white/80 transition flex items-center justify-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  Skip to Q&A
                </button>
              </>
            )}

            {/* ── Q&A phase ── */}
            {isActive && phase === 'qa' && (
              <>
                <div className="flex items-center gap-3 py-1">
                  {isSpeaking ? (
                    <>
                      <Volume2 className="w-5 h-5 text-accent animate-pulse" />
                      <span className="text-sm text-white/80">Advisor is speaking...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 text-green-400 animate-pulse" />
                      <span className="text-sm text-white/80">Listening — ask your question</span>
                    </>
                  )}
                </div>

                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-xs text-white/50">
                    Microphone is now active. Speak naturally — the advisor will answer.
                  </p>
                </div>

                <button
                  onClick={endConversation}
                  className="w-full py-2.5 bg-white/10 text-white/80 text-sm font-semibold rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                >
                  <MicOff className="w-4 h-4" />
                  End Conversation
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Trigger button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open PE Ready Advisor"
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-semibold text-sm transition-all ${
          isActive && phase === 'qa'
            ? 'bg-accent text-white ring-2 ring-accent/50 ring-offset-2 ring-offset-background'
            : isActive && phase === 'narrating'
            ? 'bg-blue-600 text-white ring-2 ring-blue-400/40 ring-offset-2 ring-offset-background'
            : 'bg-[#0d0d0d] border border-white/20 text-white hover:border-white/40'
        }`}
      >
        {isActive && phase === 'qa'   ? <Mic className="w-4 h-4" />
         : isActive && phase === 'narrating' ? <Volume2 className="w-4 h-4 animate-pulse" />
         : <MessageCircle className="w-4 h-4" />}
        <span>
          {isActive && phase === 'narrating' ? 'AI Explaining'
           : isActive && phase === 'qa'      ? 'AI Advisor'
           : 'AI Advisor'}
        </span>
        {isActive && (
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            phase === 'narrating' ? 'bg-blue-300' : 'bg-green-400'
          }`} />
        )}
      </button>

    </div>
  );
}
