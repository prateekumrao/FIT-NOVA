// ========================================
// pages/Coach.tsx
// Purpose: AI Fitness Coach chat. Replies are MOCK for now (services/coachService.ts).
// To go live: point coachService at your FastAPI endpoint, which calls the cloud AI API server-side.
// ========================================

// SECTION 1: IMPORTS
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { History, Mic, Plus, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import Disclaimer from '../components/Disclaimer';
import { suggestedQuestions } from '../data/coachReplies';
import { coachService } from '../services/coachService';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { ChatMessage } from '../types';
import { cn } from '../utils/cn';

// SECTION 2: TYPES AND INTERFACES
interface Conversation { id: string; title: string; messages: ChatMessage[] }

const timeNow = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const makeId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const greeting = (): ChatMessage => ({ id: makeId(), role: 'assistant', time: timeNow(), text: 'Hi, I am Nova, your AI fitness coach. Ask me about workouts, simple meals, habits, water or sleep. I share general educational information only.' });
const newConversation = (): Conversation => ({ id: makeId(), title: 'New conversation', messages: [greeting()] });

export default function Coach() {
  useDocumentTitle('AI Coach');

  // SECTION 3: COMPONENT STATE
  const { user } = useAuth();
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('fitnova.coach', () => [newConversation()]);
  const [activeId, setActiveId] = useState(conversations[0].id); // which conversation is open
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false); // true while waiting for the reply (shows typing dots)
  const [showHistory, setShowHistory] = useState(false); // history drawer on small screens
  const [voiceOpen, setVoiceOpen] = useState(false); // voice-input placeholder panel
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  // Keep the newest message in view
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [active.messages.length, thinking]);

  // SECTION 4: EVENT HANDLERS
  /** Add a message to the open conversation. */
  function appendMessage(convoId: string, message: ChatMessage, title?: string) {
    setConversations((list) => list.map((c) => c.id !== convoId ? c : { ...c, title: title ?? c.title, messages: [...c.messages, message] }));
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const convoId = active.id;
    const isFirst = active.messages.filter((m) => m.role === 'user').length === 0;
    appendMessage(convoId, { id: makeId(), role: 'user', text: trimmed, time: timeNow() }, isFirst ? trimmed.slice(0, 36) : undefined);
    setInput('');
    setThinking(true);
    try {
      const reply = await coachService.sendMessage(trimmed, active.messages);
      appendMessage(convoId, { id: makeId(), role: 'assistant', text: reply, time: timeNow() });
    } catch {
      appendMessage(convoId, { id: makeId(), role: 'assistant', text: 'Sorry, I could not reach the coach right now. Please try again.', time: timeNow() });
    } finally {
      setThinking(false);
    }
  }

  function handleSubmit(e: FormEvent) { e.preventDefault(); void send(input); }

  function startNew() {
    const convo = newConversation();
    setConversations((list) => [convo, ...list]);
    setActiveId(convo.id);
    setShowHistory(false);
  }

  const historyList = (
    <div className="space-y-1">
      {conversations.map((c) => (
        <button key={c.id} onClick={() => { setActiveId(c.id); setShowHistory(false); }} className={cn('w-full truncate rounded-xl px-3 py-2.5 text-left text-sm transition', c.id === active.id ? 'bg-raised text-ink' : 'text-soft hover:bg-panel')}>{c.title}</button>
      ))}
    </div>
  );

  // SECTION 5: UI RENDERING
  return (
    <div className="grid h-[calc(100dvh-13rem)] min-h-[30rem] gap-5 md:h-[calc(100dvh-9rem)] lg:grid-cols-[16rem_1fr]">
      {/* Conversation history (desktop column) */}
      <Card className="hidden overflow-y-auto lg:block" padded={false}>
        <div className="p-4"><Button onClick={startNew} variant="secondary" className="w-full" icon={<Plus size={16} />}>New chat</Button></div>
        <p className="px-5 pb-2 text-xs font-semibold text-soft">Conversation history</p>
        <div className="px-3 pb-3">{historyList}</div>
      </Card>

      <Card padded={false} className="relative flex min-h-0 flex-col">
        {/* AI assistant profile */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/15 text-accent"><Sparkles size={20} /></span>
            <div><p className="font-bold">Nova</p><p className="text-xs text-soft">AI Fitness Coach · demo responses</p></div>
          </div>
          <div className="flex gap-2 lg:hidden">
            <Button size="sm" variant="secondary" onClick={() => setShowHistory((s) => !s)} icon={<History size={15} />}>History</Button>
            <Button size="sm" variant="secondary" onClick={startNew} aria-label="New chat" icon={<Plus size={15} />} />
          </div>
        </div>

        {/* History drawer for tablets and phones */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-3 top-[76px] z-10 max-h-64 overflow-y-auto rounded-2xl border border-line bg-raised p-2 shadow-soft lg:hidden">{historyList}</motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {active.messages.map((m) => (
            <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]', m.role === 'user' ? 'rounded-br-md bg-accent text-bg' : 'rounded-bl-md border border-line bg-panel')}>
                {m.text}
                <span className={cn('mt-1.5 block text-[10px]', m.role === 'user' ? 'text-bg/60' : 'text-soft/70')}>{m.role === 'user' ? user?.name.split(' ')[0] : 'Nova'} · {m.time}</span>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex" aria-label="Nova is typing">
              <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-line bg-panel px-4 py-3.5">
                {[0, 1, 2].map((i) => <motion.span key={i} className="h-2 w-2 rounded-full bg-accent-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions appear until the first user message */}
        {active.messages.length <= 1 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
            {suggestedQuestions.map((q) => <Chip key={q} onClick={() => send(q)}>{q}</Chip>)}
          </div>
        )}

        {/* Voice input placeholder */}
        <AnimatePresence>
          {voiceOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-line bg-panel/60">
              <div className="flex items-center gap-4 px-5 py-4">
                <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent"><Mic size={20} /></motion.span>
                <p className="flex-1 text-sm text-soft">Voice conversations are a Premium feature coming in a future release. This panel shows where the microphone interface will live.</p>
                <button onClick={() => setVoiceOpen(false)} aria-label="Close voice panel" className="rounded-lg p-2 text-soft hover:text-ink"><X size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-line p-4 sm:px-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <button type="button" onClick={() => setVoiceOpen((v) => !v)} aria-label="Voice input" aria-pressed={voiceOpen} className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition', voiceOpen ? 'border-accent text-accent' : 'border-line text-soft hover:text-ink')}><Mic size={18} /></button>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Nova about workouts, food or habits" aria-label="Message" className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-panel px-4 text-sm placeholder:text-soft/60 focus:border-accent-2 focus:outline-none" />
            <Button type="submit" aria-label="Send message" disabled={!input.trim() || thinking} icon={<Send size={16} />} className="w-11 !px-0" />
          </form>
          <div className="mt-3"><Disclaimer /></div>
        </div>
      </Card>
    </div>
  );
}
