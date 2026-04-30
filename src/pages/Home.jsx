import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [playerId, setPlayerId] = useState('');
  const navigate = useNavigate();

  // 預載圖片以達成快取
  useEffect(() => {
    for (let i = 1; i <= 20; i++) {
      const img = new Image();
      img.src = `https://api.dicebear.com/8.x/pixel-art/svg?seed=boss_${i}`;
    }
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    const finalId = playerId.trim() === '' ? 'PLAYER 1' : playerId.trim();
    localStorage.setItem('playerId', finalId);
    navigate('/game');
  };

  return (
    <div className="page">
      <h1>猜字<br/><span style={{color: 'var(--primary-color)'}}>遊戲</span></h1>
      
      <div className="boss-container" style={{borderColor: 'var(--secondary-color)', boxShadow: '0 0 20px var(--secondary-color)'}}>
        <img src="https://api.dicebear.com/8.x/pixel-art/svg?seed=hero" alt="Hero" className="boss-image" />
      </div>

      <form onSubmit={handleStart} style={{width: '100%', maxWidth: '400px'}}>
        <p style={{marginBottom: '1rem', textAlign: 'center'}}>ENTER YOUR ID:</p>
        <input 
          type="text" 
          className="pixel-input"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          placeholder="PLAYER 1"
          maxLength={15}
        />
        <button type="submit" className="pixel-btn blink" style={{marginTop: '2rem'}}>
          START GAME
        </button>
      </form>
    </div>
  );
}

export default Home;
