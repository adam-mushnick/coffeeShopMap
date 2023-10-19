import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
  return (
    <div className='bg-dark text-white d-flex flex-column vh-100'>
      <Navbar />
      <div className='container my-5 vh-100'>
        <h1 className='display-4 mb-4'>About This Project</h1>
        <p className='lead'>
          Welcome to my coffee shop platform! This project serves as a portfolio
          piece designed to demonstrate my skills in web development,
          particularly in building full-stack applications.
        </p>
        <hr className='my-4' />
        <h2 className='mb-3'>Objective</h2>
        <p>
          The primary objective of this portfolio project is to showcase my
          proficiency in various technologies and methodologies, including but
          not limited to React, Next.js, and database management, all aimed at
          landing a job in the tech industry.
        </p>
        <h2 className='mb-3'>Skills Demonstrated</h2>
        <p>
          This project highlights my capabilities in front-end development,
          back-end integration, user authentication, and responsive design. It
          also demonstrates my attention to detail and commitment to creating a
          seamless user experience.
        </p>
        <h2 className='mb-3'>Contact Me</h2>
        <p>
          Interested in hiring me or learning more about this project? Feel free
          to reach out at{' '}
          <a
            href='mailto:amushnick93@gmail.com'
            className='text-decoration-none text-success'
          >
            amushnick93@gmail.com
          </a>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
