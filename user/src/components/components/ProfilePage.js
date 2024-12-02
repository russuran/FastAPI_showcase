import UserHeatmap from './Heatmap.js';
import StatsChart from './Stats.js';
import '../../styles/heatmap.css';

function ProfilePage() {
  return (
    <div className='courses-container'>
      <div className='profile-container'>
        <div className='profile-left'>
          <p style={{ fontSize: '26px', marginBottom: '10px', marginTop: '10px' }}>Прогресс за последние 30 дней</p>
          <UserHeatmap/>
          <div className='profile-usercard'>
          </div>
        </div>
        <div className='profile-right'>
          <p style={{ fontSize: '26px', marginBottom: '10px', marginTop: '10px' }}>Статистика</p>
          <StatsChart/>
          <StatsChart/>
        </div>  
      </div>
    </div>
  );
}


export default ProfilePage;
