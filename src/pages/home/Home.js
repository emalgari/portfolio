import ProfileCard from "../../components/profileCard/ProfileCard";
import ContentCard from "../../components/contentCard/ContentCard";
import '../home/Home.css';
const Home = () => {
    return (
        <div className="container m-auto ">
            <div className="row gap-2">
                <div className="col">
                    <ProfileCard/>    
                </div>
                <div className="col">
                    <ContentCard/>
                </div>
            </div>
        </div>
    );
}

export default Home;