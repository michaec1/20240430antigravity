import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 模擬假資料，若沒有連上 GAS 則用此資料
const mockQuestions = [
  { id: 1, question: "React 中如何更新 state？", options: { A: "this.state=", B: "setState", C: "updateState", D: "changeState" }, answer: "B" },
  { id: 2, question: "哪一個不是 JavaScript 的資料型別？", options: { A: "String", B: "Boolean", C: "Float", D: "Undefined" }, answer: "C" },
  { id: 3, question: "CSS 負責網頁的什麼？", options: { A: "邏輯", B: "結構", C: "樣式", D: "資料庫" }, answer: "C" },
  { id: 4, question: "HTML 代表什麼？", options: { A: "HyperText Markup Language", B: "Home Tool Markup Language", C: "HyperLinks Text Language", D: "None" }, answer: "A" },
  { id: 5, question: "Git 是一個什麼工具？", options: { A: "編輯器", B: "版本控制系統", C: "編譯器", D: "瀏覽器" }, answer: "B" }
];

function Game() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      const count = import.meta.env.VITE_QUESTION_COUNT || 5;
      
      if (!url || url.includes('YOUR_MACRO_ID_HERE')) {
        // 使用 mock 資料
        setQuestions(mockQuestions.slice(0, count));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${url}?count=${count}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(mockQuestions.slice(0, count));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setQuestions(mockQuestions.slice(0, count));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIndex];
    // 假設後端有傳 answer 或我們在此先預設為本地有答案
    // 若後端沒有傳回 answer，則此處應記錄所有選擇，最後再一次傳給後端對答案
    // 為求立即體驗，我們將邏輯設計為：若是 Mock 資料則直接比對，若是 GAS 則我們把選擇傳回去。
    // 在此先簡化：假設 GAS 也有回傳答案欄位來比對
    let isCorrect = selectedOption === currentQ.answer;
    let newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 遊戲結束
      localStorage.setItem('gameScore', newScore);
      localStorage.setItem('totalQuestions', questions.length);
      navigate('/result');
    }
  };

  if (loading) {
    return <div className="page"><h2 className="blink">LOADING...</h2></div>;
  }

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  // Seed 使用題目 id 來產生獨一無二的關主
  const bossSeed = `boss_${currentQ.id || currentIndex}`;

  return (
    <div className="page">
      <div className="status-bar">
        <span>PLAYER: {localStorage.getItem('playerId') || 'GUEST'}</span>
        <span>STAGE: {currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="boss-container">
        <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${bossSeed}`} alt="Boss" className="boss-image" />
      </div>

      <div className="question-text">
        {currentQ.question}
      </div>

      <div className="options-grid">
        {Object.entries(currentQ.options).map(([key, value]) => (
          <button key={key} className="pixel-btn" onClick={() => handleAnswer(key)}>
            {key}: {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Game;
