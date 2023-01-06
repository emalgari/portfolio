import '../footer/Footer.css';

const Footer = () => {
    return (
        <footer className="d-flex justify-content-between align-items-center d-sm-flex bg-transparent py-2 text-white mt-auto">

            <div>
                <span className="mx-3"><span className='text-danger'>e</span>malgari.<span className='text-warning'>&trade;</span></span>
            </div>

            <div>
                <span>All Rights Reserved</span>
            </div>

            <div>
                <span className="mx-3">&copy; 2022</span>
            </div>

        </footer>
    );
}

export default Footer;