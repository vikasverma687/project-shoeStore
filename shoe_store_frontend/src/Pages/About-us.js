import React from 'react';
import "../Styles/Aboutuscss.css"; 
function Aboutus() {
  return (
    <div className="about-container">
        
      
      {/* Hero Section */}
      <div className="about-hero">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">
          Affordable Steps, Smart Tech — Built from the Heart of Indore.
        </p>
        <hr className="about-divider" />
      </div>

      {/* Our Mission */}
      <div className="about-section">
        <h2 className="about-section-heading">Our Mission</h2>
        <p className="about-text">
          We believe that style and comfort shouldn't break the bank. Our platform was born out of a simple observation: finding high-quality, diverse footwear at budget-friendly prices is often harder than it should be. We built this fully functional e-commerce ecosystem to bridge that gap, offering everything from sports sneakers to formal wear at prices that make sense for everyone.
        </p>
      </div>

      {/* Technical Project Highlights */}
      <div className="tech-box">
        <h3 className="tech-box-heading">Project Features & Architecture</h3>
        <p className="about-text">
          Developed as part of our <strong>3rd-Year Minor Project</strong>, this platform is more than just a storefront. It is an end-to-end e-commerce solution engineered with all essential modern features:
        </p>
        <ul className="tech-list">
          <li><strong>Dynamic Product Catalog:</strong> Seamless browsing and filtering through multiple shoe categories.</li>
          <li><strong>User-Centric Experience:</strong> Secure authentication, interactive cart management, and a streamlined checkout flow.</li>
          <li><strong>Robust Backend & Database:</strong> Optimized to handle inventory management and real-time updates efficiently.</li>
        </ul>
      </div>

      {/* The Team */}
      <div className="about-section">
        <h2 className="about-section-heading">The Team Behind the Project</h2>
        <p className="about-text">
          We are a dynamic team of two passionate 3rd-year engineering students based in <strong>Indore, Madhya Pradesh</strong>. Combining our technical skills and shared vision, we managed everything from UI/UX design and frontend development to backend logic and database architecture.
        </p>
        
        {/* Team Grid */}
        <div className="team-grid">
          <div className="team-card">
            <h3 className="team-name">Vikas Verma</h3>
            <p className="team-role">Full-Stack Developer / Backend Engineer</p>
          </div>
          <div className="team-card">
            <h3 className="team-name">Ratnadeep Choyal</h3>
            <p className="team-role">UI Designer / Database Administrator</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Aboutus;