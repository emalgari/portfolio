
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import '../navbar/Navigator.css';

const Navigator = () => {
  return (
    <Navbar  expand="lg" bg="transparent" variant="dark" className='px-2'>
          <Link className="navbar-brand" to="/"><span className="text-danger">e</span>malgari.<span className='text-warning'>&trade;</span></Link>
          <Navbar.Toggle className='border border-white' aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="d-flex justify-content-center align-items-center gap-lg-5 w-100">
              <Link className='nav-link text-white fs-6' to="/">Home</Link>
              <Link className='nav-link text-white fs-6' to="about">About</Link>            
              <Link className='nav-link text-white fs-6' to="contact">Contact</Link>
            </Nav>
          </Navbar.Collapse>
   </Navbar>
  );
}

export default Navigator;


