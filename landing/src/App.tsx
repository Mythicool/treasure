import { useState } from 'react';
import {
  MapPin,
  Trophy,
  Smartphone,
  Users,
  Star,
  ArrowRight,
  Check,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Local Treasure Hunts
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <a href="/dashboard" className="btn-secondary">Business Login</a>
              <a href="#get-started" className="btn-primary">Get Started</a>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#features" className="block px-3 py-2 text-gray-600">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600">Pricing</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600">Contact</a>
              <a href="/dashboard" className="block px-3 py-2 text-gray-600">Business Login</a>
              <a href="#get-started" className="block px-3 py-2 text-primary-600 font-medium">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white py-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full bg-primary-200 blur-3xl opacity-50" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-purple-200 blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Turn Your City Into a
              <span className="text-primary-600"> Treasure Hunt</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create engaging GPS-based treasure hunts that drive foot traffic to your business.
              Customers explore, discover, and unlock real rewards while having fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#get-started" className="btn-primary text-lg">
                Start Your Hunt
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#demo" className="btn-secondary text-lg">
                Watch Demo
              </a>
            </div>
            {/* Repeat primary CTA after fold suggestion: keep as section below */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Amazing Treasure Hunts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to create, manage, and track GPS-based treasure hunts
              that engage customers and drive business results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-primary-600" />}
              title="GPS-Based Loot Boxes"
              description="Place virtual treasure boxes at specific locations. Customers must physically visit to claim rewards."
            />
            <FeatureCard
              icon={<Smartphone className="h-8 w-8 text-primary-600" />}
              title="Mobile-First Experience"
              description="Beautiful mobile app for iOS and Android. Easy-to-use interface for both businesses and customers."
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8 text-primary-600" />}
              title="Flexible Rewards"
              description="Offer discounts, free items, loyalty points, or custom rewards. Full control over your incentives."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Customer Analytics"
              description="Track engagement, foot traffic, and conversion rates. Understand your customers better."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-primary-600" />}
              title="Gamification"
              description="Leaderboards, achievements, and social sharing keep customers engaged and coming back."
            />
            <FeatureCard
              icon={<Check className="h-8 w-8 text-primary-600" />}
              title="Anti-Fraud Protection"
              description="Built-in security measures prevent GPS spoofing and ensure legitimate claims only."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple three-step process
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Hunt"
              description="Set up your treasure hunt with our easy-to-use dashboard. Add locations, rewards, and customize the experience."
            />
            <StepCard
              number="2"
              title="Place Loot Boxes"
              description="Drop virtual treasure boxes at strategic locations around your business or city. Set rewards and claim limits."
            />
            <StepCard
              number="3"
          {/* Brand trust section */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-widest text-gray-500">Trusted by local favorites</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center opacity-80">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-md" />
                ))}
              </div>
            </div>
          </section>
              title="Watch Engagement Soar"
              description="Customers discover and claim treasures, driving foot traffic and engagement. Track results in real-time."
            />
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Businesses and Customers Alike
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how Local Treasure Hunts is helping businesses create unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Business Owner {i}</p>
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "We've seen a significant increase in foot traffic and customer engagement. The treasure hunt concept is brilliant!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              name="Starter"
              price="$29"
              period="per month"
              features={[
                "Up to 1,000 claims/month",
                "3 active hunts",
                "Basic analytics",
                "Email support",
                "Mobile app access"
              ]}
              popular={false}
            />
            <PricingCard
              name="Professional"
              price="$79"
              period="per month"
              features={[
                "Up to 5,000 claims/month",
                "10 active hunts",
                "Advanced analytics",
                "Priority support",
                "Custom branding",
                "API access"
              ]}
              popular={true}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period="contact us"
              features={[
                "Unlimited claims",
                "Unlimited hunts",
                "White-label solution",
                "Dedicated support",
                "Custom integrations",
                "SLA guarantee"
              ]}
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Treasure Hunt?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using Local Treasure Hunts to engage customers
            and drive foot traffic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors">
              Start Free Trial
            </a>
            <a href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-primary-400" />
                <span className="ml-2 text-lg font-bold">Local Treasure Hunts</span>
              </div>
              <p className="text-gray-400">
                Transform your business with engaging GPS-based treasure hunts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#docs" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Local Treasure Hunts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-6">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

function PricingCard({ name, price, period, features, popular }: PricingCardProps) {
  return (
    <div className={`relative bg-white rounded-lg shadow-lg p-8 ${popular ? 'ring-2 ring-primary-600' : ''}`}>
      {popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="text-4xl font-bold text-gray-900 mb-1">{price}</div>
        <div className="text-gray-600">{period}</div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
        popular
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}>
        Get Started
      </button>
    </div>
  );
}

export default App;
