import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Result() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Submitting...');
  
  const score = parseInt(localStorage.getItem('gameScore') || '0', 10);
  const total = parseInt(localStorage.getItem('totalQuestions') || '5', 10);
  const playerId = localStorage.getItem('playerId') || 'GUEST';
  const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);
  
  const isPassed = score >= threshold;

  useEffect(() => {
    const submitResult = async () => {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      if (!url || url.includes('YOUR_MACRO_ID_HERE')) {
        setStatus('Result Saved (Local)');
        return;
      }

      const payload = {
        id: playerId,
        score: score,
        passed: isPassed
      };

      try {
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          }
        });
        setStatus('Result Saved to Server!');
      } catch (err) {
        console.error(err);
        setStatus('Failed to Save');
      }
    };

    submitResult();
  }, [playerId, score, isPassed]);

  return (
    <div className="page">
      <h1 style={{color: isPassed ? 'var(--primary-color)' : 'var(--danger-color)'}}>
        {isPassed ? 'STAGE CLEARED!' : 'GAME OVER'}
      </h1>
      
      <div className="question-text" style={{fontSize: '1.2rem', marginBottom: '1rem'}}>
        SCORE: {score} / {total}
      </div>
      
      <p style={{marginBottom: '3rem', fontSize: '0.8rem', color: '#888'}}>{status}</p>

      <button className="pixel-btn" onClick={() => navigate('/')}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default Result;
