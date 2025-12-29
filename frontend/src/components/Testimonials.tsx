export default function Testimonials() {
  const testimonials = [
    {
      quote: "The AI Buddy feature is incredible! It's like having a personal tutor available 24/7. My grades have improved significantly since I started using Eduyata.",
      author: {
        name: 'Emma Thompson',
        role: 'Computer Science Student',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'blue'
    },
    {
      quote: "The AR Science Lab blew my mind! I can now visualize complex molecular structures in 3D. Learning has never been this engaging and fun.",
      author: {
        name: 'Marcus Johnson',
        role: 'Biology Major',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'green'
    },
    {
      quote: "The gamified approach makes studying addictive in the best way possible. I actually look forward to my daily learning sessions now!",
      author: {
        name: 'Sofia Rodriguez',
        role: 'Mathematics Student',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'purple'
    }
  ];

  return (
    <section className="testimonials animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <p>Join thousands of learners who have transformed their education</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`testimonial-card ${testimonial.color}`}>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.author.avatar} 
                  alt={testimonial.author.name}
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>{testimonial.author.name}</h4>
                  <p>{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
