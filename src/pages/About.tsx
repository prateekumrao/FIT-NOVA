// Purpose: About Us page: introduction, mission, vision, product philosophy and roadmap (planned items only).
import SectionHeading from '../components/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Feedback';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const philosophy = [
  { title: 'Education first', text: 'We explain the why behind every suggestion so you can make your own informed choices.' },
  { title: 'Habits over extremes', text: 'Small, repeatable actions beat short bursts of intensity. We design for the long run.' },
  { title: 'Your own progress', text: 'Reports compare you with your past self only. No body comparisons, ever.' },
  { title: 'Made for India', text: 'Familiar foods, local languages and realistic routines are part of the product, not an afterthought.' },
];

const roadmap = [
  { when: 'Now', title: 'Frontend experience', text: 'Design system, demo AI Coach, libraries and trackers.' },
  { when: 'Next', title: 'Backend and real accounts', text: 'FastAPI services, PostgreSQL storage and secure authentication.' },
  { when: 'Then', title: 'Live AI Coach', text: 'Cloud AI integration with safety guardrails and conversation memory controls.' },
  { when: 'Later', title: 'Voice and more languages', text: 'Voice coaching and translated content, beginning with Hindi.' },
];

export default function About() {
  useDocumentTitle('About us');
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading as="h1" title="About FitNova AI" text="We are building a calm, trustworthy home for fitness and wellness, with an AI coach that explains instead of pressures." />
      <div className="grid gap-5 md:grid-cols-2">
        <Card><h2 className="text-xl font-bold">Our mission</h2><p className="mt-3 text-soft">Make healthy routines easier to start and easier to keep, by turning clear guidance and simple tracking into everyday habits.</p></Card>
        <Card><h2 className="text-xl font-bold">Our vision</h2><p className="mt-3 text-soft">A world where anyone, anywhere, has a knowledgeable and kind fitness companion in their own language.</p></Card>
      </div>

      <h2 className="mb-6 mt-20 text-2xl font-extrabold">Product philosophy</h2>
      <div className="grid gap-5 sm:grid-cols-2">{philosophy.map((p) => <Card key={p.title}><h3 className="font-bold">{p.title}</h3><p className="mt-2 text-sm leading-relaxed text-soft">{p.text}</p></Card>)}</div>

      <h2 className="mb-2 mt-20 text-2xl font-extrabold">Roadmap</h2>
      <p className="mb-6 text-sm text-soft">Plans may change. Items beyond "Now" are not yet available.</p>
      <ol className="space-y-4 border-l border-line pl-6">
        {roadmap.map((r) => (
          <li key={r.title} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-2" />
            <Badge tone={r.when === 'Now' ? 'sage' : 'neutral'}>{r.when}</Badge>
            <p className="mt-2 font-bold">{r.title}</p><p className="text-sm text-soft">{r.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-16 text-center"><Button to="/contact" variant="secondary">Get in touch</Button></div>
    </div>
  );
}
