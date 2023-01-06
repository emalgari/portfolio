
import TypeWriter from '../typeWriter/TypeWriter'; 
import codingImage from '../../images/coding-folder.png';

const ContentCard = () =>{
  return (
      <div className="cover-container card d-flex justify-content-center align-items-center flex-column h-100 text-white text-center border border-primary border-2 rounded-3 bg-info bg-opacity-10 text-white">
        <img src= {codingImage} alt="codning" />
        <TypeWriter/>
      </div>
  );
} 

export default ContentCard;
