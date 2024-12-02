import { useParams } from 'react-router-dom';
import '../../styles/index.css';
import ListOfLessons from './ListOfLessons';


function CoursePage() {
    const { id } = useParams();
    return (
        <ListOfLessons id={id} />
    );
}

export default CoursePage;
