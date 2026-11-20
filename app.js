// ====== HÀM HỖ TRỢ CHUNG ======
function speakKorean(text, rate = 0.95) {
  if (!("speechSynthesis" in window)) {
    alert("Trình duyệt không hỗ trợ đọc giọng nói.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

function showImage(imgEl, fallbackEl, src) {
  imgEl.classList.remove("hidden");
  fallbackEl.classList.add("hidden");
  imgEl.src = src;
  imgEl.onerror = () => {
    imgEl.classList.add("hidden");
    fallbackEl.classList.remove("hidden");
    fallbackEl.textContent = `Chưa có ảnh: "${src}" (Hãy thả ảnh vào thư mục images)`;
  };
}

// ====== CHUYỂN TAB CHÍNH ======
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((t) => t.classList.add("hidden"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("hidden");
  });
});

// ====== TAB 1: TỪ VỰNG THEO CỤM ======
const topicSelect = document.getElementById("topic-select");
const topics = ["Tất cả chủ đề", ...new Set(VOCAB_CHUNKS.map((v) => v.topic))];
topics.forEach((t) => {
  const opt = document.createElement("option");
  opt.value = t;
  opt.textContent = t;
  topicSelect.appendChild(opt);
});

let filteredVocab = [...VOCAB_CHUNKS];
let vocabIndex = 0;

const flashcard = document.getElementById("flashcard");
function renderVocabCard() {
  const item = filteredVocab[vocabIndex];
  flashcard.classList.remove("flipped");
  showImage(document.getElementById("card-img"), document.getElementById("card-img-fallback"), item.image);
  document.getElementById("card-chunk").textContent = item.chunk;
  document.getElementById("card-roman").textContent = item.roman;
  document.getElementById("card-meaning").textContent = item.meaning;
  document.getElementById("card-note").textContent = item.note;
  document.getElementById("vocab-counter").textContent = `${vocabIndex + 1} / ${filteredVocab.length}`;
}

topicSelect.addEventListener("change", () => {
  const val = topicSelect.value;
  filteredVocab = val === "Tất cả chủ đề" ? [...VOCAB_CHUNKS] : VOCAB_CHUNKS.filter((v) => v.topic === val);
  vocabIndex = 0;
  renderVocabCard();
});

flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
document.getElementById("btn-speak-chunk").addEventListener("click", (e) => {
  e.stopPropagation();
  speakKorean(filteredVocab[vocabIndex].chunk);
});
document.getElementById("btn-prev-card").addEventListener("click", () => {
  vocabIndex = (vocabIndex - 1 + filteredVocab.length) % filteredVocab.length;
  renderVocabCard();
});
document.getElementById("btn-next-card").addEventListener("click", () => {
  vocabIndex = (vocabIndex + 1) % filteredVocab.length;
  renderVocabCard();
});
document.getElementById("btn-shuffle-card").addEventListener("click", () => {
  filteredVocab.sort(() => Math.random() - 0.5);
  vocabIndex = 0;
  renderVocabCard();
});

// Chuyển đổi Flashcard <-> Quiz từ vựng
const btnVocabCard = document.getElementById("btn-vocab-card");
const btnVocabQuiz = document.getElementById("btn-vocab-quiz");
btnVocabCard.addEventListener("click", () => {
  btnVocabCard.classList.add("active");
  btnVocabQuiz.classList.remove("active");
  document.getElementById("vocab-card-view").classList.remove("hidden");
  document.getElementById("vocab-quiz-view").classList.add("hidden");
});
btnVocabQuiz.addEventListener("click", () => {
  btnVocabQuiz.classList.add("active");
  btnVocabCard.classList.remove("active");
  document.getElementById("vocab-quiz-view").classList.remove("hidden");
  document.getElementById("vocab-card-view").classList.add("hidden");
  renderVocabQuiz();
});

function renderVocabQuiz() {
  const correct = filteredVocab[Math.floor(Math.random() * filteredVocab.length)];
  showImage(document.getElementById("quiz-img"), document.getElementById("quiz-img-fallback"), correct.image);
  const optionsBox = document.getElementById("vocab-quiz-options");
  const feedback = document.getElementById("vocab-quiz-feedback");
  const nextBtn = document.getElementById("btn-next-vocab-quiz");
  optionsBox.innerHTML = "";
  feedback.textContent = "";
  nextBtn.classList.add("hidden");

  let choices = [...VOCAB_CHUNKS].sort(() => Math.random() - 0.5).slice(0, 4);
  if (!choices.includes(correct)) choices[0] = correct;
  choices.sort(() => Math.random() - 0.5);

  choices.forEach((c) => {
    const btn = document.createElement("button");
    btn.textContent = c.chunk;
    btn.addEventListener("click", () => {
      speakKorean(correct.chunk);
      Array.from(optionsBox.children).forEach((b) => (b.disabled = true));
      if (c.chunk === correct.chunk) {
        btn.classList.add("correct");
        feedback.textContent = `Chính xác! "${correct.chunk}" = ${correct.meaning}`;
      } else {
        btn.classList.add("wrong");
        feedback.textContent = `Sai rồi! Đáp án đúng là "${correct.chunk}" (${correct.meaning})`;
      }
      nextBtn.classList.remove("hidden");
    });
    optionsBox.appendChild(btn);
  });
}
document.getElementById("btn-next-vocab-quiz").addEventListener("click", renderVocabQuiz);

// ====== TAB 2: NGỮ PHÁP ======
const grammarSelect = document.getElementById("grammar-select");
GRAMMAR_LIST.forEach((g, idx) => {
  const opt = document.createElement("option");
  opt.value = idx;
  opt.textContent = g.title;
  grammarSelect.appendChild(opt);
});

function renderGrammar(idx) {
  const g = GRAMMAR_LIST[idx];
  document.getElementById("gram-title").textContent = g.title;
  document.getElementById("gram-meaning").textContent = g.meaning;
  document.getElementById("gram-usage").textContent = g.usage;

  const exList = document.getElementById("gram-examples");
  exList.innerHTML = "";
  g.examples.forEach((ex) => {
    const div = document.createElement("div");
    div.className = "example-item";
    div.innerHTML = `<strong>${ex.kr}</strong><br><small>${ex.vi}</small>`;
    div.style.cursor = "pointer";
    div.title = "Bấm để nghe";
    div.addEventListener("click", () => speakKorean(ex.kr));
    exList.appendChild(div);
  });

  document.getElementById("gram-prac-q").textContent = g.practice.question;
  document.getElementById("gram-prac-hint").textContent = `Gợi ý: ${g.practice.hint}`;
  document.getElementById("gram-prac-input").value = "";
  document.getElementById("gram-prac-feedback").textContent = "";
}

grammarSelect.addEventListener("change", () => renderGrammar(grammarSelect.value));
document.getElementById("btn-check-gram").addEventListener("click", () => {
  const g = GRAMMAR_LIST[grammarSelect.value];
  const userAns = document.getElementById("gram-prac-input").value.trim();
  const fb = document.getElementById("gram-prac-feedback");
  if (userAns === g.practice.answer) {
    fb.textContent = `🎉 Chuẩn xác! Đáp án là "${g.practice.answer}".`;
    fb.style.color = "#155724";
  } else {
    fb.textContent = `❌ Chưa đúng. Đáp án đúng là: "${g.practice.answer}"`;
    fb.style.color = "#721c24";
  }
});

// ====== TAB 3: 4 KỸ NĂNG ======
document.querySelectorAll(".skill-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".skill-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".skill-panel").forEach((p) => p.classList.add("hidden"));
    btn.classList.add("active");
    document.getElementById(`skill-${btn.dataset.skill}`).classList.remove("hidden");
  });
});

// 3.1 Nghe
let listenIdx = 0;
document.getElementById("btn-listen-normal").addEventListener("click", () => {
  speakKorean(SKILLS_DATA.listening[listenIdx].text, 0.95);
});
document.getElementById("btn-listen-slow").addEventListener("click", () => {
  speakKorean(SKILLS_DATA.listening[listenIdx].text, 0.65);
});
document.getElementById("btn-check-listen").addEventListener("click", () => {
  const target = SKILLS_DATA.listening[listenIdx];
  const input = document.getElementById("listen-input").value.trim();
  const clean = (s) => s.replace(/[.?!,\s]/g, "");
  const fb = document.getElementById("listen-feedback");
  if (clean(input) === clean(target.text)) {
    fb.textContent = `✅ Chính xác! Nghĩa là: "${target.hint}"`;
  } else {
    fb.textContent = `💡 Câu gốc: "${target.text}" (${target.hint})`;
  }
});
document.getElementById("btn-next-listen").addEventListener("click", () => {
  listenIdx = (listenIdx + 1) % SKILLS_DATA.listening.length;
  document.getElementById("listen-input").value = "";
  document.getElementById("listen-feedback").textContent = "";
  speakKorean(SKILLS_DATA.listening[listenIdx].text, 0.95);
});

// 3.2 Nói
let speakIdx = 0;
function renderSpeak() {
  const item = SKILLS_DATA.speaking[speakIdx];
  document.getElementById("speak-target-kr").textContent = item.kr;
  document.getElementById("speak-target-vi").textContent = item.vi;
  document.getElementById("speak-result").textContent = "";
  document.getElementById("speak-status").textContent = "";
}
document.getElementById("btn-listen-sample").addEventListener("click", () => {
  speakKorean(SKILLS_DATA.speaking[speakIdx].kr);
});
document.getElementById("btn-next-speak").addEventListener("click", () => {
  speakIdx = (speakIdx + 1) % SKILLS_DATA.speaking.length;
  renderSpeak();
});
document.getElementById("btn-start-mic").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const status = document.getElementById("speak-status");
  const result = document.getElementById("speak-result");
  if (!SpeechRecognition) {
    status.textContent = "Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Hãy mở bằng Chrome hoặc Edge nhé!";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  status.textContent = "🎙️ Đang nghe... Bạn hãy đọc to câu tiếng Hàn!";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    status.textContent = "Đã thu âm xong.";
    result.textContent = `Máy nghe được bạn nói: "${transcript}"`;
  };
  recognition.onerror = () => {
    status.textContent = "Không nghe rõ hoặc chưa cấp quyền Micro.";
  };
});

// 3.3 Đọc
function renderReading() {
  const r = SKILLS_DATA.reading;
  document.getElementById("read-title").textContent = r.title;
  document.getElementById("read-passage").textContent = r.passage;
  document.getElementById("read-trans").textContent = r.translation;
  document.getElementById("read-question").textContent = r.question;

  const optBox = document.getElementById("read-options");
  optBox.innerHTML = "";
  r.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      Array.from(optBox.children).forEach((b) => (b.disabled = true));
      if (i === r.answerIndex) {
        btn.classList.add("correct");
        document.getElementById("read-feedback").textContent = "✅ Đúng rồi!";
      } else {
        btn.classList.add("wrong");
        document.getElementById("read-feedback").textContent = "❌ Chưa chính xác, đọc kỹ lại đoạn văn nhé!";
      }
    });
    optBox.appendChild(btn);
  });
}
document.getElementById("btn-toggle-trans").addEventListener("click", () => {
  document.getElementById("read-trans").classList.toggle("hidden");
});

// 3.4 Viết (Lưu nháp tự động vào trình duyệt)
document.getElementById("write-prompt").textContent = SKILLS_DATA.writing.prompt;
document.getElementById("write-sample-box").textContent = `Bài mẫu tham khảo: ${SKILLS_DATA.writing.sampleAnswer}`;
const writeArea = document.getElementById("write-area");
writeArea.value = localStorage.getItem("korean_writing_draft") || "";
document.getElementById("char-count").textContent = `Số ký tự: ${writeArea.value.length}`;

writeArea.addEventListener("input", () => {
  localStorage.setItem("korean_writing_draft", writeArea.value);
  document.getElementById("char-count").textContent = `Số ký tự: ${writeArea.value.length}`;
});
document.getElementById("btn-toggle-sample-write").addEventListener("click", () => {
  document.getElementById("write-sample-box").classList.toggle("hidden");
});

// ====== TAB 4: ÔN THI TOPIK ======
let topikIdx = 0;
let topikSeconds = 600; // 10 phút đếm ngược
let topikTimerInterval = null;

function startTopikTimer() {
  clearInterval(topikTimerInterval);
  topikSeconds = 600;
  topikTimerInterval = setInterval(() => {
    if (topikSeconds <= 0) {
      clearInterval(topikTimerInterval);
      document.getElementById("topik-timer").textContent = "⏱️ Hết giờ!";
      return;
    }
    topikSeconds--;
    const m = String(Math.floor(topikSeconds / 60)).padStart(2, "0");
    const s = String(topikSeconds % 60).padStart(2, "0");
    document.getElementById("topik-timer").textContent = `⏱️ ${m}:${s}`;
  }, 1000);
}

function renderTopik() {
  const q = TOPIK_QUESTIONS[topikIdx];
  document.getElementById("topik-progress").textContent = `Câu ${topikIdx + 1} / ${TOPIK_QUESTIONS.length}`;
  document.getElementById("topik-tag").textContent = q.level;

  const passageEl = document.getElementById("topik-passage");
  if (q.passage) {
    passageEl.textContent = q.passage;
    passageEl.classList.remove("hidden");
  } else {
    passageEl.classList.add("hidden");
  }

  document.getElementById("topik-question").textContent = q.question;
  const expEl = document.getElementById("topik-explanation");
  expEl.classList.add("hidden");
  expEl.textContent = `💡 Giải thích: ${q.explanation}`;

  const optBox = document.getElementById("topik-options");
  optBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i + 1}. ${opt}`;
    btn.addEventListener("click", () => {
      Array.from(optBox.children).forEach((b) => (b.disabled = true));
      if (i === q.answer) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        optBox.children[q.answer].classList.add("correct");
      }
      expEl.classList.remove("hidden");
    });
    optBox.appendChild(btn);
  });
}

document.getElementById("btn-topik-prev").addEventListener("click", () => {
  topikIdx = (topikIdx - 1 + TOPIK_QUESTIONS.length) % TOPIK_QUESTIONS.length;
  renderTopik();
});
document.getElementById("btn-topik-next").addEventListener("click", () => {
  topikIdx = (topikIdx + 1) % TOPIK_QUESTIONS.length;
  renderTopik();
});
document.getElementById("btn-topik-reset").addEventListener("click", () => {
  topikIdx = 0;
  startTopikTimer();
  renderTopik();
});

// Khởi chạy dữ liệu ban đầu
renderVocabCard();
renderGrammar(0);
renderSpeak();
renderReading();
renderTopik();
startTopikTimer();
