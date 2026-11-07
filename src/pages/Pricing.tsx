// Purpose: Pricing and subscription page. Prices are illustrative and no payment is processed.
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import PricingCards from '../components/PricingCards';
import Disclaimer from '../components/Disclaimer';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Pricing() {
  useDocumentTitle('Pricing');
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading as="h1" center title="Plans for every routine" text="Start free. Upgrade when you want more AI guidance and deeper reports. Cancel any time." />
      <PricingCards />
      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
        <Card>
          <h2 className="font-bold">How billing will work</h2>
          <p className="mt-2 text-sm leading-relaxed text-soft">Payments are not connected in this demo. When launched, paid plans will be handled by a secure payment provider through the backend, and FitNova AI will never store card numbers in the app.</p>
        </Card>
        <Card>
          <h2 className="font-bold">Have a question?</h2>
          <p className="mt-2 text-sm leading-relaxed text-soft">{user ? `You are on the ${user.plan} plan. ` : ''}Need help choosing? <Link to="/contact" className="text-accent underline">Contact us</Link> and we will help you pick.</p>
        </Card>
      </div>
      <div className="mx-auto mt-8 max-w-4xl"><Disclaimer>Prices are illustrative and may change before launch. Voice AI features are planned and not yet available.</Disclaimer></div>
    </div>
  );
}
