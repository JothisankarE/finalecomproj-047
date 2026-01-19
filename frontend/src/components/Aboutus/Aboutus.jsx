import React from 'react';

import './Aboutus.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      
      <header className="about-header">
        <div className="row">
         
          <div className="text">
            <h2>Welcome To Gowri Handlooms Pvt Ltd.!</h2>
            <h3><b>About Us</b></h3>
            <p>
            Gowri Handlooms Pvt Ltd is established in the year 1994 by a visionary entrepreneur Name of the Owner in Erode (South India).
              With very limited resources and little financial leverage, we initially began our company with a limited selection of lungies.
              Now, we are one of South India's leading textile manufacturers, offering a wide variety of products, including Bed Spreads, Pillow Covers, Bed Covers, Dhotis, Handkerchiefs, and more.
            </p>
            <p>We are proud to serve both local and international markets with high-quality textiles.</p>
          </div>
        </div>
      </header>

      
      <section className="about-mission">
        <div className="row">
          
          <div className="text">
            <h1 className="color">Our Mission</h1>
            <p>
              Driven by a passion for textile excellence, our mission is to create fabrics that not only meet but exceed the expectations of our customers,
              setting new benchmarks for quality and innovation.
            </p>
          </div>
        </div>
      </section>

     
      <section className="about-quality">
        <div className="row">
          
          <div className="text">
            <h1 className="color">Quality Assurance</h1>
            <p>
              Our prime focus is on quality, which has earned us our reputation. We follow strict quality management, where the entire production process is carefully monitored by our quality controllers. We maintain vigilance at every stage to reduce damage, increase productivity, and ensure the highest level of customer satisfaction.
            </p>
          </div>
        </div>
      </section>

   
      <section className="about-team">
        <div className="row">
          
          <div className="text">
            <h1 className="color">Our Team</h1>
            <p>
              We have a highly qualified and dedicated team of professionals who are in tune with the latest market trends. With years of experience, our team helps us maintain strong relationships with customers and continuously improve our marketing strategies. We believe our team is one of the most innovative and talented in the industry.
            </p>
          </div>
        </div>
      </section>
    <br/><br/>
      
      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>If you have any questions or want to know more about our products, feel free to reach out to us!</p><br/><br/>
        <ul>
          <li><strong>Address:</strong>Test, Erode, Tamil Nadu- 638001</li>
          <li><strong>Phone:</strong> +91123456789</li>
          <li><strong>Email:</strong> gowrihandlooms@gmail.com</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
