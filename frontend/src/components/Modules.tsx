export default function Modules() {
  const modules = [
    {
      title: 'AI Buddy',
      description: 'Master the art of AI-assisted learning with your personal digital companion that adapts to your learning style.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    },
    {
      title: 'Gamification',
      description: 'Transform your learning experience with engaging game mechanics, achievements, and competitive challenges.',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    },
    {
      title: 'AR Science Lab',
      description: 'Conduct virtual experiments and explore scientific concepts in augmented reality with immersive 3D models.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    }
  ];

  return (
    <section className="modules animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>Popular Modules</h2>
          <p>Explore our most loved courses designed for modern learners</p>
        </div>
        
        <div className="modules-grid">
          {modules.map((module, index) => (
            <div key={index} className="module-card">
              <img src={module.image} alt={module.title} />
              <div className="module-card-content">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
