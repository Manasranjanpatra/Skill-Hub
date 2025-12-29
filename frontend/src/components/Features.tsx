export default function Features() {
  const features = [
    {
      icon: 'fas fa-robot',
      title: 'AI Buddy',
      description: 'Your personal learning guide that adapts to your pace and provides instant help when you need it most.',
      color: 'blue'
    },
    {
      icon: 'fas fa-cube',
      title: 'AR Learning',
      description: 'Experience subjects in 3D with immersive augmented reality that brings abstract concepts to life.',
      color: 'green'
    },
    {
      icon: 'fas fa-gamepad',
      title: 'Gamified Quizzes',
      description: 'Fun and interactive challenges that make learning enjoyable while tracking your progress.',
      color: 'purple'
    },
    {
      icon: 'fas fa-user-cog',
      title: 'Personalized Learning',
      description: 'Tailored to your pace with adaptive learning paths that adjust based on your performance.',
      color: 'orange'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Progress Analytics',
      description: 'Track your success with detailed analytics and insights into your learning journey.',
      color: 'pink'
    },
    {
      icon: 'fas fa-cloud',
      title: 'Learn Anywhere',
      description: '24/7 cloud-based access means you can learn anytime, anywhere, on any device.',
      color: 'teal'
    }
  ];

  return (
    <section id="features" className="features animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Eduyata?</h2>
          <p>Discover the features that make learning smarter and more engaging</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card ${feature.color}`}>
              <div className={`feature-icon ${feature.color}`}>
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
