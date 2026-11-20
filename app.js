let currentCard = 0;
let currentQuizIndex = 0;
let currentTopikIndex = 0;

// Hàm phát âm tiếng Hàn chuẩn trên điện thoại/iPad
function speakKorean(text) {
  if (!('speechSynthesis' in window)) {
    alert("Trình duyệt chưa hỗ trợ đọc giọng nói.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

// Tạo khung hộp có tự động nhận diện tranh box-quiz.png
function createSketchBox(innerHTML, extraClass = "", tag = "div") {
  const el = document.createElement(tag);
  el.className = `sketch-box ${extraClass}`.trim();
  el.innerHTML = `
    <img class="frame-art" src="images/box-quiz.png" alt=""
         onload="this.parentElement.classList.add('has-frame')"
         onerror="this.remove()">
    <div class="sketch-box-inner">${innerHTML}</div>
  `;
  return el;
}

// --- CHUYỂN TAB CHÍNH ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`sec-${btn.dataset.tab}`).classList.add('active');
  });
});

// --- TAB 1: FLASHCARD TỪ VỰNG ---
const flashcardEl = document.getElementById('flashcard');

function renderCard() {
  const item = vocabData[currentCard];
  flashcardEl.classList.remove('is-flipped');

  document.getElementById('card-counter').textContent = `${currentCard + 1} / ${vocabData.length}`;
  document.getElementById('card-korean').textContent = item.korean;
  document.getElementById('card-roman').textContent = item.roman || "";
  document.getElementById('card-meaning').textContent = item.meaning;
  document.getElementById('card-ex-kr').textContent = item.exampleKr || "";
  document.getElementById('card-ex-vi').textContent = item.exampleVi || "";

  const imgWrap = document.getElementById('vocab-img-wrap');
  imgWrap.innerHTML = "";
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.korean;
  img.onerror = () => {
    imgWrap.innerHTML = `<div class="vocab-img-placeholder">Chỗ dán tranh vẽ:<br>${item.image}</div>`;
  };
  imgWrap.appendChild(img);
}

flashcardEl.addEventListener('click', () => flashcardEl.classList.toggle('is-flipped'));
document.getElementById('btn-flip').addEventListener('click', () => flashcardEl.classList.toggle('is-flipped'));

document.getElementById('btn-prev').addEventListener('click', () => {
  currentCard = (currentCard - 1 + vocabData.length) % vocabData.length;
  renderCard();
});

document.getElementById('btn-next').addEventListener('click', () => {
  currentCard = (currentCard + 1) % vocabData.length;
  renderCard();
});

document.getElementById('btn-speak').addEventListener('click', () => {
  speakKorean(vocabData[currentCard].korean);
});

document.getElementById('btn-speak-ex').addEventListener('click', (e) => {
  e.stopPropagation();
  speakKorean(vocabData[currentCard].exampleKr);
});

// Chuyển đổi Flashcard <-> Quiz
document.getElementById('mode-flashcard').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('mode-quiz').classList.remove('active');
  document.getElementById('vocab-flashcard-view').classList.remove('hidden');
  document.getElementById('vocab-quiz-view').classList.add('hidden');
});

document.getElementById('mode-quiz').addEventListener('click', (e) => {
  e.target.classList.add('active');
  document.getElementById('mode-flashcard').classList.remove('active');
  document.getElementById('vocab-flashcard-view').classList.add('hidden');
  document.getElementById('vocab-quiz-view').classList.remove('hidden');
  renderQuiz();
});

function renderQuiz() {
  const item = vocabData[currentQuizIndex];
  const promptEl = document.getElementById('quiz-prompt');
  const optionsEl = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  feedbackEl.textContent = "";

  promptEl.innerHTML = `
    <div class="korean-word">${item.korean}</div>
    <button class="sketch-pill small-btn" onclick="speakKorean('${item.korean}')">🔊 Nghe lại từ này</button>
  `;

  // Tạo danh sách đáp án xáo trộn
  const choices = vocabData.map(v => v.meaning).sort(() => Math.random() - 0.5);
  optionsEl.innerHTML = "";
  choices.forEach(choice => {
    const btn = createSketchBox(choice, "quiz-option-btn", "button");
    btn.addEventListener('click', () => {
      if (choice === item.meaning) {
        btn.classList.add('is-correct');
        feedbackEl.textContent = "Chính xác! Giỏi quá 🎉";
        speakKorean(item.korean);
      } else {
        btn.classList.add('is-wrong');
        feedbackEl.textContent = "Chưa đúng rồi, thử lại nhé!";
      }
    });
    optionsEl.appendChild(btn);
  });
}

document.getElementById('btn-next-quiz').addEventListener('click', () => {
  currentQuizIndex = (currentQuizIndex + 1) % vocabData.length;
  renderQuiz();
});

// --- TAB 2: NGỮ PHÁP ---
function renderGrammar() {
  const container = document.getElementById('sec-grammar');
  container.innerHTML = "";
  grammarData.forEach(g => {
    const box = createSketchBox(`
      <div class="kr-title">${g.pattern}</div>
      <p style="margin: 6px 0 10px;"><strong>Ý nghĩa:</strong> ${g.meaning}</p>
      <div class="example-box">
        <p class="example-kr">${g.exampleKr}</p>
        <p class="example-vi">${g.exampleVi}</p>
        <button class="sketch-pill small-btn" onclick="speakKorean('${g.exampleKr}')">🔊 Nghe ví dụ</button>
      </div>
    `);
    container.appendChild(box);
  });
}

// --- TAB 3: 4 KỸ NĂNG ---
function renderSkill(skillKey) {
  const container = document.getElementById('skill-content');
  container.innerHTML = "";
  const data = skillsData[skillKey];

  if (skillKey === 'listening' || skillKey === 'reading') {
    const topHTML = skillKey === 'listening'
      ? `<div class="kr-title">${data.title}</div>
         <button class="sketch-pill small-btn" onclick="speakKorean('${data.audioText}')">🔊 Bấm để nghe đoạn hội thoại</button>`
      : `<div class="kr-title">${data.title}</div>
         <p class="example-kr" style="margin: 10px 0;">${data.passage}</p>
         <p><strong>Câu hỏi:</strong> ${data.question}</p>`;

    container.appendChild(createSketchBox(topHTML));
    const fb = document.createElement('div');
    fb.className = 'quiz-feedback';

    data.options.forEach((opt, idx) => {
      const btn = createSketchBox(opt, "quiz-option-btn", "button");
      btn.addEventListener('click', () => {
        if (idx === data.answerIndex) {
          btn.classList.add('is-correct');
          fb.textContent = "Chuẩn xác 100%! 🌟";
        } else {
          btn.classList.add('is-wrong');
          fb.textContent = "Sai mất rồi, chọn lại nhé!";
        }
      });
      container.appendChild(btn);
    });
    container.appendChild(fb);
  } else if (skillKey === 'speaking') {
    container.appendChild(createSketchBox(`<div class="kr-title">${data.title}</div>`));
    data.sentences.forEach(s => {
      container.appendChild(createSketchBox(`
        <p class="example-kr">${s.kr}</p>
        <p class="example-vi">${s.vi}</p>
        <button class="sketch-pill small-btn" onclick="speakKorean('${s.kr}')">🔊 Nghe giọng mẫu</button>
      `));
    });
  } else if (skillKey === 'writing') {
    container.appendChild(createSketchBox(`
      <div class="kr-title">${data.title}</div>
      <p style="margin-top:8px;">${data.prompt}</p>
      <textarea class="write-area" placeholder="Gõ câu tiếng Hàn của bạn vào đây..."></textarea>
      <button class="sketch-pill small-btn" id="btn-show-sample">Xem câu mẫu gợi ý</button>
      <p id="sample-ans" class="hidden" style="margin-top:10px; color: var(--correct);">
        <strong>Gợi ý:</strong> ${data.sample}
      </p>
    `));
    document.getElementById('btn-show-sample').addEventListener('click', () => {
      document.getElementById('sample-ans').classList.remove('hidden');
      speakKorean(data.sample);
    });
  }
}

document.querySelectorAll('[data-skill]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-skill]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkill(btn.dataset.skill);
  });
});

// --- TAB 4: LUYỆN ĐỀ TOPIK ---
function renderTopik() {
  const container = document.getElementById('sec-topik');
  container.innerHTML = "";
  const q = topikData[currentTopikIndex];

  container.appendChild(createSketchBox(`
    <div style="font-size:0.95rem; color:var(--ink-soft);">Câu ${currentTopikIndex + 1} / ${topikData.length}</div>
    <p class="example-kr" style="white-space:pre-line; margin-top:8px;">${q.question}</p>
  `));

  const fb = document.createElement('div');
  fb.className = 'quiz-feedback';

  q.options.forEach((opt, idx) => {
    const btn = createSketchBox(`${idx + 1}. ${opt}`, "quiz-option-btn", "button");
    btn.addEventListener('click', () => {
      if (idx === q.answerIndex) {
        btn.classList.add('is-correct');
        fb.textContent = `Đúng rồi! ${q.explain}`;
      } else {
        btn.classList.add('is-wrong');
        fb.textContent = "Chưa đúng, thử lại đáp án khác nhé!";
      }
    });
    container.appendChild(btn);
  });

  container.appendChild(fb);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'sketch-pill';
  nextBtn.textContent = 'Câu TOPIK tiếp theo ➔';
  nextBtn.addEventListener('click', () => {
    currentTopikIndex = (currentTopikIndex + 1) % topikData.length;
    renderTopik();
  });
  container.appendChild(nextBtn);
}

// Khởi chạy ban đầu
renderCard();
renderGrammar();
renderSkill('listening');
renderTopik();

 
