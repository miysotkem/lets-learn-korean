// 1. DANH SÁCH TỪ VỰNG & TRANH MINH HỌA (nằm trong thư mục images/)
const vocabData = [
  {
    korean: "커피를 마시다",
    roman: "keo-pi-reul ma-si-da",
    meaning: "Uống cà phê",
    exampleKr: "아침마다 카페에서 커피를 마셔요.",
    exampleVi: "Mỗi sáng tôi đều uống cà phê ở quán.",
    image: "images/uong-ca-phe.png" // Đổi thành tên ảnh bạn đã up lên thư mục images/
  },
  {
    korean: "자리를 예약하다",
    roman: "ja-ri-reul ye-yak-ha-da",
    meaning: "Đặt chỗ ngồi",
    exampleKr: "창가 자리를 미리 예약했어요.",
    exampleVi: "Tôi đã đặt trước chỗ ngồi cạnh cửa sổ.",
    image: "images/dat-cho-ngoi.png"
  },
  {
    korean: "시험을 준비하다",
    roman: "si-heom-eul jun-bi-ha-da",
    meaning: "Ôn thi / Chuẩn bị cho kỳ thi",
    exampleKr: "다음 주 토픽 시험을 열심히 준비해요.",
    exampleVi: "Tôi chăm chỉ ôn thi TOPIK tuần tới.",
    image: "images/on-thi.png"
  }
];

// 2. DANH SÁCH NGỮ PHÁP
const grammarData = [
  {
    pattern: "Động từ + 아/어서",
    meaning: "Vì... nên... (Chỉ nguyên nhân - kết quả tự nhiên)",
    exampleKr: "비가 와서 집에 있었어요.",
    exampleVi: "Vì trời mưa nên tôi đã ở nhà."
  },
  {
    pattern: "Động từ + (으)려고 하다",
    meaning: "Định làm gì đó (Diễn tả ý định)",
    exampleKr: "한국어를 배우려고 해요.",
    exampleVi: "Tôi đang định học tiếng Hàn."
  }
];

// 3. LUYỆN 4 KỸ NĂNG (NGHE - NÓI - ĐỌC - VIẾT)
const skillsData = {
  listening: {
    title: "Luyện Nghe: Nghe câu và chọn nghĩa đúng",
    audioText: "오늘 날씨가 정말 좋아서 공원에 가고 싶어요.",
    options: [
      "Hôm nay thời tiết rất đẹp nên tôi muốn đi công viên.",
      "Hôm nay trời mưa nên tôi ở nhà ngủ.",
      "Ngày mai tôi có hẹn ăn tối với bạn."
    ],
    answerIndex: 0
  },
  speaking: {
    title: "Luyện Nói: Nghe mẫu và đọc to theo từng câu",
    sentences: [
      { kr: "안녕하세요, 만나서 반갑습니다!", vi: "Xin chào, rất vui được gặp bạn!" },
      { kr: "이거 얼마예요? 좀 깎아 주세요.", vi: "Cái này bao nhiêu tiền? Giảm giá chút cho tôi nhé." }
    ]
  },
  reading: {
    title: "Luyện Đọc: Đọc đoạn nhật ký ngắn",
    passage: "저는 주말마다 도서관에 갑니다. 도서관에서 한국어 단어를 외우고 그림도 그립니다. 공부가 끝나면 친구와 맛있는 떡볶이를 먹습니다.",
    question: "Người viết làm gì ở thư viện vào cuối tuần?",
    options: [
      "Học thuộc từ vựng tiếng Hàn và vẽ tranh",
      "Ngủ trưa và nghe nhạc",
      "Nấu món Tteokbokki"
    ],
    answerIndex: 0
  },
  writing: {
    title: "Luyện Viết: Tập đặt câu theo gợi ý",
    prompt: "Hãy viết 1–2 câu tiếng Hàn giới thiệu món ăn hoặc đồ uống bạn thích nhất:",
    sample: "저는 아이스 아메리카노를 제일 좋아해요. 매일 마셔요."
  }
};

// 4. CÂU HỎI ÔN THI TOPIK
const topikData = [
  {
    question: "[TOPIK Đọc] Chọn từ đúng điền vào chỗ trống:\n저는 아침에 빵을 먹습니다. 그리고 우유를 (        ).",
    options: ["마십니다", "입습니다", "읽습니다", "씁니다"],
    answerIndex: 0,
    explain: "우유 (sữa) đi với động từ 마시다 (uống) -> 마십니다."
  },
  {
    question: "[TOPIK Đọc] Chọn nội dung đúng với câu sau:\n우리 집 근처에는 큰 공원이 있습니다.",
    options: [
      "Gần nhà tôi có một công viên lớn.",
      "Trong công viên có nhà của tôi.",
      "Nhà tôi rất xa công viên."
    ],
    answerIndex: 0,
    explain: "근처 (gần/lân cận), 큰 공원 (công viên lớn)."
  }
];
