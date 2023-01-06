import pic from '../../images/pic.png';
import '../profileCard/ProfileCard.css';
import { Link } from 'react-router-dom';

const ProfileCard = () => {
    return (
        <div className="card text-center border border-primary border-2 rounded-3 bg-info bg-opacity-10 text-white">
            <img src = {pic} className="card-img-top rounded-circle" alt="Saddam's pic"/>
            <div className="card-body">
                <h5 className="card-title">Saddam Hussain</h5>
                <p className="card-text">Front-End Web Developer</p>
                <Link to="/contact" className="btn btn-danger">Contact Me</Link>
            </div>
        </div>
    );
}

export default ProfileCard;