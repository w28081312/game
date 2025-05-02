const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const startBtn = document.getElementById('start-game');
const playerNameInput = document.getElementById('player-name');
const gameSection = document.getElementById('game-section');
const introSection = document.getElementById('intro-section');

let playerName = '';
let storyContext = '';

const apiKey = localStorage.getItem('googleAiApiKey') || prompt("請輸入 Google Gemini API 金鑰");

startBtn.addEventListener('click', () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('請輸入主角名字');
    return;
  }

  introSection.style.display = 'none';
  gameSection.style.display = 'block';

  addMessage(`你好，我是${playerName}，一個住在奇幻小鎮的新居民。今天是我開始新生活的第一天。`, 'user');
  generateResponse(`你是遊戲 AI，請以角色扮演方式開始故事，主角叫做${playerName}，生活在一個可以賺錢、交朋友與戀愛的小鎮。請描述第一天早晨的情境。`);
});

sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  userInput.value = '';
  generateResponse(message);
});

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = text.replace(/\n/g, '<br>');
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function generateResponse(userMessage) {
  const requestPayload = {
    contents: [{
      parts: [{ text: `遊戲背景：${playerName}在一個互動式小鎮中探險。請根據上下文產生劇情。\n使用者輸入：${userMessage}` }]
    }]
  };

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '（AI 沒有回應）';
    addMessage(reply, 'ai');
  } catch (err) {
    addMessage('錯誤：無法取得 AI 回應', 'ai');
    console.error(err);
  }
}

