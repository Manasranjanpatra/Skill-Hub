export default function Hero() {
  return (
    <section className="hero animate-on-scroll">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Revolutionize Learning with{' '}
              <span className="highlight">AI & AR</span>
            </h1>
            <p>
              Eduyata combines AI, gamified assessments, and AR for smarter learning. 
              Experience personalized education that adapts to your unique learning style.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg">
                Get Started Free
              </button>
              <button className="btn btn-secondary btn-lg">
                Try AI Buddy
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Students using AI technology in modern classroom" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
