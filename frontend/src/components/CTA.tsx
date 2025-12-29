import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  return (
    <section className="cta animate-on-scroll">
      <div className="container">
        <h2>Ready to Learn Smarter?</h2>
        <p>Join 10,000+ students who are already transforming their education</p>
        
        <div className="cta-buttons">
          <button className="btn btn-white btn-lg">
            Get Started Free
          </button>
          <button className="btn btn-secondary btn-lg" style={{ borderColor: 'white', color: 'white' }}>
            Schedule Demo
          </button>
        </div>
        
        <div className="newsletter">
          <p>Stay updated with the latest features and learning tips</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
            />
            <button 
              onClick={handleSubscribe}
              className="newsletter-button"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
