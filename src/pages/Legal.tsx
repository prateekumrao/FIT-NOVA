// ========================================
// pages/Legal.tsx
// Purpose: Privacy Policy and Terms and Conditions (one component, two content sets).
// IMPORTANT: this text is a starting TEMPLATE. Have a qualified lawyer review it before launch.
// ========================================
import SectionHeading from '../components/SectionHeading';
import Disclaimer from '../components/Disclaimer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Section { heading: string; body: string }

const privacy: Section[] = [
  { heading: 'What we collect', body: 'Account details you provide (name, email), fitness preferences, and the activity, habit, water, sleep and meal entries you choose to log.' },
  { heading: 'How we use it', body: 'To show your dashboard and reports, personalise suggestions, and improve the product. We do not sell your personal data.' },
  { heading: 'AI Coach conversations', body: 'Messages you send to the AI Coach may be processed by a cloud AI provider to generate replies. You can turn off conversation history in Settings.' },
  { heading: 'Demo build notice', body: 'This demo stores data only in your own browser. Nothing is sent to a server until the backend is connected.' },
  { heading: 'Your choices', body: 'You can export your data, reset it or delete your account at any time from Settings.' },
  { heading: 'Contact', body: 'Questions about privacy? Use the Contact page and we will respond.' },
];

const terms: Section[] = [
  { heading: 'Using FitNova AI', body: 'You must provide accurate information and keep your login details safe. You are responsible for activity under your account.' },
  { heading: 'Not medical advice', body: 'FitNova AI offers general educational information only. It is not a substitute for professional medical, nutrition or fitness advice. Consult a qualified professional before changing your exercise or diet.' },
  { heading: 'AI-generated content', body: 'AI responses can be incomplete or wrong. Use your judgement and stop any activity that causes pain or discomfort.' },
  { heading: 'Plans and payments', body: 'Prices shown are illustrative. When paid plans launch, billing terms will be shown before you subscribe.' },
  { heading: 'Acceptable use', body: 'Do not misuse the service, attempt to break its security, or upload unlawful content.' },
  { heading: 'Changes', body: 'We may update these terms as the product grows. Material changes will be announced in the app.' },
];

export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  useDocumentTitle(isPrivacy ? 'Privacy Policy' : 'Terms and Conditions');
  const sections = isPrivacy ? privacy : terms;
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <SectionHeading as="h1" title={isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'} text="Draft for the demo build. Last updated at launch review." />
      <div className="space-y-8">
        {sections.map((s) => <section key={s.heading}><h2 className="text-lg font-bold">{s.heading}</h2><p className="mt-2 leading-relaxed text-soft">{s.body}</p></section>)}
      </div>
      <div className="mt-12"><Disclaimer>This page is a template written for development. It is not legal advice, so have it reviewed by a qualified lawyer before real users sign up.</Disclaimer></div>
    </div>
  );
}
