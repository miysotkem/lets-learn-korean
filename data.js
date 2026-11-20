// 1. TỪ VỰNG THEO CỤM (Chèn đường dẫn ảnh tự vẽ/ghép vào mục image)
const VOCAB_CHUNKS = [
  {
    topic: "Đời sống & Quán cà phê",
    image: "images/uong-ca-phe.png",
    chunk: "아이스 아메리카노를 마시다",
    roman: "Aiseu amerikano-reul masida",
    meaning: "Uống Americano đá",
    note: "아이스 (đá) + 아메리카노 (Americano) + 를 (tiểu từ tân ngữ) + 마시다 (uống)"
  },
  {
    topic: "Đời sống & Quán cà phê",
    image: "images/dat-cho-ngoi.png",
    chunk: "창가 자리에 앉다",
    roman: "Changga jarie anda",
    meaning: "Ngồi ở chỗ cạnh cửa sổ",
    note: "창가 (cạnh cửa sổ) + 자리 (chỗ ngồi) + 에 (ở/tại) + 앉다 (ngồi)"
  },
  {
    topic: "Cảm xúc & Học tập",
    image: "images/on-thi.png",
    chunk: "시험을 준비하다",
    roman: "Siheomeul junbihada",
    meaning: "Chuẩn bị cho kỳ thi",
    note: "시험 (kỳ thi) + 을 (tiểu từ) + 준비하다 (chuẩn bị)"
  }
];

// 2. NGỮ PHÁP & BÀI TẬP CHIA ĐUÔI CÂU
const GRAMMAR_LIST = [
  {
    title: "-아/어서 (Vì... nên / Rồi thì...)",
    meaning: "Diễn tả nguyên nhân - kết quả hoặc hành động xảy ra nối tiếp.",
    usage: "Gốc động/tính từ có nguyên âm ㅏ, ㅗ + 아서 | Các nguyên âm khác + 어서 | 하다 -> 해서. (Không chia thì quá khứ trước -아/어서).",
    examples: [
      { kr: "비가 와서 집에 있었어요.", vi: "Vì trời mưa nên tôi đã ở nhà." },
      { kr: "도서관에 가서 공부해요.", vi: "Tôi đến thư viện rồi học bài." }
    ],
    practice: {
      question: "Chia động từ trong ngoặc: 배가 ___ (고프다) 밥을 먹었어요.",
      hint: "고프다 bất quy tắc ㅡ -> 고파 + 아서",
      answer: "고파서"
    }
  },
  {
    title: "-(으)ㄹ 수 있다/없다 (Có thể / Không thể)",
    meaning: "Diễn tả khả năng hoặc sự cho phép làm một việc gì đó.",
    usage: "Gốc có patchim + 을 수 있다 | Không patchim hoặc patchim ㄹ + ㄹ 수 있다.",
    examples: [
      { kr: "한국어를 읽을 수 있어요.", vi: "Tôi có thể đọc được tiếng Hàn." },
      { kr: "매운 음식을 먹을 수 없어요.", vi: "Tôi không thể ăn đồ cay." }
    ],
    practice: {
      question: "Chia động từ trong ngoặc: 내일 일찍 ___ (오다) 있어요.",
      hint: "오다 không có patchim -> 오 + ㄹ 수",
      answer: "올 수"
    }
  }
];

// 3. DỮ LIỆU 4 KỸ NĂNG (NGHE - NÓI - ĐỌC - VIẾT)
const SKILLS_DATA = {
  listening: [
    { text: "오늘 날씨가 좋아서 공원에 갔어요.", hint: "Hôm nay thời tiết đẹp nên tôi đã đi công viên." },
    { text: "내일 친구하고 같이 영화를 볼 거예요.", hint: "Ngày mai tôi sẽ xem phim cùng với bạn." }
  ],
  speaking: [
    { kr: "한국어를 열심히 공부하고 있어요.", vi: "Tôi đang học tiếng Hàn chăm chỉ." },
    { kr: "저는 그림 그리는 것을 좋아해요.", vi: "Tôi thích việc vẽ tranh." }
  ],
  reading: {
    title: "주말 일상 (Cuộc sống cuối tuần)",
    passage: "저는 보통 주말에 집에서 쉬지만 이번 토요일에는 친구를 만났어요. 우리는 홍대 근처 카페에서 이야기를 나누고 같이 사진을 찍었어요. 정말 즐거운 하루였어요.",
    translation: "Thường thì cuối tuần tôi nghỉ ngơi ở nhà nhưng thứ Bảy tuần này tôi đã gặp bạn. Chúng tôi trò chuyện ở quán cà phê gần Hongdae và chụp ảnh cùng nhau. Đó thực sự là một ngày vui vẻ.",
    question: "이 사람은 이번 토요일에 무엇을 했습니까? (Người này đã làm gì vào thứ Bảy tuần này?)",
    options: [
      "집에서 혼자 잤어요. (Ngủ một mình ở nhà)",
      "친구하고 카페에 갔어요. (Đi quán cà phê với bạn)",
      "홍대에서 영화를 봤어요. (Xem phim ở Hongdae)",
      "집에서 요리를 했어요. (Nấu ăn ở nhà)"
    ],
    answerIndex: 1
  },
  writing: {
    prompt: "Đề bài (Dạng TOPIK II Câu 53 / Viết nhật ký): Hãy viết một đoạn văn (khoảng 100 - 200 ký tự) kể về lý do bạn học tiếng Hàn và mục tiêu sắp tới của bạn.",
    sampleAnswer: "저는 한국 문화와 드라마에 관심이 많아서 한국어를 배우기 시작했습니다. 처음에는 문법이 조금 어려웠지만 매일 단어를 외우고 그림을 그리면서 재미있게 공부하고 있습니다. 올해 안에 토픽 3급에 합격하는 것이 저의 목표입니다."
  }
};

// 4. ĐỀ ÔN THI TOPIK
const TOPIK_QUESTIONS = [
  {
    level: "TOPIK I - Ngữ pháp & Từ vựng",
    passage: "",
    question: "Chọn từ đúng điền vào chỗ trống: 어제 밤에 늦게 자서 오늘 아침에 아주 (   ).",
    options: ["피곤해요", "깨끗해요", "조용해요", "가벼워요"],
    answer: 0,
    explanation: "Tối qua ngủ muộn nên sáng nay rất mệt mỏi (피곤하다)."
  },
  {
    level: "TOPIK I - Đọc hiểu",
    passage: "내일은 어머니 생신입니다. 그래서 오늘 백화점에 가서 어머니께 드릴 선물을 샀습니다.",
    question: "Tại sao hôm nay người viết lại đi trung tâm thương mại?",
    options: [
      "Để mua quần áo của mình",
      "Để mua quà sinh nhật tặng mẹ",
      "Để gặp bạn bè ăn tối",
      "Để đi làm thêm"
    ],
    answer: 1,
    explanation: "Câu đầu nhắc '내일은 어머니 생신입니다' (Ngày mai là sinh nhật mẹ) nên đi mua quà tặng mẹ."
  },
  {
    level: "TOPIK II - Đọc hiểu trung cấp",
    passage: "운동을 꾸준히 하면 건강에 좋을 뿐만 아니라 스트레스도 풀 수 있다. 하루에 30분씩 걷는 것만으로도 큰 효과를 볼 수 있다.",
    question: "Nội dung nào đúng với đoạn văn trên?",
    options: [
      "Chỉ vận động mạnh mới giảm được căng thẳng.",
      "Mỗi ngày đi bộ 30 phút cũng mang lại hiệu quả tốt.",
      "Tập thể dục khiến cơ thể dễ mệt mỏi hơn.",
      "Không cần tập thể dục thường xuyên."
    ],
    answer: 1,
    explanation: "'하루에 30분씩 걷는 것만으로도 큰 효과를 볼 수 있다' = Chỉ cần đi bộ 30 phút mỗi ngày cũng thấy hiệu quả lớn."
  }
];
