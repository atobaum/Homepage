var readings = [
    {date_started: "2008-12-28", date_finished: "2009-01-02", title: "타나토노트 2"},
    {date_started: "2009-01-02", date_finished: "2009-01-03", title: "천사들의 제국 1"},
    {date_started: "2009-01-04", date_finished: "2009-01-07", title: "천사들의 제국 2"},
    {date_started: "2009-01-07", date_finished: "2009-01-09", title: "신 1"},
    {date_started: "2009-01-09", date_finished: "2009-01-13", title: "신 2"},
    {date_started: "2009-01-31", date_finished: "2009-02-02", title: "시크릿"},
    {date_started: "2009-03-04", date_finished: "2009-03-05", title: "파피용"},
    {date_started: "2009-03-06", date_finished: "2009-03-09", title: "바보처럼 공부하고 천재처럼 꿈꿔라"},
    {date_started: "2009-03-11", date_finished: "2009-03-12", title: "해리포터와 마법사의 돌 1"},
    {date_started: "2009-03-13", date_finished: "2009-03-15", title: "해리포터와 마법사의 돌 2"},
    {date_started: "2009-03-25", date_finished: "2009-03-31", title: "신 3"},
    {date_started: "2009-04-01", date_finished: "2009-04-03", title: "나무"},
    {date_started: "2009-04-01", date_finished: "2009-04-03", title: "여행의 책"},
    {date_started: "2009-04-02", date_finished: "", title: "심리게임"},
    {date_started: "2009-04-04", date_finished: "2009-04-06", title: "아버지들의 아버지 1"},
    {date_started: "2009-04-06", date_finished: "2009-04-07", title: "아버지들의 아버지 2"},
    {date_started: "2009-04-07", date_finished: "2009-04-11", title: "설득의 심리학"},
    {date_started: "2009-04-14", date_finished: "2009-04-21", title: "기적의 양피지"},
    {date_started: "2009-04-23", date_finished: "2009-04-23", title: "질문의 책"},
    {date_started: "2009-04-30", date_finished: "2009-05-03", title: "신4"},
    {date_started: "2009-05-04", date_finished: "2009-05-10", title: "마지막 강의"},
    {date_started: "2009-05-03", date_finished: "2009-05-05", title: "세상에 너를 소리쳐"},
    {date_started: "2009-05-09", date_finished: "2009-05-09", title: "안녕, D"},
    {date_started: "2009-05-11", date_finished: "2009-05-16", title: "설득의 심리학"},
    {date_started: "2009-05-18", date_finished: "2009-05-31", title: "엄마를 부탁해"},
    {date_started: "2009-06-01", date_finished: "2009-06-20", title: "멘델레예프가 들려주는 주기율포 이야기"},
    {date_started: "2009-06-02", date_finished: "2009-06-07", title: "청소년을 위한 이기는 습관"},
    {date_started: "2009-06-10", date_finished: "2009-06-13", title: "신비한 동물 사전"},
    {date_started: "2009-06-14", date_finished: "2009-06-15", title: "주머니속의 고래"},
    {date_started: "2009-06-30", date_finished: "2009-07-02", title: "신 5"},
    {date_started: "2009-07-02", date_finished: "2009-07-03", title: "신 6"},
    {date_started: "2009-07-06", date_finished: "2009-07-07", title: "나무"},
    {date_started: "2009-07-09", date_finished: "2009-07-10", title: "해리포터와 비밀의 방 1"},
    {date_started: "2009-07-10", date_finished: "2009-07-11", title: "해리포터와 비밀의 방 2"},
    {date_started: "2009-07-12", date_finished: "2009-07-14", title: "해리포터와 아즈카반의 죄수 1"},
    {date_started: "2009-07-14", date_finished: "2009-07-15", title: "해리포터와 아즈카반의 죄수 2"},
    {date_started: "2009-07-15", date_finished: "2009-07-19", title: "걸음아 날 살려라"},
    {date_started: "2009-07-19", date_finished: "2009-07-21", title: "공중그네"},
    {date_started: "2009-07-24", date_finished: "2009-08-04", title: "개미 1"},
    {date_started: "2009-08-04", date_finished: "2009-08-07", title: "개미 2"},
    {date_started: "2009-08-08", date_finished: "2009-08-08", title: "선생님의 밥그릇"},
    {date_started: "2009-08-21", date_finished: "2009-09-14", title: "엄마의 말뚝"},
    {date_started: "2009-08-22", date_finished: "2009-08-22", title: "인간"},
    {date_started: "2009-09-29", date_finished: "2009-09-30", title: "쥐의 똥구멍을 꿰멘 여공"},
    {date_started: "2009-10-10", date_finished: "2009-10-15", title: "설득의 심리학 2"},
    {date_started: "2009-10-15", date_finished: "2009-10-18", title: "심리게임"},
    {date_started: "2009-10-19", date_finished: "2009-10-20", title: "마지막 강의"},
    {date_started: "2009-11-09", date_finished: "2009-11-11", title: "개미 3"},
    {date_started: "2010-03-14", date_finished: "2010-03-17", title: "한눈에 쏙! 수학 지도"},
    {date_started: "2010-03-15", date_finished: "2010-03-15", title: "돈버는 모바일 아이폰 앱스토어"},
    {date_started: "2010-03-16", date_finished: "2010-03-22", title: "지식의 이중주"},
    {date_started: "2010-03-17", date_finished: "2010-03-22", title: "타나토노트 1"},
    {date_started: "2010-03-24", date_finished: "2010-04-11", title: "파라다이스 1"},
    {date_started: "2010-03-23", date_finished: "2010-03-30", title: "타나토노트 2"},
    {date_started: "2010-03-31", date_finished: "2010-04-04", title: "천사들의 제국 1"},
    {date_started: "1000-01-01", date_finished: "2010-04-17", title: "루시드 드림"},
    {date_started: "2010-04-17", date_finished: "2010-07-14", title: "E=mc^2"},
    {date_started: "2010-05-01", date_finished: "2010-05-12", title: "파라다이스 2"},
    {date_started: "2010-05-20", date_finished: "2010-06-17", title: "10번 교향곡"},
    {date_started: "2010-07-13", date_finished: "2010-07-13", title: "Newton Highlight 0과 무한의 과학"},
    {date_started: "2010-07-13", date_finished: "2010-07-13", title: "한권으로 끝내는 우주론"},
    {date_started: "2010-07-13", date_finished: "2010-07-21", title: "생산적인 삶을 위한 자기발전 노트 50"},
    {date_started: "2010-07-21", date_finished: "2010-07-22", title: "보통날의 파스타"},
    {date_started: "2010-07-22", date_finished: "2010-07-25", title: "죽을때 후회하는 스물 다섯가지"},
    {date_started: "2010-08-08", date_finished: "2010-08-08", title: "박사가 사랑한 수식"},
    {date_started: "2010-08-19", date_finished: "2010-08-21", title: "물리와 함께하는 50일"},
    {date_started: "2010-08-19", date_finished: "2010-09-12", title: "스눕"},
    {date_started: "2010-08-23", date_finished: "2010-08-28", title: "양자론이 뭐야?"},
    {date_started: "2010-08-23", date_finished: "2010-08-25", title: "셜록 홈즈 전집 1 : 주홍색 연구"},
    {date_started: "2010-08-30", date_finished: "2010-09-27", title: "눈먼 시계공"},
    {date_started: "2010-10-08", date_finished: "2010-10-26", title: "만들어진 신"},
    {date_started: "2010-10-10", date_finished: "2010-11-01", title: "콘택트 1"},
    {date_started: "2010-10-27", date_finished: "2010-11-01", title: "사람들이 미쳤다고 말한 외로운 수학 천재 이야기"},
    {date_started: "2010-11-02", date_finished: "2010-11-05", title: "콘택트 2"},
    {date_started: "2010-11-07", date_finished: "2010-11-14", title: "눈먼자들의 도시"},
    {date_started: "2010-11-15", date_finished: "2010-11-16", title: "위대한 설계"},
    {date_started: "2010-11-15", date_finished: "2010-11-21", title: "1Q84 1"},
    {date_started: "2010-11-16", date_finished: "2011-01-30", title: "엘러건트 유니버스"},
    {date_started: "2010-12-22", date_finished: "2010-12-25", title: "용의자 X의 헌신"},
    {date_started: "2010-12-25", date_finished: "2010-12-29", title: "카산드라의 거울 1"},
    {date_started: "2010-12-30", date_finished: "2011-01-01", title: "카산드라의 거울 2"},
    {date_started: "2011-01-01", date_finished: "2011-01-01", title: "천사와 악마 1"},
    {date_started: "2011-01-01", date_finished: "2011-01-02", title: "천사와 악마 2"},
    {date_started: "2011-01-04", date_finished: "2011-01-28", title: "이기적 유전자"},
    {date_started: "2011-01-16", date_finished: "2011-01-17", title: "연금술사"},
    {date_started: "2011-01-21", date_finished: "2011-01-22", title: "기계공 시모다"},
    {date_started: "2011-01-23", date_finished: "2011-02-06", title: "꿈의 해석"},
    {date_started: "2011-01-23", date_finished: "2011-02-23", title: "언더 더 돔 1"},
    {date_started: "2011-01-25", date_finished: "", title: "실체에 이르는 길 1"},
    {date_started: "2011-01-25", date_finished: "2011-03-06", title: "화성의 인류학자"},
    {date_started: "2011-02-10", date_finished: "2011-02-14", title: "파인만의 여섯가지 물리 이야기"},
    {date_started: "2011-02-07", date_finished: "2011-03-23", title: "숨겨진 우주"},
    {date_started: "2011-02-16", date_finished: "2011-02-27", title: "불가능은 없다"},
    {date_started: "2011-02-24", date_finished: "2011-03-10", title: "언더 더 돔 2"},
    {date_started: "2011-03-11", date_finished: "2011-04-04", title: "언더 더 돔 3"},
    {date_started: "2011-03-11", date_finished: "2011-03-18", title: "에필로그"},
    {date_started: "2011-03-19", date_finished: "2011-03-26", title: "공부는 내 인생에 대한 예의다"},
    {date_started: "2011-04-05", date_finished: "2011-05-26", title: "문화를 창조하는 새로운 복제자 밈"},
    {date_started: "2011-05-19", date_finished: "2011-05-22", title: "시간을 달리는 소녀"},
    {date_started: "2011-05-26", date_finished: "2011-06-26", title: "암호의 해석"},
    {date_started: "2011-06-05", date_finished: "2011-06-12", title: "즐거운 나의 집"},
    {date_started: "2011-07-08", date_finished: "2011-08-06", title: "LHC. 현대 물리학의 최전선"},
    {date_started: "2011-07-12", date_finished: "2011-07-23", title: "태백산맥 1"},
    {date_started: "2011-07-24", date_finished: "2011-07-31", title: "태백산맥 2"},
    {date_started: "2011-07-29", date_finished: "2011-08-04", title: "아프니까 청춘이다"},
    {date_started: "2011-07-31", date_finished: "2011-08-05", title: "생각 버리기 연습"},
    {date_started: "2011-08-01", date_finished: "2011-08-09", title: "태백산맥 3"},
    {date_started: "2011-08-08", date_finished: "2011-08-12", title: "과학은 어디로 가는가"},
    {date_started: "2011-08-10", date_finished: "2011-08-15", title: "태백산맥 4"},
    {date_started: "2011-08-13", date_finished: "2011-09-11", title: "화내도 괜찮아, 울어도 괜찮아, 모두다 괜찮아"},
    {date_started: "2011-08-15", date_finished: "2011-08-21", title: "태백산맥 5"},
    {date_started: "2011-08-21", date_finished: "2011-08-22", title: "시인의 마음으로 들여다본 수학적 상상의 세계. 허수"},
    {date_started: "2011-08-22", date_finished: "2011-08-28", title: "태백산맥 6"},
    {date_started: "2011-08-22", date_finished: "2011-08-29", title: "신 이론"},
    {date_started: "2011-08-30", date_finished: "2011-09-12", title: "태백산맥 7"},
    {date_started: "2011-08-31", date_finished: "2011-09-07", title: "잘지내나요, 내인생"},
    {date_started: "2011-09-12", date_finished: "2011-09-16", title: "태백산맥 8"},
    {date_started: "2011-09-16", date_finished: "2011-09-22", title: "태백산맥 9"},
    {date_started: "2011-09-22", date_finished: "2011-10-06", title: "태백산맥 10"},
    {date_started: "2011-10-06", date_finished: "2011-10-10", title: "타워"},
    {date_started: "2011-10-11", date_finished: "2011-10-13", title: "도가니"},
    {date_started: "2011-10-16", date_finished: "2011-11-06", title: "브레인 스토리"},
    {date_started: "2011-10-15", date_finished: "2011-10-20", title: "종이 여자"},
    {date_started: "2011-10-17", date_finished: "2011-10-25", title: "스무살, 절대 지지 않기를"},
    {date_started: "2011-10-31", date_finished: "2011-12-12", title: "외로워서 그O어요"},
    {date_started: "2011-11-12", date_finished: "2011-12-13", title: "알레프"},
    {date_started: "2011-12-14", date_finished: "2011-12-20", title: "웃음 1"},
    {date_started: "2011-12-14", date_finished: "2011-12-20", title: "향연 - 사랑에 관하여"},
    {date_started: "2011-12-20", date_finished: "2011-12-26", title: "웃음 2"},
    {date_started: "2011-12-27", date_finished: "2012-01-07", title: "죽음의 중지"},
    {date_started: "2011-12-29", date_finished: "2012-01-03", title: "CEO 스티브 잡스가 인문학자 스티브 잡스를 말하다"},
    {date_started: "2012-01-01", date_finished: "", title: "수학으로 배우는 양자역학의 법칙"},
    {date_started: "2012-01-07", date_finished: "2012-01-10", title: "지식을 위한 철학 통조림 - 담백한 맛"},
    {date_started: "2012-01-17", date_finished: "2012-02-06", title: "무신론자를 위한 종교"},
    {date_started: "2012-01-18", date_finished: "2012-01-19", title: "내 머리로 이해하는 E=mc^2"},
    {date_started: "2012-02-06", date_finished: "2012-02-10", title: "초끈이론의 진실"},
    {date_started: "2012-02-29", date_finished: "2012-03-08", title: "왜 나는 너를 사랑하는가"},
    {date_started: "2012-03-06", date_finished: "2012-03-13", title: "괴델, 불환전성 정리"},
    {date_started: "2012-03-13", date_finished: "2012-03-19", title: "프로이트의 의자"},
    {date_started: "2012-04-04", date_finished: "2012-05-22", title: "고독의 위로"},
    {date_started: "2012-04-25", date_finished: "2012-05-05", title: "양자세계 여행자를 위한 안내서"},
    {date_started: "2012-05-14", date_finished: "2012-05-21", title: "범죄 수학"},
    {date_started: "2012-05-18", date_finished: "2012-06-04", title: "생명이 있는 것은 다 아름답다."},
    {date_started: "2012-06-05", date_finished: "2012-06-14", title: "별을 계산하는 남자"},
    {date_started: "2012-06-15", date_finished: "2012-08-15", title: "심리게임"},
    {date_started: "2012-07-13", date_finished: "2012-07-16", title: "남자의 물건"},
    {date_started: "2012-07-23", date_finished: "2012-07-27", title: "철학 대장간"},
    {date_started: "2012-07-25", date_finished: "2012-11-14", title: "멀티 유니버스"},
    {date_started: "2012-09-10", date_finished: "2012-09-21", title: "Quiet 콰이어트"},
    {date_started: "2012-11-09", date_finished: "", title: "서양 문명을 읽는 코드 신"},
    {date_started: "1000-01-01", date_finished: "1000-01-01", title: "노인과 바다"},
    {date_started: "2012-12-26", date_finished: "2013-02-12", title: "소크라테스의 변명, 크리톤, 잔치"},
    {date_started: "2013-01-12", date_finished: "2013-01-17", title: "삼국지 1"},
    {date_started: "2013-01-17", date_finished: "2013-01-21", title: "삼국지 2"},
    {date_started: "2013-01-22", date_finished: "2013-02-02", title: "삼국지 3"},
    {date_started: "2013-02-02", date_finished: "2013-02-04", title: "삼국지 4"},
    {date_started: "2013-02-05", date_finished: "2013-02-09", title: "삼국지 5"},
    {date_started: "2013-02-09", date_finished: "2013-02-11", title: "삼국지 6"},
    {date_started: "2013-02-12", date_finished: "2013-02-27", title: "삼국지 7"},
    {date_started: "2013-02-13", date_finished: "", title: "Sherlockholmes : A Study of Scarlet"},
    {date_started: "2013-02-27", date_finished: "2013-03-03", title: "삼국지 8"},
    {date_started: "2013-03-04", date_finished: "2013-03-25", title: "우리는 어떻게 죽고싶은가?"},
    {date_started: "2013-03-25", date_finished: "2013-04-09", title: "너무 일찍 나이들어버린 너무 늦게 깨달아버린"},
    {date_started: "2013-04-10", date_finished: "", title: "내가 고양이를 데리고 노는 것일까, 고양이가 나를 데리고 노는 것일까?"},
    {date_started: "2013-04-28", date_finished: "2013-04-28", title: "비즈니스 에버노트"},
    {date_started: "2013-04-29", date_finished: "2013-04-30", title: "에버노트 라이프"},
    {date_started: "2013-05-01", date_finished: "2013-07-11", title: "과학철학의 이해"},
    {date_started: "2013-06-21", date_finished: "2013-06-22", title: "이공계 글쓰기 달인"},
    {date_started: "2013-06-24", date_finished: "2013-06-26", title: "워터"},
    {date_started: "2013-07-13", date_finished: "2013-07-27", title: "그리스인 조르바"},
    {date_started: "2013-07-27", date_finished: "2013-07-31", title: "당신 인생의 이야기"},
    {date_started: "2013-07-28", date_finished: "", title: "은하수를 여행하는 히치하이커를 위한 안내서"},
    {date_started: "2013-08-08", date_finished: "2013-08-11", title: "낯선 땅에 꿈을 심다"},
    {date_started: "2013-08-13", date_finished: "2013-08-17", title: "아빠의 우주여행"},
    {date_started: "2013-08-15", date_finished: "2013-08-19", title: "클라우드 아틀라스 1"},
    {date_started: "2013-08-19", date_finished: "2013-08-23", title: "클라우드 아틀라스 2"},
    {date_started: "2013-08-24", date_finished: "2013-08-25", title: "민희, 치즈에 빠져 유럽을 누비다"},
    {date_started: "2013-08-24", date_finished: "2013-08-25", title: "천년의  침묵"},
    {date_started: "2013-08-26", date_finished: "2013-09-01", title: "하느님 끌기"},
    {date_started: "2013-08-30", date_finished: "2013-09-03", title: "두근 두근 내 인생"},
    {date_started: "2013-09-04", date_finished: "2013-09-09", title: "바람이 분다, 당신이 좋다"},
    {date_started: "2013-09-06", date_finished: "2013-09-15", title: "9일간 우주여행"},
    {date_started: "2013-09-16", date_finished: "2013-11-17", title: "우라가 사랑에 빠졌을 때"},
    {date_started: "2013-09-16", date_finished: "2013-09-21", title: "엔더의 게임"},
    {date_started: "2013-09-26", date_finished: "2013-10-08", title: "다윈지능"},
    {date_started: "2013-10-08", date_finished: "2013-10-12", title: "소프트 웨어 객체의 생애주기"},
    {date_started: "2013-10-13", date_finished: "2013-10-24", title: "살인의 방정식"},
    {date_started: "2013-10-24", date_finished: "2013-10-30", title: "제 3의 인류 1"},
    {date_started: "2013-10-31", date_finished: "2013-11-05", title: "제 3의 인류 2"},
    {date_started: "2013-11-06", date_finished: "2013-11-22", title: "잘 지내나요 내인생"},
    {date_started: "2013-11-23", date_finished: "2014-01-04", title: "종교전쟁"},
    {date_started: "2013-11-27", date_finished: "2013-11-27", title: "프로그래밍 비타민"},
    {date_started: "2013-12-20", date_finished: "12월 24일", title: "신의 궤도 1"},
    {date_started: "2013-12-24", date_finished: "2013-12-25", title: "신의 궤도 2"},
    {date_started: "2013-12-26", date_finished: "2014-01-09", title: "철학의 개념과 주요문제"},
    {date_started: "2013-12-28", date_finished: "2014-01-06", title: "우리 인간의 종교들"},
    {date_started: "2014-01-10", date_finished: "2014-01-11", title: "무궁화 꽃이 피었습니다 1"},
    {date_started: "2014-01-11", date_finished: "2014-01-13", title: "무궁화 꽃이 피었습니다 2"},
    {date_started: "2014-01-19", date_finished: "2014-01-20", title: "무궁화 꽃이 피었습니다 3"},
    {date_started: "2014-01-21", date_finished: "", title: "총균쇠"},
    {date_started: "2014-01-23", date_finished: "2014-01-25", title: "오페라의 유령"},
    {date_started: "2014-02-08", date_finished: "2014-02-23", title: "로봇 다빈치, 꿈을 설계하다"},
    {date_started: "2014-02-24", date_finished: "2014-03-26", title: "죽음이란 무엇인가"},
    {date_started: "2014-02-24", date_finished: "2014-03-09", title: "미래의 물리학"},
    {date_started: "2014-03-27", date_finished: "2014-03-27", title: "제 3의 인류 3"},
    {date_started: "2014-03-28", date_finished: "2014-03-28", title: "제 3의 인류 4"},
    {date_started: "2014-03-09", date_finished: "", title: "논어"},
    {date_started: "2014-03-31", date_finished: "2014-04-12", title: "파이이야기"},
    {date_started: "2014-04-13", date_finished: "2014-04-21", title: "유토피아"},
    {date_started: "2014-04-18", date_finished: "2014-04-20", title: "카투사 이렇게 하면 성공한다"},
    {date_started: "2014-04-21", date_finished: "", title: "차라투스투라는 이렇게 말했다"},
    {date_started: "2014-04-24", date_finished: "2014-05-02", title: "철학의 13가지 질문"},
    {date_started: "2014-05-03", date_finished: "2014-05-24", title: "누구나 한번쯤 철학을 생각한다"},
    {date_started: "2014-05-16", date_finished: "2014-05-18", title: "파운데이션"},
    {date_started: "2014-05-19", date_finished: "2014-05-24", title: "파운데이션과 제국"},
    {date_started: "2014-05-25", date_finished: "2014-06-01", title: "제 2 파운데이션"},
    {date_started: "2014-06-02", date_finished: "2014-06-15", title: "철학연습"},
    {date_started: "2014-06-02", date_finished: "2014-06-11", title: "파운데이션의 끝"},
    {date_started: "2014-06-12", date_finished: "2014-06-14", title: "파운데이션과 지구"},
    {date_started: "2014-05-15", date_finished: "2014-06-20", title: "파운데이션의 서막"},
    {date_started: "2014-06-16", date_finished: "2014-06-30", title: "CODE"},
    {date_started: "2014-06-20", date_finished: "2014-06-24", title: "파운데이션을 향하여"},
    {date_started: "2014-06-27", date_finished: "2014-07-01", title: "책에 대해 던지는 7가지 질문"},
    {date_started: "2014-06-27", date_finished: "2014-07-06", title: "V for vendetta"},
    {date_started: "2014-07-01", date_finished: "", title: "빅뱅이전"},
    {date_started: "2014-07-02", date_finished: "2014-07-12", title: "혼자사는 것에 대햐여"},
    {date_started: "2014-07-02", date_finished: "2014-07-03", title: "양자인간"},
    {date_started: "2014-07-09", date_finished: "2014-07-22", title: "물질, 생명, 인간"},
    {date_started: "2014-07-11", date_finished: "2014-08-05", title: "의식의 수수께끼를 풀다"},
    {date_started: "2014-07-14", date_finished: "2014-07-17", title: "니체의 말"},
    {date_started: "2014-07-23", date_finished: "2014-08-05", title: "나는 이렇게 철학을 하였다"},
    {date_started: "2014-08-06", date_finished: "2014-08-14", title: "인간은 왜 박수를 치는가"},
    {date_started: "2014-08-07", date_finished: "2014-08-15", title: "푸코, 바르트, 레비스트로스, 라캉 쉽게 읽기"},
    {date_started: "2014-08-08", date_finished: "2014-08-10", title: "창문을 넘어 도망친 100세 노인"},
    {date_started: "2014-08-15", date_finished: "2014-08-18", title: "1984"},
    {date_started: "1000-01-01", date_finished: "2014-08-18", title: "자바로 배우는 쉬운 자료구조"},
    {date_started: "2014-08-18", date_finished: "2014-09-07", title: "처음읽는 프랑스 현대 철학"},
    {date_started: "2014-08-20", date_finished: "2014-08-24", title: "후불제 민주주의"},
    {date_started: "1000-01-01", date_finished: "2014-09-05", title: "JAVA로 구현하 ㄴ자료구조"},
    {date_started: "2014-09-15", date_finished: "2014-09-22", title: "당연하고 사소한 것들의 철학"},
    {date_started: "1000-01-01", date_finished: "2014-09-29", title: "TAHD"},
    {date_started: "2014-09-24", date_finished: "2014-10-16", title: "노예 12년"},
    {date_started: "2014-10-07", date_finished: "2014-11-08", title: "검열에 관한 검은 책"},
    {date_started: "2014-11-10", date_finished: "1000-01-01", title: "정의란 무엇인가"},
    {date_started: "2014-11-10", date_finished: "2014-11-18", title: "상실의 시대"},
    {date_started: "2014-11-19", date_finished: "2014-11-21", title: "어느 책 중독자의 고백"},
    {date_started: "2014-11-17", date_finished: "2014-12-01", title: "패턴 그리고 객체지향적 코딩의 법칙"},
    {date_started: "2014-11-21", date_finished: "2014-12-06", title: "오직 독서뿐"},
    {date_started: "2014-12-07", date_finished: "2015-05-18", title: "책은 도끼다"},
    {date_started: "2014-12-08", date_finished: "2014-12-12", title: "인체 재활용"},
    {date_started: "2014-12-11", date_finished: "2014-12-10", title: "칼의 노래"},
    {date_started: "2014-12-19", date_finished: "2014-12-25", title: "세상이 끝날때까지 아직 10억년"},
    {date_started: "2014-12-19", date_finished: "2014-12-25", title: "(뇌를 자극하는) 프로그래밍의 원리"},
    {date_started: "2014-12-26", date_finished: "2014-12-31", title: "밥벌이의 지겨움"},
    {date_started: "2015-01-01", date_finished: "2015-01-05", title: "뇌, 생각의 출현"},
    {date_started: "2015-01-03", date_finished: "2015-01-11", title: "아들아, 다시는 평발을 내밀지 마라"},
    {date_started: "2015-01-03", date_finished: "2015-02-15", title: "SF 명예의 전당 1"},
    {date_started: "2015-01-04", date_finished: "2015-01-05", title: "유모차를 사랑한 남자"},
    {date_started: "2015-01-11", date_finished: "2015-02-05", title: "부분과 전체"},
    {date_started: "2015-01-15", date_finished: "2015-01-20", title: "나는 나를 파괴할 권리가 있다"},
    {date_started: "2015-01-21", date_finished: "2015-01-22", title: "나는 나를 파괴할 권리가 있다"},
    {date_started: "2015-01-22", date_finished: "2015-01-25", title: "이반 일리치의 죽음"},
    {date_started: "2015-01-26", date_finished: "2015-01-31", title: "향수"},
    {date_started: "2015-02-05", date_finished: "2015-02-09", title: "실존주의는 휴머니즘이다"},
    {date_started: "2015-02-18", date_finished: "2015-05-18", title: "그림으로 이해하는 현대사상"},
    {date_started: "2015-02-18", date_finished: "2015-04-03", title: "우울할땐 니체"},
    {date_started: "1000-01-01", date_finished: "2015-03-06", title: "변신"},
    {date_started: "2015-03-08", date_finished: "2015-04-20", title: "로쟈의 인문학 서재"},
    {date_started: "2015-03-08", date_finished: "2015-03-23", title: "참을 수 없는 존재의 가벼움"},
    {date_started: "2015-03-10", date_finished: "2015-03-23", title: "소셜 애니멀"},
    {date_started: "2015-04-20", date_finished: "2015-04-25", title: "영원의 끝"},
    {date_started: "2015-04-26", date_finished: "2015-05-01", title: "노인을 위한 나라는 없다"},
    {date_started: "1000-01-01", date_finished: "2015-05-02", title: "순간의 꽃"},
    {date_started: "1000-01-01", date_finished: "2015-05-11", title: "창의성의 즐거움"},
    {date_started: "2015-05-05", date_finished: "2015-05-09", title: "해변의 카프카 상"},
    {date_started: "2015-05-11", date_finished: "2015-05-13", title: "해변의 카프카 하"},
    {date_started: "2015-05-14", date_finished: "2015-05-25", title: "2015 제 6회 젊은 작가상 수상 잡품집"},
    {date_started: "2015-05-16", date_finished: "2015-05-16", title: "그리고 신은 얘기나 좀 하자고 말했다"},
    {date_started: "2016-05-18", date_finished: "2015-05-24", title: "SF 철학"},
    {date_started: "2015-05-28", date_finished: "2015-05-29", title: "보다"},
    {date_started: "2015-06-01", date_finished: "2015-06-11", title: "7년의 밤"},
    {date_started: "2015-06-01", date_finished: "2015-06-04", title: "지적 대화를 위한 넓고 얕은 지식 2"},
    {date_started: "2015-06-05", date_finished: "2015-06-06", title: "로지코믹스"},
    {date_started: "2015-06-11", date_finished: "2015-06-19", title: "지적대회를 위한 넓고 얕은 지식 1"},
    {date_started: "2015-06-11", date_finished: "2015-06-13", title: "2001 스페이스 오디세이"},
    {date_started: "2016-06-13", date_finished: "2015-06-17", title: "보다"},
    {date_started: "2015-06-19", date_finished: "2015-06-20", title: "아자젤"},
    {date_started: "2015-06-20", date_finished: "2015-06-22", title: "수학의 세계"},
    {date_started: "2015-06-21", date_finished: "06월 21일", title: "80만원으로 세계여행"},
    {date_started: "2015-06-21", date_finished: "2015-07-01", title: "데미안"},
    {date_started: "2015-07-01", date_finished: "2015-07-02", title: "살인자의 기억법"},
    {date_started: "2015-07-04", date_finished: "2015-10-04", title: "코스모스"},
    {date_started: "2015-07-11", date_finished: "2015-07-11", title: "멈추면 비로소 보이는 것들"},
    {date_started: "2015-07-21", date_finished: "2015-07-24", title: "꿀꺽, 한입의 과학"},
    {date_started: "2015-07-22", date_finished: "2015-07-23", title: "여덟단어"},
    {date_started: "2015-07-29", date_finished: "2015-08-15", title: "참을 수 없는 존재의 가벼움"},
    {date_started: "2015-08-05", date_finished: "2015-08-07", title: "BONK"},
    {date_started: "2015-08-11", date_finished: "2015-08-11", title: "가마틀 스타일"},
    {date_started: "2015-08-13", date_finished: "2015-08-19", title: "영화를 어떻게 읽을 것인가"},
    {date_started: "2015-08-15", date_finished: "2015-08-15", title: "크눌프"},
    {date_started: "2015-08-15", date_finished: "2015-08-19", title: "체호프 단편선"},
    {date_started: "1000-01-01", date_finished: "2015-08-16", title: "파인만의 엉뚱 발랄한 컴퓨터 강의"},
    {date_started: "2015-08-18", date_finished: "2015-08-21", title: "인간 컴퓨터 언어"},
    {date_started: "2015-08-16", date_finished: "2015-09-11", title: "사과에 대한 고집"},
    {date_started: "2015-08-20", date_finished: "2015-08-23", title: "감정수업"},
    {date_started: "2015-08-22", date_finished: "2015-08-22", title: "모의해킹이란 무엇인가"},
    {date_started: "2015-08-23", date_finished: "2015-08-27", title: "달과 6펜스"},
    {date_started: "2015-08-23", date_finished: "2015-08-25", title: "인공지능 붓다를 꿈꾸다"},
    {date_started: "2015-09-14", date_finished: "2015-09-28", title: "생명의 개연성"},
    {date_started: "2015-09-24", date_finished: "2015-10-03", title: "그곳에는 어처구니들이 산다"},
    {date_started: "2015-09-25", date_finished: "10월 17일", title: "리스본행 야간열차"},
    {date_started: "2015-10-04", date_finished: "2015-10-17", title: "파인만씨 농담도 잘하시네 1"},
    {date_started: "2015-10-18", date_finished: "2015-10-31", title: "파인만씨 농담도 잘하시네2"},
    {date_started: "10월 19일", date_finished: "2015-10-24", title: "미학 오디세이1"},
    {date_started: "2015-10-24", date_finished: "2015-11-14", title: "미학 오디세이2"},
    {date_started: "2015-10-26", date_finished: "2015-10-30", title: "나미야 잡화점"},
    {date_started: "2015-10-30", date_finished: "2015-11-03", title: "읽는 인간"},
    {date_started: "2015-11-04", date_finished: "2015-11-05", title: "에디톨로지"},
    {date_started: "2015-11-05", date_finished: "2015-11-07", title: "꿈꾸는 책들의 도시 1"},
    {date_started: "2015-11-07", date_finished: "2015-11-13", title: "꿈꾸는 책들의 도시 2"},
    {date_started: "2015-11-14", date_finished: "2015-11-27", title: "미학 오디세이 3"},
    {date_started: "2015-11-14", date_finished: "2015-11-29", title: "젊은 베르테르의 슬픔"},
    {date_started: "2015-11-20", date_finished: "2015-11-22", title: "쳉춘의 여행"},
    {date_started: "2015-11-30", date_finished: "2015-12-04", title: "스무살"},
    {date_started: "2015-12-05", date_finished: "2015-12-11", title: "셈을 할 줄 아는 까막눈이 여자"},
    {date_started: "2015-12-11", date_finished: "2015-12-21", title: "투명인간"},
    {date_started: "2015-11-30", date_finished: "2016-01-13", title: "잘라라"},
    {date_started: "2015-12-23", date_finished: "2015-12-23", title: "연필깎이의 정석"},
    {date_started: "2015-12-24", date_finished: "2015-12-26", title: "서민적 글쓰기"},
    {date_started: "2015-12-26", date_finished: "2015-12-28", title: "책벌레와 메모광"},
    {date_started: "2015-12-26", date_finished: "2015-12-26", title: "죽음을 어떻게 말할까"},
    {date_started: "2015-12-26", date_finished: "2015-12-29", title: "가짜팔로 하는 포옹"},
    {date_started: "2015-12-29", date_finished: "2016-01-08", title: "니체의 인생강의"},
    {date_started: "2015-12-30", date_finished: "2016-01-01", title: "곁에두고읽는니체"},
    {date_started: "2016-01-02", date_finished: "2016-01-06", title: "우리가 볼 수 없는 모든 빛 1"},
    {date_started: "2016-01-14", date_finished: "2016-01-20", title: "몸의 일기"},
    {date_started: "2016-01-20", date_finished: "2016-01-21", title: "인간이란 무엇인가"},
    {date_started: "2016-01-20", date_finished: "2016-01-28", title: "SF 명예의 전당 1"},
    {date_started: "2016-01-28", date_finished: "2016-01-29", title: "내가 사랑한 첫 문장"},
    {date_started: "2016-01-29", date_finished: "2016-01-29", title: "날개"},
    {date_started: "1000-01-01", date_finished: "2016-02-21", title: "여행"},
    {date_started: "2016-02-21", date_finished: "2016-02-28", title: "1Q84"},
    {date_started: "1000-01-01", date_finished: "2016-02-21", title: "자유죽음"},
    {date_started: "2016-02-28", date_finished: "2016-02-28", title: "TCP/Ip가 보이는 그림책"},
    {date_started: "2016-02-28", date_finished: "2016-03-02", title: "1Q84 2"},
    {date_started: "2016-03-03", date_finished: "2016-03-20", title: "1Q84 3"},
    {date_started: "2016-03-06", date_finished: "1000-01-01", title: "그림으로 공부하는 IT 인프라 구조"},
    {date_started: "2016-03-04", date_finished: "2016-03-17", title: "에로스의 종말"},
    {date_started: "2016-03-20", date_finished: "2016-03-30", title: "인간실격"},
    {date_started: "2016-03-31", date_finished: "2016-04-02", title: "이방인"},
    {date_started: "2016-04-02", date_finished: "2016-04-07", title: "표백"},
    {date_started: "2016-04-08", date_finished: "2016-04-08", title: "지금은 없는 이야기"},
    {date_started: "2016-04-08", date_finished: "2016-05-22", title: "권력이란 무엇인가"},
    {date_started: "2016-04-09", date_finished: "2016-04-26", title: "어두운 상점들의 거리"},
    {date_started: "2016-04-27", date_finished: "2016-05-02", title: "인생교과서7: 니체"},
    {date_started: "2016-05-03", date_finished: "2016-05-07", title: "이것은 일기가 아니다"},
    {date_started: "2016-05-09", date_finished: "2016-05-22", title: "색채가 없는 다자키 쓰쿠르와"},
    {date_started: "2016-05-23", date_finished: "2016-05-29", title: "이것은 미술이 아니다"},
    {date_started: "2016-05-30", date_finished: "2016-05-30", title: "양자비트와 양자암호"},
    {date_started: "2016-05-20", date_finished: "2016-05-29", title: "그믐"},
    {date_started: "2016-06-04", date_finished: "1000-01-01", title: "웃음과 망각의 책"},
    {date_started: "2016-06-10", date_finished: "2016-06-12", title: "고전시작"},
    {date_started: "2016-06-21", date_finished: "2016-06-23", title: "읽다"},
    {date_started: "2016-06-23", date_finished: "2016-06-27", title: "데미안"},
    {date_started: "2016-06-28", date_finished: "2016-06-28", title: "우리의 기억은 왜 그토록 불안정할까"},
    {date_started: "2016-06-28", date_finished: "2016-07-04", title: "춤추는 죽음1"},
    {date_started: "2016-07-04", date_finished: "2016-08-24", title: "리스본행 야간열차"},
    {date_started: "2016-07-11", date_finished: "2016-07-13", title: "세상의 바보들에게 웃으면서"},
    {date_started: "2016-07-13", date_finished: "2016-07-19", title: "뮤지코필리아"},
    {date_started: "2016-07-14", date_finished: "2016-07-15", title: "책이되어버린 남자"},
    {date_started: "2016-07-14", date_finished: "2016-07-14", title: "개미제국의 발견"},
    {date_started: "2016-07-24", date_finished: "2016-08-10", title: "통제불능"},
    {date_started: "2016-08-23", date_finished: "2016-08-27", title: "세계를 바꾼 17가지 방정식"},
    {date_started: "2016-08-26", date_finished: "2016-08-31", title: "어디선가 나를 찾는"},
    {date_started: "2016-09-01", date_finished: "1000-01-01", title: "파우스트 1"},
    {date_started: "2016-09-03", date_finished: "2016-09-08", title: "읽지 않은 책에 대해"},
    {date_started: "2016-09-03", date_finished: "2016-09-04", title: "무성애를 말하다"},
    {date_started: "2016-09-12", date_finished: "2016-09-15", title: "봇코짱"},
    {date_started: "2016-09-15", date_finished: "2016-09-16", title: "변덕쟁이 로봇"},
    {date_started: "2016-09-25", date_finished: "", title: "칸트와 헤겔의 철학"},
    {date_started: "2016-09-26", date_finished: "2016-10-18", title: "밥벌이의 지겨움"},
    {date_started: "2016-10-04", date_finished: "2016-10-16", title: "교수와 광인"},
    {date_started: "2016-09-18", date_finished: "2016-10-31", title: "이 치열한 무력을"},
    {date_started: "2016-10-25", date_finished: "2016-10-31", title: "언 플래트닝"},
    {date_started: "2016-10-25", date_finished: "2016-11-08", title: "미술관에 간 화학자"},
    {date_started: "2016-11-06", date_finished: "2016-11-11", title: "낯익은 타인들의 도시"},
    {date_started: "2016-11-11", date_finished: "2016-11-14", title: "아니키즈 "},
    {date_started: "2016-11-11", date_finished: "2016-11-18", title: "교수대 위의 카치"},
    {date_started: "2016-11-18", date_finished: "2016-11-26", title: "아나키즘"},
    {date_started: "2016-11-25", date_finished: "2016-11-27", title: "채식주의자"},
    {date_started: "2016-11-30", date_finished: "2016-12-01", title: "개소리에 대하여"},
    {date_started: "2016-11-29", date_finished: "2016-12-04", title: "아니키즘 국가권력을"},
    {date_started: "2016-11-24", date_finished: "2016-12-08", title: "암호학의 이해"},
    {date_started: "2016-11-28", date_finished: "2017-01-02", title: "클릭"},
    {date_started: "2016-11-28", date_finished: "2016-12-15", title: "인공지능: 현대적 접근방식 1"},
    {date_started: "2016-12-22", date_finished: "2016-12-24", title: "유시민의 글쓰기 특강"},
    {date_started: "2016-12-16", date_finished: "2016-12-28", title: "향수"},
    {date_started: "2016-12-27", date_finished: "2016-12-28", title: "편의점 인간"},
    {date_started: "2016-12-31", date_finished: "2017-01-02", title: "몸에 갖힌 사람들"},
    {date_started: "2017-01-05", date_finished: "", title: "세상의 모든 철학"},
    {date_started: "2017-01-08", date_finished: "2017-01-08", title: "인생수업"},
    {date_started: "2017-01-09", date_finished: "2017-01-09", title: "최선의 삶"},
    {date_started: "2017-01-11", date_finished: "2017-02-06", title: "SF명예의 전당 3"},
    {date_started: "2017-01-17", date_finished: "2017-01-17", title: "전복과 반전의 순간"},
    {date_started: "2017-01-13", date_finished: "2017-01-21", title: "한글의 탄생"},
    {date_started: "2017-01-24", date_finished: "2017-01-28", title: "호밀밭의 파수꾼"},
    {date_started: "2017-01-29", date_finished: "2017-02-18", title: "소송"},
    {date_started: "2017-02-18", date_finished: "2017-03-16", title: "후불제 민주주의"},
    {date_started: "2017-02-18", date_finished: "2017-02-23", title: "동유럽 문화도시 기행"},
    {date_started: "2017-02-24", date_finished: "2017-03-10", title: "여행의 기술"},
    {date_started: "2017-02-24", date_finished: "2017-03-16", title: "서양미술사 1"},
    {date_started: "2017-03-17", date_finished: "2017-03-30", title: "역사란 무엇인가"},
    {date_started: "2017-03-23", date_finished: "2017-03-28", title: "눈뜬자들의 도시"},
    {date_started: "2017-03-30", date_finished: "2017-04-02", title: "코끼리의 여행"},
    {date_started: "2017-04-01", date_finished: "2017-04-03", title: "아직은 신이 아니야"},
    {date_started: "2017-04-03", date_finished: "2017-04-07", title: "피로사회"},
    {date_started: "2017-04-06", date_finished: "2017-04-09", title: "매혹사는 식물의 뇌"},
    {date_started: "2017-04-09", date_finished: "2017-04-11", title: "만약은 없다"},
    {date_started: "2017-04-09", date_finished: "2017-04-10", title: "타자의 추방"},
    {date_started: "2017-04-11", date_finished: "2017-04-13", title: "환상통"}
];

var authors = [];
function manualSelectBook(){
    for(var i = 0; i < authors.length; i++){
        delete authors[i].text;
    }

    var book = {};
    //language=JQuery-CSS
    var form = $('#manual_book_form');
    book.title = form.find('input[name="title"]').val();
    book.publisher = form.find('input[name="publisher"]').val();
    book.published_date = form.find('input[name="published_date"]').val();
    var isbn = form.find('input[name="isbn"]').val();
    book.isbn13 = (isbn.length === 10) ? '978'+isbn : isbn;
    book.cover_URL = form.find('input[name="cover_URL"]').val();
    book.subtitle = form.find('input[name="subtitle"]').val();
    book.original_title = form.find('input[name="original_title"]').val();
    book.pages = form.find('input[name="pages"]').val();
    book.authors = authors;

    setBook(book);
    $('.modal').modal('hide');
    return false;
}


function resetBook(){
    $('#form_isbn13').val('');
    $('#form_book').val('');
    $('#book_panel').hide();
    $('#btns_add_book').show();
}

function selectBook(isbn13){
    $.ajax({
        url: '/bookshelf/api/bookinfo/aladin?isbn13='+isbn13,
        dataType: 'json',
        success: function(data){
            if(data.ok === 0){
                console.log('error: '+data.error);
                return;
            }
            var book = data.result;
            if(book.authors){
                setBook(book);
            } else{ //need manual adding
                var form = $('#manual_book_form');
                var messageBox = form.parent().find('.ui.message');
                messageBox.addClass('negative');
                messageBox.find('.header').text('책 자동 추가 실패. 저자를 수동으로 추가해주세요.');
                messageBox.find('p').text("저자: " + book.authorsText);
                messageBox.show();
                $('#manual_author_type').dropdown('clear');
                form.find('input[name="title"]').val(book.title);
                form.find('input[name="publisher"]').val(book.publisher);
                form.find('input[name="published_date"]').val(book.published_date);
                form.find('input[name="isbn"]').val(book.isbn13);
                form.find('input[name="cover_URL"]').val(book.cover_URL);
                form.find('input[name="original_title"]').val(book.original_title);
                form.find('input[name="pages"]').val(book.pages);
                $('.modal.small').modal('show');
            }
        }
    });

}

function formatAuthors(authors){
    var formatted_authors = '';
    for(var i in authors){
        var author = authors[i];
        formatted_authors += author.name;
        switch(author.type){
            case 'author':
                formatted_authors += ' 지음, ';
                break;
            case 'translator':
                formatted_authors += ' 번역, ';
                break;
            case 'supervisor':
                formatted_authors += ' 감수, ';
                break;
            case 'illustrator':
                formatted_authors += ' 그림, ';
                break;
        }
    }
    formatted_authors = formatted_authors.substring(0, formatted_authors.length-2) + '.';
    return formatted_authors;
}

function setBook(book){
    $('#form_isbn13').val(book.isbn13);
    $('#book_cover').attr('src',book.cover_URL);
    $('#book_title').text(book.title);
    $('#book_authors').text(formatAuthors(book.authors));
    $('#book_publish').text(book.publisher + ' | ' + book.published_date + " | " + book.isbn13);
    $('.ui.search').search('set value', '');
    $('#book_list_wrapper').hide();
    $('#book_panel').show();
    $('#btns_add_book').hide();
    $('#form_book').val(JSON.stringify(book));
    $('#manual_authors .message').hide();
}

function searchBookByKeyword(keyword, callback){
    $.ajax({
        url:"/bookshelf/api/searchbook?keyword=" + keyword,
        dataType: "json",
        success: function(data){
            var bookList =  $('#book_list');
            bookList.empty();
            $.each(data, function(index, item){
                //$('#dummy_book').clone().attr(item).attr('id', 'book_'+index).css('display', 'block').text(item.title).click(selectBook).hover(hoverBook).appendTo(bookList);
                bookList.append($('<li />', {
                    id: 'book_'+index,
                    text: item.title,
                    class: 'book'
                }));
                $('#book_'+index).attr(item).click(selectBook).hover(hoverBook);
            });
            $('#book_list_wrapper').show();
        }
        //callback(data)
    });
}

function check_form(){
    $('form .field').removeClass('error');
    $('form .ui.message').hide();
    var result = true;
    var message = '';
    if($('#form_book').val().length === 0){
        message += '책을 선택하세요. ';
        result = false;
    };

    if(!result){
        //$('.ui.message .header').text('어딘가 비어있는 폼.');
        $('.ui.message p').text(message);
        $('form .ui.message').addClass('error');
        $('form .ui.message').show();
    }

    $('#form_rating').val($('.rating').starRating('getRating')*2);
    if($('form input[type="checkbox"]').prop('checked'))
        $('form input[name="is_secret"]').val(1);
    else {
        $('form input[name="is_secret"]').val(0);
    }

    return result;
}

//author type translation
var authorTypeTrans = {
    '저자': 'author',
    '역자': 'translator',
    '감수': 'supervisor',
    '그림': 'illustrator',
    '사진': 'photo'
};

var length = readings.length;
var curIndex = 0;
function setReading(index){
    resetBook();
    $('h1').text(index+'/'+length);
    var reading = readings[index];
    $('#btns_add_book input.prompt').val(reading.title);
    $('#form_date_started').val(reading.date_started);
    $('#form_date_finished').val(reading.date_finished);
    $('#btns_add_book input.prompt').focus();
}

$(document).ready(function(){
    $('.remove.icon').parent().click(function(){
        $('.modal').modal('hide');
    });

    $('.ui.modal').modal();
    $('#btn_manual_book').click(
        function() {
            $('.ui.modal').modal('show');
        }
    );

    $('#book_panel').hide();

    $('.ui.search').search({
        apiSettings:{
            url: "/bookshelf/api/searchbook?keyword={query}",
            onResponse: function(res) {
                $.each(res.result, function(index, item){
                   item.desc = item.author + ' | ' + item.publisher + ' | ' + item.published_date;
                });
                return res;
            }
        },
        searchDelay: 1000,
        //source: content,
        onSelect: function(result, response){
            selectBook(result.isbn13);
            $('#form_date_started').focus();
        },
        fields:{
            results: 'result',
            description: 'desc',
            image: 'cover_URL'
        }
    });

    $('.rating').starRating({
        starShape: 'rounded',
        starSize: 25,
        disableAfterRate: false
    });

    $('#mod_btn').click(function(){
        $('form *').removeAttr('readonly');
        $('.rating').starRating('setReadOnly', false);
        $('.ui.buttons').show();
        $(this).hide();
    });

    $('#ok_btn').click(function(){
        if(check_form()){
            $.post({
                url:'/bookshelf/api/reading/add',
                data:{
                    rating: $('#form_rating').val(),
                    book: $('#form_book').val(),
                    date_started: $('#form_date_started').val(),
                    date_finished: $('#form_date_finished').val(),
                    comment: $('#form_comment').val(),
                    is_secret: 0,
                    user: $('#form_user').val(),
                    password: $('#form_password').val()
                },
                success: function(res){
                    if(res.ok == 1){
                        authors=[];
                        setReading(curIndex++);
                    } else
                        console.log(res);
                }
            })
        }else{
            console.log('errorf');
        }
    });

    $('#can_btn').click(function(){
        $('.rating').starRating('setRating', parseInt($('#form_rating').val()) / 2);
        resetBook();
    });

    $('#change_book').click(function(){
        resetBook();
    });

    $('#manual_authors .multiple.selection').dropdown({
        allowAdditions: true,
        action: function(text, value){
            var typeKor = $('#manual_author_type').dropdown('get text');
            var typeEng = authorTypeTrans[typeKor];
            authors.push({name: text, type: typeEng, text:text+'('+typeKor+')'});
            $('#manual_authors .multiple.selection').dropdown('set selected', [text+'('+typeKor+')']);
        },
        onRemove: function(value){
            for(var i = 0; i < authors.length; i++){
                var author = authors[i];
                if(value == author.text){
                    authors.splice(i, 1);
                    return;
                }
            }

        }
    });
    $('#manual_authors input.search').keydown(function(evt){
        switch (evt.which){
            case 38: //up
                var index = $('#manual_author_type').dropdown('get value');
                $('#manual_author_type').dropdown('set selected', parseInt(index) - 1);
                break;
            case 40: //down
                var index = $('#manual_author_type').dropdown('get value');
                $('#manual_author_type').dropdown('set selected', parseInt(index) + 1);
                break;
        }
    });
    $('#manual_author_type').dropdown('set selected', 1);
    curIndex = 414;
    setReading(curIndex++);
});