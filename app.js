let activeTopic = "all";
let currentCard = 0;
let activeGrammarSub = "topic";
let activeSkill = "listening";

// --- 1. QUẢN LÝ MENU TRƯỢT BÊN CẠNH & API KEY AI ---
const sideDrawer = document.getElementById('side-drawer');
const drawerBackdrop = document.getElementById('drawer-backdrop');

function toggleDrawer(open) {
  sideDrawer.classList.toggle('open', open);
  drawerBackdrop.classList.toggle('hidden', !open);
}

document.getElementById('btn-open-menu').addEventListener('click', () => toggleDrawer(true));
document.getElementById('btn-close-menu').addEventListener('click', () => toggleDrawer(false));
drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

function renderTopicsMenu() {
  const listEl = document.getElementById('topic-list');
  listEl.innerHTML = "";
  topicsData.forEach(t => {
    const btn = document.createElement('button');
    btn.className = `topic-item-btn ${activeTopic === t.id ? 'active' : ''}`;
    btn.textContent = t.name;
    btn.addEventListener('click', () => {
      activeTopic = t.id;
      document.getElementById('active-topic-name').textContent = t.name;
      currentCard = 0;
      renderTopicsMenu();
      renderCard();
      renderGrammar();
      renderSkill(activeSkill);
      toggleDrawer(false);
    });
    listEl.appendChild(btn);
  });
}

// Lưu / Xóa Gemini API Key
const keyInput = document.getElementById('ai-key-input');
const keyStatus = document.getElementById('ai-key-status');
const savedKey = localStorage.getItem('llk_gemini_key') || "";
if (savedKey) {
  keyInput.value = savedKey;
  keyStatus.textContent = "✓ Đã lưu API Key AI trên trình duyệt.";
}

document.getElementById('btn-save-key').addEventListener('click', () => {
  const val = keyInput.value.trim();
  if (!val) return;
  localStorage.setItem('llk_gemini_key', val);
  keyStatus.textContent = "✓ Đã lưu API Key thành công!";
});

document.getElementById('btn-clear-key').addEventListener('click', () => {
  localStorage.removeItem('llk_gemini_key');
  keyInput.value = "";
  keyStatus.textContent = "Đã xóa API Key (chuyển sang chế độ chấm tự động cơ bản).";
});

// --- 2. PHÁT ÂM TIẾNG HÀN & TẠO KHUNG VẼ TAY ---
function speakKorean(text, rate = 0.9) {
  if (!text) return;
  if (!('speechSynthesis' in window)) {
    alert("Trình duyệt chưa hỗ trợ đọc giọng nói.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

document.addEventListener('click', (e) => {
  const speakBtn = e.target.closest('[data-speak]');
  if (speakBtn) {
    e.stopPropagation();
    const rate = parseFloat(speakBtn.dataset.rate || "0.9");
    speakKorean(speakBtn.dataset.speak, rate);
  }
});

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

// --- 3. CHUYỂN 3 TAB CHÍNH ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`sec-${btn.dataset.tab}`).classList.add('active');
  });
});

// --- 4. PHẦN 1: TỪ VỰNG THEO CỤM (FLASHCARD) ---
function getFilteredVocab() {
  if (activeTopic === "all") return vocabData;
  const filtered = vocabData.filter(v => v.topic === activeTopic);
  return filtered.length ? filtered : vocabData;
}

const flashcardEl = document.getElementById('flashcard');

function renderCard() {
  const list = getFilteredVocab();
  if (currentCard >= list.length) currentCard = 0;
  const item = list[currentCard];
  flashcardEl.classList.remove('is-flipped');

  document.getElementById('card-counter').textContent = `${currentCard + 1} / ${list.length}`;
  document.getElementById('card-topic-tag').textContent = item.topicLabel;
  document.getElementById('card-korean').textContent = item.korean;
  document.getElementById('card-roman').textContent = item.roman || "";
  document.getElementById('card-meaning').textContent = item.meaning;
  document.getElementById('card-note').textContent = `★ ${item.note || ""}`;
  document.getElementById('card-ex-kr').textContent = item.exampleKr || "";
  document.getElementById('card-ex-vi').textContent = item.exampleVi || "";

  const imgWrap = document.getElementById('vocab-img-wrap');
  imgWrap.innerHTML = "";
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.korean;
  img.onerror = () => {
    imgWrap.innerHTML = `<div class="vocab-img-placeholder">Ảnh minh họa Pinterest<br>(Đổi link trong data.js)</div>`;
  };
  imgWrap.appendChild(img);
}

flashcardEl.addEventListener('click', () => flashcardEl.classList.toggle('is-flipped'));
document.getElementById('btn-flip').addEventListener('click', () => flashcardEl.classList.toggle('is-flipped'));

document.getElementById('btn-prev').addEventListener('click', () => {
  const list = getFilteredVocab();
  currentCard = (currentCard - 1 + list.length) % list.length;
  renderCard();
});

document.getElementById('btn-next').addEventListener('click', () => {
  const list = getFilteredVocab();
  currentCard = (currentCard + 1) % list.length;
  renderCard();
});

document.getElementById('btn-speak').addEventListener('click', () => {
  speakKorean(getFilteredVocab()[currentCard].korean, 0.9);
});

document.getElementById('btn-speak-slow').addEventListener('click', () => {
  speakKorean(getFilteredVocab()[currentCard].korean, 0.65);
});

document.getElementById('btn-speak-ex').addEventListener('click', (e) => {
  e.stopPropagation();
  speakKorean(getFilteredVocab()[currentCard].exampleKr, 0.9);
});

// --- 5. PHẦN 2: NGỮ PHÁP (5 NHÁNH) ---
document.querySelectorAll('[data-gsub]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-gsub]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeGrammarSub = btn.dataset.gsub;
    renderGrammar();
  });
});

function renderGrammar() {
  const container = document.getElementById('grammar-content');
  container.innerHTML = "";

  if (activeGrammarSub === "topic" || activeGrammarSub === "spoken" || activeGrammarSub === "written") {
    let list = grammarData[activeGrammarSub];
    if (activeGrammarSub === "topic" && activeTopic !== "all") {
      const f = list.filter(g => g.topic === activeTopic);
      if (f.length) list = f;
    }

    list.forEach(g => {
      const box = createSketchBox(`
        <div class="kr-title">${g.pattern}</div>
        <p style="margin:6px 0;"><strong>Ý nghĩa:</strong> ${g.meaning}</p>
        <div class="note-box">
          <div class="note-title">★ Gợi ý cấu trúc đi kèm & Lưu ý:</div>
          <p>${g.collocations}</p>
          <p style="margin-top:4px;"><em>${g.note}</em></p>
        </div>
        <div class="example-box">
          <p class="example-kr">${g.exampleKr}</p>
          <p class="example-vi">${g.exampleVi}</p>
          <button class="sketch-pill small-btn">🔊 Nghe ví dụ</button>
        </div>
      `);
      box.querySelector('button').dataset.speak = g.exampleKr;
      container.appendChild(box);
    });
  } else if (activeGrammarSub === "compare") {
    grammarData.compare.forEach(c => {
      container.appendChild(createSketchBox(`
        <div class="kr-title">${c.title}</div>
        <p style="margin:8px 0;"><strong>• Điểm 1:</strong> ${c.pointA}</p>
        <p style="margin:8px 0;"><strong>• Điểm 2:</strong> ${c.pointB}</p>
        <div class="note-box">
          <div class="note-title">★ Mẹo phân biệt nhanh:</div>
          <p>${c.note}</p>
        </div>
        <div class="example-box">
          <p class="example-kr">${c.exampleKr}</p>
        </div>
      `));
    });
  } else if (activeGrammarSub === "practice") {
    grammarData.practice.forEach((p, idx) => {
      if (p.type === "cloze") {
        const box = createSketchBox(`
          <div class="note-label">Bài ${idx + 1}: Đục lỗ ngữ pháp</div>
          <p class="example-kr" style="white-space:pre-line; margin:6px 0;">${p.prompt}</p>
          <p style="font-size:0.9rem; margin-bottom:8px;">${p.hint}</p>
          <div style="display:flex; gap:8px;">
            <input type="text" class="sketch-input cloze-in" placeholder="Gõ phần điền vào chỗ trống..." />
            <button class="sketch-pill small-btn check-cloze">Kiểm tra</button>
          </div>
          <div class="quiz-feedback cloze-fb" style="text-align:left;"></div>
        `);
        box.querySelector('.check-cloze').addEventListener('click', () => {
          const val = box.querySelector('.cloze-in').value.trim();
          const fb = box.querySelector('.cloze-fb');
          if (val === p.answer) {
            fb.textContent = `✓ Chính xác! Câu hoàn chỉnh: ${p.fullSentence}`;
            speakKorean(p.fullSentence);
          } else {
            fb.textContent = `✕ Chưa khớp (Đáp án đúng: ${p.answer})`;
          }
        });
        container.appendChild(box);
      } else {
        const box = createSketchBox(`
          <div class="note-label">Bài ${idx + 1}: Luyện dịch câu Việt ➔ Hàn</div>
          <p style="white-space:pre-line; margin:6px 0;">${p.prompt}</p>
          <textarea class="write-area" placeholder="Gõ câu tiếng Hàn bạn dịch vào đây..."></textarea>
          <button class="sketch-pill small-btn show-trans" style="margin-top:8px;">Xem đáp án gợi ý</button>
          <div class="note-box hidden trans-ans">
            <div class="note-title">★ Câu mẫu chuẩn:</div>
            <p class="example-kr">${p.sampleAnswer}</p>
            <p>${p.note}</p>
          </div>
        `);
        box.querySelector('.show-trans').addEventListener('click', () => {
          box.querySelector('.trans-ans').classList.remove('hidden');
          speakKorean(p.sampleAnswer);
        });
        container.appendChild(box);
      }
    });
  }
}

// --- 6. PHẦN 3: 4 KỸ NĂNG (NGHE - NÓI - ĐỌC - VIẾT) ---
document.querySelectorAll('[data-skill]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-skill]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSkill = btn.dataset.skill;
    renderSkill(activeSkill);
  });
});

// Hàm gọi AI (Gemini API hoặc chấm tự động thông minh nếu chưa nhập Key)
async function evaluateKoreanWithAI(userSentence, targetPattern, mode = "speaking") {
  const apiKey = localStorage.getItem('llk_gemini_key');
  if (!apiKey) {
    const hasHangul = /[가-힣]/.test(userSentence);
    const hasSpacing = userSentence.trim().includes(" ");
    let feedback = hasHangul
      ? "✓ Đã nhận diện chữ Hangul. "
      : "✕ Bạn đang gõ tiếng Việt/Latinh, hãy chuyển sang bàn phím tiếng Hàn nhé. ";
    feedback += hasSpacing
      ? "Có chia khoảng cách từ (띄어쓰기) khá tốt! "
      : "Lưu ý: Nhớ cách khoảng trắng giữa các cụm từ trong tiếng Hàn nhé. ";
    feedback += "\n💡 Mẹo: Dán Gemini API Key miễn phí trong Menu bên trái để AI sửa lỗi ngữ pháp chi tiết và đối đáp tiếng Hàn tự nhiên cùng bạn!";
    return { correction: feedback, replyKr: "잘했어요! 계속 연습해 봐요!", replyVi: "Làm tốt lắm! Hãy tiếp tục luyện tập nhé!" };
  }

  const prompt = mode === "speaking"
    ? `Bạn là gia sư tiếng Hàn thân thiện. Học viên đang luyện nói với cấu trúc mục tiêu: "${targetPattern}". Câu học viên nói/viết là: "${userSentence}".
Hãy trả lời ngắn gọn bằng JSON thuần túy (không markdown) theo mẫu:
{"correction": "Nhận xét ngữ pháp, độ tự nhiên và câu sửa chuẩn bằng tiếng Việt", "replyKr": "1 câu phản hồi hội thoại tự nhiên bằng tiếng Hàn để tiếp tục trò chuyện", "replyVi": "Dịch nghĩa tiếng Việt của replyKr"}`
    : `Bạn là giám khảo chấm thi viết TOPIK. Hãy chấm đoạn văn viết tiếng Hàn này (kiểm tra đuôi câu văn viết -는다/ㄴ다, từ vựng văn viết, 띄어쓰기): "${userSentence}".
Trả lời bằng JSON thuần túy theo mẫu:
{"correction": "Chỉ ra lỗi cần sửa và viết lại phiên bản hoàn chỉnh chuẩn văn viết Hàn Quốc", "replyKr": "작문 실력이 점점 늘고 있어요!", "replyVi": "Kỹ năng viết của bạn đang tiến bộ dần rồi đấy!"}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      correction: "Không kết nối được AI (kiểm tra lại API Key hoặc mạng). Câu của bạn đã được ghi nhận!",
      replyKr: "다시 한 번 말해 볼까요?",
      replyVi: "Chúng ta thử nói lại một lần nữa nhé?"
    };
  }
}

function renderSkill(skillKey) {
  const container = document.getElementById('skill-content');
  container.innerHTML = "";

  // 1. KỸ NĂNG NGHE (Điền từ vào chỗ trống + Trắc nghiệm A B C D)
  if (skillKey === "listening") {
    container.appendChild(createSketchBox(`<div class="note-label">Phần A: Nghe & Điền từ vào chỗ trống</div>`));
    skillsData.listening.dictation.forEach((d, idx) => {
      const box = createSketchBox(`
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <button class="sketch-pill small-btn btn-aud-norm">🔊 Nghe chuẩn</button>
          <button class="sketch-pill small-btn btn-aud-slow">🐢 Nghe chậm</button>
        </div>
        <p class="example-kr" style="margin-bottom:8px;">${idx + 1}. ${d.displaySentence}</p>
        <div style="display:flex; gap:8px;">
          <input type="text" class="sketch-input dict-in" placeholder="Gõ từ tiếng Hàn nghe được..." />
          <button class="sketch-pill small-btn btn-check-dict">Kiểm tra</button>
        </div>
        <div class="quiz-feedback dict-fb" style="text-align:left;"></div>
      `);
      box.querySelector('.btn-aud-norm').dataset.speak = d.audioText;
      box.querySelector('.btn-aud-slow').dataset.speak = d.audioText;
      box.querySelector('.btn-aud-slow').dataset.rate = "0.65";

      box.querySelector('.btn-check-dict').addEventListener('click', () => {
        const val = box.querySelector('.dict-in').value.trim();
        const fb = box.querySelector('.dict-fb');
        if (val === d.answer) {
          fb.textContent = `✓ Chuẩn xác! Nghĩa: ${d.meaning}`;
        } else {
          fb.textContent = `✕ Chưa đúng (Đáp án: ${d.answer} — ${d.meaning})`;
        }
      });
      container.appendChild(box);
    });

    container.appendChild(createSketchBox(`<div class="note-label">Phần B: Nghe & Kiểm tra thông tin (A / B / C / D)</div>`));
    skillsData.listening.comprehension.forEach(c => {
      const qBox = createSketchBox(`
        <button class="sketch-pill small-btn btn-aud-comp" style="margin-bottom:8px;">🔊 Bấm nghe đoạn hội thoại</button>
        <p style="font-weight:700; margin-bottom:6px;">Câu hỏi: ${c.question}</p>
        <div class="note-box hidden script-box">
          <div class="note-title">★ Nội dung bài nghe (Script):</div>
          <p class="example-kr">${c.transcript}</p>
        </div>
      `);
      qBox.querySelector('.btn-aud-comp').dataset.speak = c.audioText;
      container.appendChild(qBox);

      const fb = document.createElement('div');
      fb.className = 'quiz-feedback';

      c.options.forEach((opt, i) => {
        const optBtn = createSketchBox(opt, "quiz-option-btn", "button");
        optBtn.addEventListener('click', () => {
          qBox.querySelector('.script-box').classList.remove('hidden');
          if (i === c.answerIndex) {
            optBtn.classList.add('is-correct');
            fb.textContent = "Chính xác 100%! 🎉";
          } else {
            optBtn.classList.add('is-wrong');
            fb.textContent = "Sai mất rồi, xem lại Script phía trên nhé!";
          }
        });
        container.appendChild(optBtn);
      });
      container.appendChild(fb);
    });
  }

  // 2. KỸ NĂNG NÓI (Shadowing + Thu âm + AI Chấm chữa & Hội thoại)
  else if (skillKey === "speaking") {
    container.appendChild(createSketchBox(`<div class="note-label">Phần A: Luyện nói Shadowing (Nghe & Nhại lại ngữ điệu)</div>`));
    skillsData.speaking.shadowing.forEach(s => {
      const box = createSketchBox(`
        <p class="example-kr">${s.kr}</p>
        <p class="example-vi" style="margin:4px 0;">${s.vi}</p>
        <div class="note-box"><span class="note-title">★ Lưu ý ngắt nhịp:</span> ${s.tip}</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="sketch-pill small-btn btn-sh-norm">🔊 Đọc mẫu</button>
          <button class="sketch-pill small-btn btn-sh-slow">🐢 Đọc chậm</button>
          <button class="sketch-pill small-btn btn-mic">🎙️ Nói thử vào Mic</button>
        </div>
        <div class="quiz-feedback mic-result" style="text-align:left;"></div>
      `);
      box.querySelector('.btn-sh-norm').dataset.speak = s.kr;
      box.querySelector('.btn-sh-slow').dataset.speak = s.kr;
      box.querySelector('.btn-sh-slow').dataset.rate = "0.65";

      box.querySelector('.btn-mic').addEventListener('click', () => {
        const resEl = box.querySelector('.mic-result');
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
          resEl.textContent = "Trình duyệt này chưa hỗ trợ nhận diện Mic (hãy dùng Chrome/Safari mới nhất).";
          return;
        }
        const rec = new SpeechRec();
        rec.lang = 'ko-KR';
        resEl.textContent = "🎙️ Đang nghe bạn nói tiếng Hàn...";
        rec.onresult = (ev) => {
          const spoken = ev.results[0][0].transcript;
          resEl.textContent = `Máy nghe được bạn nói: "${spoken}"`;
        };
        rec.onerror = () => {
          resEl.textContent = "Không nghe rõ giọng nói, bạn thử bấm lại nhé!";
        };
        rec.start();
      });
      container.appendChild(box);
    });

    // Phần B: Tự đặt câu & AI Chấm chữa / Hội thoại
    const task = skillsData.speaking.promptTask;
    const aiBox = createSketchBox(`
      <div class="note-label">Phần B: Tự đặt câu & Trợ lý AI Chấm chữa / Hội thoại</div>
      <p><strong>Cấu trúc cho sẵn:</strong> <span class="pink-highlight">${task.pattern}</span></p>
      <p style="margin:6px 0;">${task.instruction}</p>
      <textarea class="write-area" id="speaking-user-input" placeholder="Gõ hoặc dùng mic bàn phím đọc câu tiếng Hàn của bạn..."></textarea>
      <button class="sketch-pill" id="btn-ai-check-speak" style="margin-top:8px;">✨ Gửi AI chấm chữa & đối đáp</button>
      <div id="ai-speak-output" class="note-box hidden" style="margin-top:10px;"></div>
    `);
    container.appendChild(aiBox);

    document.getElementById('btn-ai-check-speak').addEventListener('click', async () => {
      const text = document.getElementById('speaking-user-input').value.trim();
      if (!text) return;
      const outEl = document.getElementById('ai-speak-output');
      outEl.classList.remove('hidden');
      outEl.innerHTML = "⏳ Gia sư AI đang nghe và sửa câu cho bạn...";
      const res = await evaluateKoreanWithAI(text, task.pattern, "speaking");
      outEl.innerHTML = `
        <div class="note-title">★ Nhận xét & Sửa lỗi:</div>
        <p style="white-space:pre-line; margin-bottom:8px;">${res.correction}</p>
        <div class="example-box">
          <div class="note-title">💬 AI phản hồi hội thoại:</div>
          <p class="example-kr">${res.replyKr}</p>
          <p class="example-vi">${res.replyVi}</p>
          <button class="sketch-pill small-btn" id="btn-ai-reply-speak">🔊 Nghe AI nói</button>
        </div>
      `;
      document.getElementById('btn-ai-reply-speak').dataset.speak = res.replyKr;
      speakKorean(res.replyKr);
    });
  }

  // 3. KỸ NĂNG ĐỌC (Tích Đúng O / Sai X giống Tiếng Hàn Tổng Hợp)
  else if (skillKey === "reading") {
    skillsData.reading.forEach(r => {
      const box = createSketchBox(`
        <div class="kr-title">${r.title}</div>
        <div class="example-box" style="margin:10px 0;">
          <p class="example-kr">${r.passage}</p>
          <button class="sketch-pill small-btn btn-read-audio">🔊 Nghe đọc bài khóa</button>
        </div>
        <div class="note-label">★ Đánh dấu Đúng (O) hoặc Sai (X) cho các câu sau:</div>
        <div class="ox-list"></div>
        <button class="sketch-pill small-btn btn-check-ox" style="margin-top:10px;">Kiểm tra đáp án O / X</button>
        <div class="ox-explain-area" style="margin-top:8px;"></div>
      `);
      box.querySelector('.btn-read-audio').dataset.speak = r.passage;

      const oxList = box.querySelector('.ox-list');
      const userChoices = new Array(r.statements.length).fill(null);

      r.statements.forEach((st, i) => {
        const row = document.createElement('div');
        row.className = 'ox-row';
        row.innerHTML = `
          <span class="ox-stmt">${i + 1}. ${st.text}</span>
          <div class="ox-btns">
            <button class="ox-btn" data-val="true">O</button>
            <button class="ox-btn" data-val="false">X</button>
          </div>
        `;
        row.querySelectorAll('.ox-btn').forEach(b => {
          b.addEventListener('click', () => {
            row.querySelectorAll('.ox-btn').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
            userChoices[i] = (b.dataset.val === "true");
          });
        });
        oxList.appendChild(row);
      });

      box.querySelector('.btn-check-ox').addEventListener('click', () => {
        const expArea = box.querySelector('.ox-explain-area');
        expArea.innerHTML = r.statements.map((st, i) => {
          const ok = userChoices[i] === st.isTrue;
          return `<div class="note-box">
            <strong>Câu ${i + 1}: ${ok ? "✓ Đúng rồi!" : "✕ Sai rồi!"}</strong> — ${st.explain}
          </div>`;
        }).join("");
      });

      container.appendChild(box);
    });
  }

  // 4. KỸ NĂNG VIẾT (Giấy ô vuông 원고지 + Cấu trúc hô ứng + Luyện viết)
  else if (skillKey === "writing") {
    const w = skillsData.writing;

    // Mục 1: Quy tắc giấy ô vuông 원고지
    container.appendChild(createSketchBox(`
      <div class="note-label">1. Quy tắc viết giấy ô vuông (원고지 쓰기)</div>
      ${w.wongojiRules.map(rule => `<p style="margin:5px 0;">${rule}</p>`).join("")}
    `));

    // Mục 2: Cấu trúc hô ứng
    container.appendChild(createSketchBox(`
      <div class="note-label">2. Các cấu trúc hô ứng bắt buộc trong văn viết</div>
      ${w.correlativeStructures.map(item => `
        <div class="note-box">
          <div class="note-title">${item.pair} (${item.meaning})</div>
          <p class="example-kr">${item.ex}</p>
        </div>
      `).join("")}
    `));

    // Mục 3: Thực hành viết trên khung giấy ô vuông 원고지 tương tác
    const practiceBox = createSketchBox(`
      <div class="note-label">3. Luyện viết & Xem trước trên giấy ô vuông (원고지)</div>
      <p style="margin-bottom:6px;">${w.prompt}</p>
      <textarea class="write-area" id="wongoji-input" placeholder="Gõ đoạn văn tiếng Hàn (nhớ thêm dấu cách đầu đoạn nếu muốn lùi ô)..."></textarea>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span id="char-count" class="pink-highlight">Số ô đã viết: 0 ô</span>
        <button class="sketch-pill small-btn" id="btn-ai-check-write">✨ AI chấm bài viết</button>
      </div>
      <div class="wongoji-grid" id="wongoji-grid"></div>
      <div id="ai-write-output" class="note-box hidden" style="margin-top:10px;"></div>
    `);
    container.appendChild(practiceBox);

    const wInput = document.getElementById('wongoji-input');
    const wGrid = document.getElementById('wongoji-grid');
    const charCount = document.getElementById('char-count');

    function updateWongoji() {
      const chars = Array.from(wInput.value.replace(/\n/g, " "));
      charCount.textContent = `Số ô đã viết: ${chars.length} ô`;
      const totalCells = Math.max(40, Math.ceil(chars.length / 10) * 10);
      wGrid.innerHTML = "";
      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'wongoji-cell';
        cell.textContent = chars[i] || "";
        wGrid.appendChild(cell);
      }
    }
    wInput.addEventListener('input', updateWongoji);
    updateWongoji();

    document.getElementById('btn-ai-check-write').addEventListener('click', async () => {
      const text = wInput.value.trim();
      if (!text) return;
      const outEl = document.getElementById('ai-write-output');
      outEl.classList.remove('hidden');
      outEl.innerHTML = "⏳ AI đang chấm bài văn viết của bạn...";
      const res = await evaluateKoreanWithAI(text, "", "writing");
      outEl.innerHTML = `
        <div class="note-title">★ Nhận xét văn viết:</div>
        <p style="white-space:pre-line;">${res.correction}</p>
      `;
    });
  }
}

// Khởi chạy toàn bộ trang
renderTopicsMenu();
renderCard();
renderGrammar();
renderSkill('listening');
