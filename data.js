// DANH SÁCH CHỦ ĐỀ (Hiển thị trong Menu trượt bên cạnh)
const topicsData = [
  { id: "all", name: "Tất cả chủ đề" },
  { id: "daily", name: "1. Đời sống thường nhật (일상생활)" },
  { id: "school", name: "2. Cuộc sống học đường (학교생활)" },
  { id: "social", name: "3. Giao tiếp & Hẹn gặp (만남과 약속)" }
];

// 1. TỪ VỰNG HỌC THEO CỤM (Collocations / Phrases) + ẢNH PINTEREST
const vocabData = [
  {
    topic: "daily",
    topicLabel: "Đời sống thường nhật",
    korean: "알람을 끄고 다시 자다",
    roman: "al-lam-eul kkeu-go da-si ja-da",
    meaning: "Tắt báo thức rồi ngủ tiếp",
    note: "Cụm động từ miêu tả thói quen buổi sáng cực tự nhiên",
    exampleKr: "오늘 아침에 알람을 끄고 다시 자서 지각할 뻔했어요.",
    exampleVi: "Sáng nay tôi tắt báo thức rồi ngủ tiếp nên suýt thì muộn học.",
    image: "https://i.pinimg.com/736x/8c/6e/87/8c6e877e3d409e33d8790f0a4e9a62d8.jpg"
  },
  {
    topic: "daily",
    topicLabel: "Đời sống thường nhật",
    korean: "지하철을 갈아타다",
    roman: "ji-ha-cheol-eul gal-a-ta-da",
    meaning: "Chuyển tuyến tàu điện ngầm",
    note: "Lưu ý: 'Lên xe' dùng 타다, 'Xuống xe' dùng 내리다, 'Chuyển tuyến' dùng 갈아타다",
    exampleKr: "강남역에 가려면 2호선으로 갈아타야 돼요.",
    exampleVi: "Nếu muốn đến ga Gangnam thì phải chuyển sang tuyến số 2.",
    image: "https://i.pinimg.com/736x/4e/7b/2e/4e7b2e1b6c8e9a9e1a8f5e1a8a3d5f2b.jpg"
  },
  {
    topic: "school",
    topicLabel: "Cuộc sống học đường",
    korean: "과제를 제때 제출하다",
    roman: "gwa-je-reul je-ttae je-chul-ha-da",
    meaning: "Nộp bài tập đúng hạn",
    note: "Cụm từ hay gặp trong môi trường đại học Hàn Quốc (제때 = đúng lúc/đúng hạn)",
    exampleKr: "밤을 새워서라도 과제를 제때 제출해야 해요.",
    exampleVi: "Dù có phải thức trắng đêm thì cũng phải nộp bài tập đúng hạn.",
    image: "https://i.pinimg.com/736x/2a/91/4c/2a914c4f9b7e3c1b8a6d5e4f3c2b1a09.jpg"
  },
  {
    topic: "school",
    topicLabel: "Cuộc sống học đường",
    korean: "시험 기간에 밤을 새우다",
    roman: "si-heom gi-gan-e bam-eul sae-u-da",
    meaning: "Thức trắng đêm trong mùa thi",
    note: "Cụm cố định: 밤을 새우다 (thức trắng đêm)",
    exampleKr: "시험 기간이라서 도서관에서 밤을 새우는 학생이 많아요.",
    exampleVi: "Vì đang là mùa thi nên có rất nhiều sinh viên thức trắng đêm ở thư viện.",
    image: "https://i.pinimg.com/736x/9f/3b/1d/9f3b1d8e7c6a5b4d3e2f1a0b9c8d7e6f.jpg"
  },
  {
    topic: "social",
    topicLabel: "Giao tiếp & Hẹn gặp",
    korean: "분위기가 좋은 카페를 찾다",
    roman: "bun-wi-gi-ga jo-eun ka-pe-reul chat-da",
    meaning: "Tìm quán cà phê có không gian đẹp",
    note: "분위기가 좋다 = bầu không khí / không gian đẹp, chill",
    exampleKr: "주말에 친구랑 수다 떨려고 분위기가 좋은 카페를 찾았어요.",
    exampleVi: "Cuối tuần để buôn chuyện với bạn nên tôi đã tìm một quán cà phê không gian đẹp.",
    image: "https://i.pinimg.com/736x/5d/2c/8a/5d2c8a7b6e5f4d3c2b1a0987654321ab.jpg"
  }
];

// 2. NGỮ PHÁP (Theo chủ đề + Giao tiếp + Văn viết + So sánh + Bài tập)
const grammarData = {
  topic: [
    {
      topic: "daily",
      pattern: "Động từ + -(으)면서",
      meaning: "Vừa... vừa... (Hai hành động xảy ra đồng thời bởi cùng 1 chủ ngữ)",
      collocations: "Cụm hay đi kèm: 음악을 들으면서 (vừa nghe nhạc), 밥을 먹으면서 (vừa ăn cơm), 커피를 마시면서 (vừa uống cà phê)",
      note: "Lưu ý: Hai vế bắt buộc phải cùng một chủ ngữ thực hiện!",
      exampleKr: "저는 아침마다 노래를 들으면서 화장을 해요.",
      exampleVi: "Mỗi sáng tôi vừa nghe nhạc vừa trang điểm."
    },
    {
      topic: "school",
      pattern: "Động từ + -느라고",
      meaning: "Vì mải làm gì đó nên... (Vế sau thường là kết quả tiêu cực/không như ý)",
      collocations: "Cụm hay đi kèm: 시험 공부를 하느라고 (vì mải ôn thi), 숙제를 하느라고 (vì mải làm bài tập)",
      note: "Lưu ý: Không dùng với thì quá khứ (-았/었느라고 X) và không dùng câu mệnh lệnh ở vế sau.",
      exampleKr: "어제 발표 준비를 하느라고 한숨도 못 잤어요.",
      exampleVi: "Hôm qua vì mải chuẩn bị thuyết trình nên tôi không chợp mắt được chút nào."
    },
    {
      topic: "social",
      pattern: "Động từ + -(으)ㄹ 겸",
      meaning: "Nhân tiện... luôn / Kết hợp làm 2 việc cùng lúc",
      collocations: "Cụm hay đi kèm: 바람도 쐴 겸 (nhân tiện hóng gió), 인사도 드릴 겸 (nhân tiện chào hỏi)",
      note: "Cấu trúc giao tiếp rất tự nhiên khi rủ rê hoặc giải thích lý do.",
      exampleKr: "점심도 먹을 겸 오랜만에 얼굴 좀 보자!",
      exampleVi: "Nhân tiện ăn trưa luôn thì lâu rồi gặp mặt nhau chút đi!"
    }
  ],
  spoken: [
    {
      pattern: "-(으)ㄹ걸 그랬어요",
      meaning: "Biết thế đã... / Giá mà đã... (Hối tiếc việc đã qua)",
      collocations: "Cấu trúc đi kèm: 미리 + Động từ + -(으)ㄹ걸 그랬어요 (Biết thế đã làm trước...)",
      note: "Dùng nhiều trong hội thoại đời thường để bày tỏ sự tiếc nuối.",
      exampleKr: "우산을 가지고 나올걸 그랬어요. 비가 너무 많이 와요.",
      exampleVi: "Biết thế lúc nãy mang theo ô rồi. Trời mưa to quá."
    },
    {
      pattern: "-잖아요",
      meaning: "Chẳng phải là... sao / ...còn gì (Nhắc lại điều cả 2 người đều biết)",
      collocations: "Hay đi kèm: 내일이 시험이잖아요 (Ngày mai thi rồi còn gì), 너도 알잖아요 (Cậu cũng biết rồi còn gì)",
      note: "Lưu ý: Không dùng với người trên hoặc trong tình huống quá trang trọng.",
      exampleKr: "빨리 출발하자! 오늘 금요일이라서 차가 많이 막히잖아요.",
      exampleVi: "Xuất phát nhanh thôi! Hôm nay là thứ Sáu nên đường tắc lắm còn gì."
    }
  ],
  written: [
    {
      pattern: "Động từ + -는다 / -ㄴ다 (Đuôi câu trần thuật văn viết)",
      meaning: "Thể hiện sự khách quan trong báo chí, nhật ký, bài thi viết TOPIK",
      collocations: "Đi kèm trạng từ văn viết: 따라서 (do đó), 그러나 (tuy nhiên), 즉 (tức là)",
      note: "Lưu ý: Không dùng kính ngữ 요/습니다 khi viết theo thể văn này.",
      exampleKr: "현대 사회에서는 스마트폰을 사용하는 사람이 급격히 증가하고 있다.",
      exampleVi: "Trong xã hội hiện đại, số người sử dụng điện thoại thông minh đang tăng nhanh chóng."
    },
    {
      pattern: "-는 반면에",
      meaning: "Trái lại / Trong khi đó (So sánh 2 mặt đối lập trong văn viết)",
      collocations: "Cấu trúc chuẩn: A은/는 ~는 반면에 B은/는 ~다.",
      note: "Dùng rất nhiều trong bài viết TOPIK II câu 53 & 54.",
      exampleKr: "인터넷 쇼핑은 편리한 반면에 물건을 직접 볼 수 없다는 단점이 있다.",
      exampleVi: "Mua sắm trực tuyến tiện lợi, trái lại có nhược điểm là không thể xem hàng trực tiếp."
    }
  ],
  compare: [
    {
      title: "So sánh: -아/어서 vs -(으)니까 (Cùng nghĩa: Vì... nên...)",
      pointA: "-아/어서: Nguyên nhân khách quan, tự nhiên. KHÔNG đi với câu mệnh lệnh (-세요) hay rủ rê (-읍시다). KHÔNG chia quá khứ ở trước 어서.",
      pointB: "-(으)니까: Lý do chủ quan của người nói. ĐI ĐƯỢC với câu mệnh lệnh/rủ rê và chia được thì quá khứ (-았/었으니까).",
      note: "Mẹo nhớ nhanh: Đuôi câu có '-세요 / -자 / -을까요?' ➔ Chọn -(으)니까!",
      exampleKr: "날씨가 추우니까 따뜻한 옷을 입으세요. (Đúng) / 추워서 입으세요. (Sai)"
    },
    {
      title: "So sánh: -(으)려고 vs -기 위해(서) (Cùng nghĩa: Để / Nhằm mục đích)",
      pointA: "-(으)려고: Dùng nhiều trong giao tiếp hàng ngày, mục đích cá nhân gần gũi.",
      pointB: "-기 위해(서): Trang trọng hơn, dùng nhiều trong văn viết, phát biểu, mục tiêu lớn. Đi được với Danh từ (N을/를 위해).",
      note: "Lưu ý: -(으)려고 chỉ đi với Động từ, không đi trực tiếp với Danh từ.",
      exampleKr: "한국 유학을 가려고 돈을 모아요. / 세계 평화를 위해 노력합니다."
    }
  ],
  practice: [
    {
      type: "cloze",
      prompt: "Điền ngữ pháp thích hợp vào chỗ trống:\n비가 많이 오(        ) 집에서 영화를 봅시다.",
      hint: "Gợi ý: Đuôi câu là '-ㅂ시다' (rủ rê) thì dùng -아서 hay -(으)니까?",
      answer: "니까",
      fullSentence: "비가 많이 오니까 집에서 영화를 봅시다."
    },
    {
      type: "cloze",
      prompt: "Điền ngữ pháp thích hợp vào chỗ trống:\n어제 게임을 하(        ) 숙제를 못 했어요.",
      hint: "Gợi ý: Vì mải làm gì nên dẫn đến kết quả không tốt (-느라고)",
      answer: "느라고",
      fullSentence: "어제 게임을 하느라고 숙제를 못 했어요."
    },
    {
      type: "translate",
      prompt: "Dịch câu sau sang tiếng Hàn (dùng ngữ pháp -(으)면서):\n'Tôi vừa uống cà phê vừa đọc sách.'",
      sampleAnswer: "저는 커피를 마시면서 책을 읽어요.",
      note: "Có thể đảo thứ tự: 책을 읽으면서 커피를 마셔요 đều đúng."
    }
  ]
};

// 3. DỮ LIỆU 4 KỸ NĂNG (NGHE - NÓI - ĐỌC - VIẾT)
const skillsData = {
  listening: {
    dictation: [
      {
        topic: "daily",
        audioText: "오늘 날씨가 너무 추워서 따뜻한 커피를 마시고 싶어요.",
        displaySentence: "오늘 날씨가 너무 ( ________ ) 따뜻한 커피를 마시고 싶어요.",
        answer: "추워서",
        meaning: "Hôm nay trời lạnh quá nên tôi muốn uống cà phê ấm."
      },
      {
        topic: "school",
        audioText: "내일까지 교수님께 리포트를 이메일로 보내야 해요.",
        displaySentence: "내일까지 교수님께 ( ________ )를 이메일로 보내야 해요.",
        answer: "리포트",
        meaning: "Trước ngày mai tôi phải gửi báo cáo qua email cho giáo sư."
      }
    ],
    comprehension: [
      {
        topic: "social",
        audioText: "민수 씨, 우리 오늘 저녁에 홍대입구역 3번 출구 앞에서 만날까요? 거기 새로 생긴 떡볶이집이 진짜 맛있대요.",
        question: "Hai người hẹn gặp nhau ở đâu vào tối nay?",
        options: [
          "A. Trước cửa ra số 3 ga Hongik Univ. (홍대입구역 3번 출구 앞)",
          "B. Bên trong thư viện trường đại học",
          "C. Trước rạp chiếu phim Gangnam",
          "D. Tại bến xe buýt trước cổng trường"
        ],
        answerIndex: 0,
        transcript: "민수 씨, 우리 오늘 저녁에 홍대입구역 3번 출구 앞에서 만날까요? 거기 새로 생긴 떡볶이집이 진짜 맛있대요."
      }
    ]
  },
  speaking: {
    shadowing: [
      {
        topic: "daily",
        kr: "아침에 일어나자마자 물 한 잔을 마시는 습관이 있어요.",
        vi: "Tôi có thói quen uống một cốc nước ngay khi vừa thức dậy buổi sáng.",
        tip: "Ngắt nhịp nhẹ sau 일어나자마자 và 마시는."
      },
      {
        topic: "social",
        kr: "이번 주말에 시간 괜찮으면 같이 전시회 보러 갈래요?",
        vi: "Cuối tuần này nếu rảnh cậu đi xem triển lãm cùng mình nhé?",
        tip: "Lên giọng nhẹ ở cuối câu 갈래요? để tạo ngữ điệu rủ rê tự nhiên."
      }
    ],
    promptTask: {
      pattern: "Động từ + -(으)면서 (Vừa... vừa...)",
      instruction: "Hãy tự đặt 1 câu tiếng Hàn kể về 2 việc bạn thường làm cùng lúc trong ngày, sau đó bấm gửi để AI chấm chữa và hội thoại tiếp:"
    }
  },
  reading: [
    {
      topic: "school",
      title: "Bài đọc: Thư viện trường đại học mùa thi",
      passage: "한국의 대학교에서는 시험 기간이 되면 도서관에 빈자리를 찾기가 아주 어렵습니다. 많은 학생들이 밤늦게까지 공부하기 때문입니다. 요즘은 도서관에서 무료로 간식이나 커피를 나눠 주는 행사도 자주 열립니다. 학생들은 친구들과 함께 밤을 새우며 열심히 시험을 준비합니다.",
      statements: [
        { text: "시험 기간에는 도서관에 빈자리가 많습니다.", isTrue: false, explain: "Sai (X): Bài đọc nói rất khó tìm chỗ trống (빈자리를 찾기가 아주 어렵습니다)." },
        { text: "요즘 도서관에서 무료로 간식을 주는 행사가 있습니다.", isTrue: true, explain: "Đúng (O): Có sự kiện phát đồ ăn nhẹ hoặc cà phê miễn phí." },
        { text: "학생들은 혼자서만 공부하고 밤을 새우지 않습니다.", isTrue: false, explain: "Sai (X): Sinh viên thức trắng đêm cùng bạn bè (친구들과 함께 밤을 새우며)." }
      ]
    }
  ],
  writing: {
    wongojiRules: [
      "1. Mở đầu mỗi đoạn văn mới: Bắt buộc lùi vào 1 ô trống ở đầu dòng.",
      "2. Dấu chấm (.) và dấu phẩy (,): Viết vào góc dưới bên trái của 1 ô riêng. Sau dấu phẩy cách 1 ô, nhưng sau dấu chấm KHÔNG cần cách ô.",
      "3. Chữ số và chữ Latinh (VD: 2026, TOPIK): Viết 2 ký tự vào chung 1 ô vuông.",
      "4. Quy tắc giãn cách (띄어쓰기): Nếu khoảng cách rơi đúng vào ô đầu tiên của dòng mới thì bỏ qua, viết chữ ngay ở ô đầu dòng."
    ],
    correlativeStructures: [
      { pair: "비록 ~(으)ㄹ지라도 / -지만", meaning: "Dù cho... nhưng vẫn...", ex: "비록 시간이 부족할지라도 포기하지 않겠다." },
      { pair: "왜냐하면 ~기 때문이다", meaning: "Bởi vì... là do...", ex: "독서가 중요하다. 왜냐하면 사고력을 길러 주기 때문이다." },
      { pair: "결코 ~지 않다", meaning: "Tuyệt đối không...", ex: "노력 없는 성공은 결코 존재하지 않는다." }
    ],
    vocabPairs: [
      { spoken: "나 / 저 (Tôi)", written: "필자 / 본인 (Người viết)" },
      { spoken: "그래서 (Vì vậy)", written: "따라서 / 그러므로" },
      { spoken: "하지만 / 그런데 (Nhưng)", written: "그러나 / 반면에" },
      { spoken: "아주 / 너무 (Rất)", written: "매우 / 대단히" },
      { spoken: "~해요 / ~습니다", written: "~는다 / -ㄴ다" }
    ],
    prompt: "Đề luyện viết: Hãy viết 2–3 câu tiếng Hàn (thể văn viết -는다/ㄴ다) về lý do bạn học tiếng Hàn:"
  }
};
