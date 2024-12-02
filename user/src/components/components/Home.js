import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Home() {
  return (
    <div className='home-container'>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  );
}

export default Home;
