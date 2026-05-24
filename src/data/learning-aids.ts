export type ToneItem = {
  id: string;
  name: string;
  mark: string;
  bare: string;
  pattern: string;
  childHint: string;
  motion: string;
  color: string;
  contour: number[];
  syllable: string;
  hanzi: string;
  meaning: string;
};

export type RadicalItem = {
  id: string;
  radical: string;
  pinyin: string;
  meaning: string;
  hint: string;
  examples: Array<{
    word: string;
    pinyin: string;
    meaning: string;
  }>;
};

export const toneItems: ToneItem[] = [
  {
    id: "tone-1",
    name: "Thanh 1",
    mark: "mā",
    bare: "a",
    pattern: "cao và ngang",
    childHint: "Giữ giọng đều như đang ngân một nốt nhạc.",
    motion: "Đường thẳng trên cao",
    color: "#0b7285",
    contour: [5, 5, 5, 5],
    syllable: "ma1",
    hanzi: "妈",
    meaning: "mẹ"
  },
  {
    id: "tone-2",
    name: "Thanh 2",
    mark: "má",
    bare: "a",
    pattern: "đi lên",
    childHint: "Bắt đầu vừa phải rồi kéo giọng lên như đang hỏi lại.",
    motion: "Đường leo dốc",
    color: "#2f9e44",
    contour: [3, 4, 5],
    syllable: "ma2",
    hanzi: "麻",
    meaning: "tê, cây gai"
  },
  {
    id: "tone-3",
    name: "Thanh 3",
    mark: "mǎ",
    bare: "a",
    pattern: "xuống rồi lên",
    childHint: "Hạ giọng xuống thấp rồi nhấc lên, giống cái võng.",
    motion: "Đường võng xuống rồi lên",
    color: "#7048e8",
    contour: [2, 1, 2, 3],
    syllable: "ma3",
    hanzi: "马",
    meaning: "ngựa"
  },
  {
    id: "tone-4",
    name: "Thanh 4",
    mark: "mà",
    bare: "a",
    pattern: "rơi nhanh",
    childHint: "Nói ngắn, dứt khoát, giọng rơi từ cao xuống thấp.",
    motion: "Đường trượt xuống",
    color: "#c92a2a",
    contour: [5, 3, 1],
    syllable: "ma4",
    hanzi: "骂",
    meaning: "mắng"
  },
  {
    id: "tone-neutral",
    name: "Thanh nhẹ",
    mark: "ma",
    bare: "a",
    pattern: "ngắn và nhẹ",
    childHint: "Đọc rất nhẹ, không kéo dài, giống âm đi sau bị nói nhỏ lại.",
    motion: "Chấm nhẹ ở giữa",
    color: "#f08c00",
    contour: [3, 3],
    syllable: "ma",
    hanzi: "吗",
    meaning: "trợ từ nghi vấn"
  }
];

export const radicalItems: RadicalItem[] = [
  {
    id: "ren",
    radical: "人 / 亻",
    pinyin: "rén",
    meaning: "người",
    hint: "Thường gặp trong từ chỉ người, nghề nghiệp, hành động của con người.",
    examples: [
      { word: "你", pinyin: "nǐ", meaning: "bạn" },
      { word: "他", pinyin: "tā", meaning: "anh ấy" }
    ]
  },
  {
    id: "kou",
    radical: "口",
    pinyin: "kǒu",
    meaning: "miệng",
    hint: "Liên quan đến nói, ăn, âm thanh hoặc cửa ra vào.",
    examples: [
      { word: "叫", pinyin: "jiào", meaning: "gọi" },
      { word: "吃", pinyin: "chī", meaning: "ăn" }
    ]
  },
  {
    id: "nu",
    radical: "女",
    pinyin: "nǚ",
    meaning: "nữ",
    hint: "Xuất hiện trong nhiều chữ liên quan đến phụ nữ hoặc quan hệ gia đình.",
    examples: [
      { word: "她", pinyin: "tā", meaning: "cô ấy" },
      { word: "妈", pinyin: "mā", meaning: "mẹ" }
    ]
  },
  {
    id: "zi",
    radical: "子",
    pinyin: "zǐ",
    meaning: "con",
    hint: "Hay gặp trong chữ về trẻ nhỏ, học tập hoặc hậu tố danh từ.",
    examples: [
      { word: "字", pinyin: "zì", meaning: "chữ" },
      { word: "孩子", pinyin: "hái zi", meaning: "trẻ con" }
    ]
  },
  {
    id: "xin",
    radical: "心 / 忄",
    pinyin: "xīn",
    meaning: "tim, lòng",
    hint: "Gợi ý cảm xúc, suy nghĩ, trạng thái tinh thần.",
    examples: [
      { word: "想", pinyin: "xiǎng", meaning: "muốn, nghĩ" },
      { word: "忙", pinyin: "máng", meaning: "bận" }
    ]
  },
  {
    id: "shou",
    radical: "手 / 扌",
    pinyin: "shǒu",
    meaning: "tay",
    hint: "Thường nằm trong động tác dùng tay.",
    examples: [
      { word: "打", pinyin: "dǎ", meaning: "đánh, gọi" },
      { word: "找", pinyin: "zhǎo", meaning: "tìm" }
    ]
  },
  {
    id: "shui",
    radical: "水 / 氵",
    pinyin: "shuǐ",
    meaning: "nước",
    hint: "Nhìn thấy bộ này thì thường nghĩ đến nước, chất lỏng, sông hồ.",
    examples: [
      { word: "汉", pinyin: "hàn", meaning: "Hán" },
      { word: "喝", pinyin: "hē", meaning: "uống" }
    ]
  },
  {
    id: "huo",
    radical: "火 / 灬",
    pinyin: "huǒ",
    meaning: "lửa",
    hint: "Gợi ý nhiệt, nấu nướng, cháy sáng.",
    examples: [
      { word: "热", pinyin: "rè", meaning: "nóng" },
      { word: "点", pinyin: "diǎn", meaning: "điểm, giờ" }
    ]
  },
  {
    id: "mu",
    radical: "木",
    pinyin: "mù",
    meaning: "cây, gỗ",
    hint: "Liên quan đến cây cối, vật liệu gỗ hoặc đồ dùng.",
    examples: [
      { word: "杯", pinyin: "bēi", meaning: "cốc" },
      { word: "校", pinyin: "xiào", meaning: "trường" }
    ]
  },
  {
    id: "ri",
    radical: "日",
    pinyin: "rì",
    meaning: "mặt trời, ngày",
    hint: "Hay gặp trong thời gian, ánh sáng, ngày tháng.",
    examples: [
      { word: "明", pinyin: "míng", meaning: "sáng" },
      { word: "星", pinyin: "xīng", meaning: "sao" }
    ]
  },
  {
    id: "yue",
    radical: "月",
    pinyin: "yuè",
    meaning: "mặt trăng, tháng",
    hint: "Có thể chỉ thời gian hoặc bộ phận cơ thể khi đóng vai trò bộ nhục.",
    examples: [
      { word: "月", pinyin: "yuè", meaning: "tháng" },
      { word: "朋友", pinyin: "péng you", meaning: "bạn bè" }
    ]
  },
  {
    id: "yan",
    radical: "言 / 讠",
    pinyin: "yán",
    meaning: "lời nói",
    hint: "Gặp trong chữ liên quan đến nói, hỏi, đọc, ngôn ngữ.",
    examples: [
      { word: "说", pinyin: "shuō", meaning: "nói" },
      { word: "语", pinyin: "yǔ", meaning: "ngôn ngữ" }
    ]
  },
  {
    id: "shi",
    radical: "食 / 饣",
    pinyin: "shí",
    meaning: "ăn",
    hint: "Gợi ý đồ ăn, bữa ăn, nhà hàng.",
    examples: [
      { word: "饭", pinyin: "fàn", meaning: "cơm" },
      { word: "饭店", pinyin: "fàn diàn", meaning: "nhà hàng" }
    ]
  },
  {
    id: "jin",
    radical: "金 / 钅",
    pinyin: "jīn",
    meaning: "kim loại, tiền",
    hint: "Liên quan đến kim loại, tiền bạc, vật cứng.",
    examples: [
      { word: "钱", pinyin: "qián", meaning: "tiền" },
      { word: "钟", pinyin: "zhōng", meaning: "chuông, đồng hồ" }
    ]
  },
  {
    id: "cao",
    radical: "艹",
    pinyin: "cǎo",
    meaning: "cỏ",
    hint: "Thường xuất hiện trong tên cây, hoa, rau, trà.",
    examples: [
      { word: "菜", pinyin: "cài", meaning: "rau, món ăn" },
      { word: "茶", pinyin: "chá", meaning: "trà" }
    ]
  },
  {
    id: "mian",
    radical: "宀",
    pinyin: "mián",
    meaning: "mái nhà",
    hint: "Gợi ý nhà cửa, nơi ở, đồ vật nằm trong nhà.",
    examples: [
      { word: "家", pinyin: "jiā", meaning: "nhà" },
      { word: "客", pinyin: "kè", meaning: "khách" }
    ]
  },
  {
    id: "chuo",
    radical: "辶",
    pinyin: "chuò",
    meaning: "đi, di chuyển",
    hint: "Hay nằm trong chữ chỉ chuyển động, hướng đi, khoảng cách.",
    examples: [
      { word: "这", pinyin: "zhè", meaning: "này" },
      { word: "进", pinyin: "jìn", meaning: "vào" }
    ]
  },
  {
    id: "men",
    radical: "门",
    pinyin: "mén",
    meaning: "cửa",
    hint: "Liên quan đến cửa, không gian bên trong, đóng mở.",
    examples: [
      { word: "问", pinyin: "wèn", meaning: "hỏi" },
      { word: "间", pinyin: "jiān", meaning: "phòng, khoảng" }
    ]
  }
];
