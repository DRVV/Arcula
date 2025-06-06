import { NextRequest, NextResponse } from 'next/server';
import { TimelineEvent } from '@/types/timeline';
import { stakeholders } from '@/data/timelineEvents'


// Interface for the API request
interface ChatTimelineRequest {
  query: string;
  conversationId?: string;
}

// Interface for the API response
interface ChatTimelineResponse {
  chat: {
    message: string;
    timestamp: string;
    sender: 'assistant';
  };
  timeline: {
    events: TimelineEvent[];
    append: boolean;
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received chat-timeline request');

    const body: ChatTimelineRequest = await request.json();
    console.log('💬 User query:', body.query);

    // Validate required fields
    if (!body.query || typeof body.query !== 'string') {
      console.error('❌ Missing or invalid query field');
      return NextResponse.json(
        { error: 'Missing or invalid query field' },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Generate mock response based on query
    const response = await generateMockResponse(body.query.trim());

    console.log(`✅ Generated response with ${response.timeline.events.length} timeline events`);

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('❌ Error processing chat-timeline request:', error);

    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Generate mock response based on user query
async function generateMockResponse(query: string): Promise<ChatTimelineResponse> {
  const lowerQuery = query.toLowerCase();

  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  // Determine response based on query content
  if (lowerQuery.includes('space') || lowerQuery.includes('nasa') || lowerQuery.includes('moon') || lowerQuery.includes('mars')) {
    return generateSpaceExplorationResponse(query);
  } else if (lowerQuery.includes('tech') || lowerQuery.includes('computer') || lowerQuery.includes('internet') || lowerQuery.includes('ai')) {
    return generateTechnologyResponse(query);
  } else if (lowerQuery.includes('war') || lowerQuery.includes('battle') || lowerQuery.includes('conflict')) {
    return generateWarHistoryResponse(query);
  } else if (lowerQuery.includes('climate') || lowerQuery.includes('environment') || lowerQuery.includes('earth')) {
    return generateClimateResponse(query);
  } else if (lowerQuery.includes('phone') || lowerQuery.includes('mobile') || lowerQuery.includes('smartphone')) {
    return generateMobilePhoneResponse(query);
  } else if (lowerQuery.includes('music') || lowerQuery.includes('song') || lowerQuery.includes('album')) {
    return generateMusicResponse(query);
  } else {
    return generateGeneralResponse(query);
  }
}

function generateSpaceExplorationResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Space exploration has been one of humanity's greatest adventures! From Sputnik to Mars rovers, we've made incredible progress.",
    "The space race transformed our understanding of the universe and led to countless technological innovations.",
    "Space exploration continues to push the boundaries of human knowledge and capabilities.",
  ];

  const events: TimelineEvent[] = [
    {
      id: `space-${Date.now()}-1`,
      date: new Date('1957-10-04'),
      title: 'Sputnik 1 Launch',
      description: 'The Soviet Union launches Sputnik 1, the first artificial satellite, marking the beginning of the space age.',
      category: ['space-exploration', 'soviet-union', 'technology'],
      importance: 5
    },
    {
      id: `space-${Date.now()}-2`,
      date: new Date('1969-07-20'),
      title: 'Apollo 11 Moon Landing',
      description: 'Neil Armstrong becomes the first human to walk on the Moon, with Buzz Aldrin following shortly after.',
      category: ['space-exploration', 'usa', 'moon'],
      importance: 5
    },
    {
      id: `space-${Date.now()}-3`,
      date: new Date('2021-02-18'),
      title: 'Perseverance Rover Lands on Mars',
      description: 'NASA\'s Perseverance rover successfully lands on Mars, beginning its mission to search for signs of ancient life.',
      category: ['space-exploration', 'mars', 'nasa', 'modern'],
      importance: 4
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateTechnologyResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Technology has revolutionized every aspect of human life. From the invention of the computer to the rise of artificial intelligence!",
    "The digital revolution has transformed how we communicate, work, and live. It's fascinating to see the rapid pace of innovation.",
    "Computing technology has evolved at an incredible pace, following Moore's Law for decades.",
  ];

  const events: TimelineEvent[] = [
    {
      id: `tech-${Date.now()}-1`,
      date: new Date('1975-04-04'),
      title: 'Microsoft Founded',
      description: 'Bill Gates and Paul Allen establish Microsoft, which will become one of the world\'s largest software companies.',
      category: ['technology', 'computing', 'business'],
      importance: 4
    },
    {
      id: `tech-${Date.now()}-2`,
      date: new Date('1989-03-12'),
      title: 'World Wide Web Invented',
      description: 'Tim Berners-Lee proposes the World Wide Web at CERN, revolutionizing information sharing.',
      category: ['technology', 'internet', 'innovation'],
      importance: 5
    },
    {
      id: `tech-${Date.now()}-3`,
      date: new Date('2007-01-09'),
      title: 'iPhone Announcement',
      description: 'Steve Jobs announces the first iPhone, revolutionizing mobile technology and communication.',
      category: ['technology', 'mobile', 'apple'],
      importance: 5
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateWarHistoryResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Military conflicts have shaped world history, often leading to significant social and technological changes.",
    "Wars have unfortunately been a constant throughout human history, but they've also driven innovation and social change.",
    "Understanding military history helps us learn from past conflicts and work toward peaceful solutions.",
  ];

  const events: TimelineEvent[] = [
    {
      id: `war-${Date.now()}-1`,
      date: new Date('1939-09-01'),
      title: 'World War II Begins',
      description: 'Germany invades Poland, marking the beginning of World War II in Europe.',
      category: ['world-war', 'military', 'europe'],
      importance: 5
    },
    {
      id: `war-${Date.now()}-2`,
      date: new Date('1945-08-15'),
      title: 'End of World War II',
      description: 'Japan surrenders following the atomic bombings, ending World War II.',
      category: ['world-war', 'military', 'peace'],
      importance: 5
    },
    {
      id: `war-${Date.now()}-3`,
      date: new Date('1989-11-09'),
      title: 'Fall of Berlin Wall',
      description: 'The Berlin Wall falls, symbolizing the end of the Cold War era.',
      category: ['cold-war', 'germany', 'peace'],
      importance: 4
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateClimateResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Climate change is one of the most pressing challenges of our time. Understanding its history helps us address current issues.",
    "Environmental awareness has grown significantly over the past decades, leading to important policy changes.",
    "The relationship between human activity and climate has become increasingly clear through scientific research.",
  ];

  const events: TimelineEvent[] = [
    {
      id: `climate-${Date.now()}-1`,
      date: new Date('1970-04-22'),
      title: 'First Earth Day',
      description: 'The first Earth Day is celebrated, marking the beginning of the modern environmental movement.',
      category: ['environment', 'activism', 'awareness'],
      importance: 4
    },
    {
      id: `climate-${Date.now()}-2`,
      date: new Date('1997-12-11'),
      title: 'Kyoto Protocol Adopted',
      description: 'The Kyoto Protocol is adopted, establishing international cooperation on climate change.',
      category: ['environment', 'international', 'policy'],
      importance: 4
    },
    {
      id: `climate-${Date.now()}-3`,
      date: new Date('2015-12-12'),
      title: 'Paris Climate Agreement',
      description: 'The Paris Agreement is adopted, setting global targets for reducing greenhouse gas emissions.',
      category: ['environment', 'international', 'modern'],
      importance: 5
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateMobilePhoneResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Mobile phone evolution has been remarkable! From brick phones to smartphones that are more powerful than early computers.",
    "The mobile revolution changed how we communicate and access information. It's amazing how far we've come!",
    "Smartphones have become essential tools that have transformed nearly every aspect of modern life.",
  ];

  const events: TimelineEvent[] = [
    {
      id: "200",
      date: new Date("2027-03-15"),
      title: "ストレッチャブル＆ロールアップスマホ元年",
      description: "弾性OLEDと二軸ヒンジを組み合わせた“FlexRoll One”が発売。手帳サイズから8.9-inchタブレット形状まで連続可変し、画面端まで完全無縁ベゼルを実現した。",
      category: ["device", "formFactor", "display"],
      importance: 4,
      media: [
        {
          type: "image",
          url: "/images/flexroll-one.jpg",
          caption: "FlexRoll One 実機デモ"
        }
      ],
      links: [
        { title: "Stretchable display", url: "https://en.wikipedia.org/wiki/Flexible_display" }
      ],
      reactions: [
        {
          stakeholder: stakeholders.citizens,
          emotion: "excited",
          emoticon: "🪄",
          shortReaction: "鞄いらず！",
          shortDescription: "Pocket-to-tablet magic…",
          detailedReaction: "通勤中は小型、オフィスではタブレット。1台で済むから荷物が減って嬉しい！",
          timestamp: new Date("2027-03-15")
        },
        {
          stakeholder: stakeholders.techExperts,
          emotion: "positive",
          emoticon: "🔩",
          shortReaction: "部品レベルのブレイクスルー",
          shortDescription: "Graphene-polyimide capacitors enable surge-free folding…",
          detailedReaction: "300 μm厚のエラストマー基板上に5 μH相当のメタサーフェスらせんインダクタをスパッタ。2000 F/cm³グラフェン-ポリイミドスーパーキャパシタが急速放電を受け持ち、固体酸化物マイクロバッテリ (650 Wh/L) がエネルギーバッファを担当。曲げ半径2 mmで10 万回の折り曲げに耐えるデュアルスプリットMLCCがようやく量産に乗ったのが決定打。",
          timestamp: new Date("2027-03-16")
        },
        {
          stakeholder: stakeholders.investors,
          emotion: "positive",
          emoticon: "💵",
          shortReaction: "買い替え需要爆発",
          shortDescription: "Whole category refresh cycle…",
          detailedReaction: "可変フォームファクタに合わせたアクセサリ・ケース市場も新規創出。部材サプライヤへの発注量が3倍に。",
          timestamp: new Date("2027-03-17")
        },
        {
          stakeholder: stakeholders.government,
          emotion: "neutral",
          emoticon: "♻️",
          shortReaction: "リサイクル規制を更新",
          shortDescription: "Elastomer–metal laminate disposal rules…",
          detailedReaction: "ストレッチ基板の分離回収が困難なため、E-waste 法を改訂し専用回収スキームを義務化へ。",
          timestamp: new Date("2027-03-18")
        }
      ]
    },
    {
      id: "201",
      date: new Date("2031-06-02"),
      title: "フォトニックCPU搭載『LightPhone X』",
      description: "世界初のオンチップSiNフォトニック演算コアを SoC に統合し、AI推論を光波干渉で実行。消費電力を従来Armコア比で16分の1に抑えつつ、60 TOPSを達成した。",
      category: ["device", "processor", "optics"],
      importance: 5,
      media: [
        {
          type: "image",
          url: "/images/lightphone-x.jpg",
          caption: "LightPhone X 透視CG"
        }
      ],
      links: [
        { title: "Photonic computing", url: "https://en.wikipedia.org/wiki/Optical_computing" }
      ],
      reactions: [
        {
          stakeholder: stakeholders.citizens,
          emotion: "curious",
          emoticon: "🤔",
          shortReaction: "光で動く？",
          shortDescription: "Battery lasts a week…",
          detailedReaction: "丸5日充電いらずで助かるけど、内部で何が起きてるのか想像できない！",
          timestamp: new Date("2031-06-02")
        },
        {
          stakeholder: stakeholders.techExperts,
          emotion: "excited",
          emoticon: "🔬",
          shortReaction: "受動素子が性能を左右",
          shortDescription: "Ga₂O₃ power inductors & SiC nano-capacitors…",
          detailedReaction: "フォトニックI/Oは電気光変換器のチャージポンプが律速。酸化ガリウム(Ga₂O₃)コア3 nHインダクタ＋SiCナノポアキャパシタの1 GHzスイッチング電源でフォトニックリング共振器にノイズ1 mVpp以下を供給。ミラー整列誤差0.1°以下のIntegrated Micro Lensesが歩留まり80%を突破し量産化が現実に。",
          timestamp: new Date("2031-06-03")
        },
        {
          stakeholder: stakeholders.investors,
          emotion: "positive",
          emoticon: "📈",
          shortReaction: "チップサプライ競争激化",
          shortDescription: "Foundries race for SiN lines…",
          detailedReaction: "フォトニック層の追加露光で平均ウェハ粗利が2倍。製造装置メーカーへの発注が殺到。",
          timestamp: new Date("2031-06-04")
        },
        {
          stakeholder: stakeholders.government,
          emotion: "cautious",
          emoticon: "📡",
          shortReaction: "干渉ノイズ規制",
          shortDescription: "Optical EMI standards drafted…",
          detailedReaction: "可視外光リークが医療機器へ与える影響を評価。新たに“Class O”エミッション基準を設置へ。",
          timestamp: new Date("2031-06-05")
        }
      ]
    },
    {
      id: "202",
      date: new Date("2035-09-27"),
      title: "脳波インターフェース一体型『NeuroBand』",
      description: "スマホ本体が細幅ヘッドバンド形状となり、皮膚表面EEG／EMGセンサとARオーバーレイプロジェクタを統合。視線と脳波ジェスチャで操作する“ポケットレス”体験を提供。",
      category: ["device", "neurotech", "wearable"],
      importance: 5,
      media: [
        {
          type: "image",
          url: "/images/NeuroBand.jpg",
          caption: "NeuroBand 装着例"
        }
      ],
      links: [
        { title: "Brain–computer interface", url: "https://en.wikipedia.org/wiki/Brain–computer_interface" }
      ],
      reactions: [
        {
          stakeholder: stakeholders.citizens,
          emotion: "excited",
          emoticon: "🧠",
          shortReaction: "手ぶらでSNS！",
          shortDescription: "Post by thought…",
          detailedReaction: "街中でスマホを取り出さずに支払い完了する未来がついに現実。けど集中してない時に誤送信しないか心配。",
          timestamp: new Date("2035-09-27")
        },
        {
          stakeholder: stakeholders.techExperts,
          emotion: "positive",
          emoticon: "🪙",
          shortReaction: "フレキシブル受動部品が鍵",
          shortDescription: "Graphene spiral inductors & Na-glass micro-caps…",
          detailedReaction: "縫える厚さ20 μmのグラフェン渦巻インダクタ(0.5 μH)が脳波アンプの共振フィルタを実現。ナトリウム-ガラス固体電解質キャパシタ(150 F/cc)がヘッドバンド全周に分散配置され、動きによる電源電圧フリッカを±5 mV内に収める。皮膚伸縮10%でもインピーダンス変化が1%未満に抑えられたのが最大の進歩。",
          timestamp: new Date("2035-09-28")
        },
        {
          stakeholder: stakeholders.investors,
          emotion: "positive",
          emoticon: "🛍️",
          shortReaction: "周辺機器市場に追い風",
          shortDescription: "BCI app ecosystem boom…",
          detailedReaction: "EEGアプリアドオン課金モデルが立ち上がり、脳波データ解析スタートアップへの投資が加熱。",
          timestamp: new Date("2035-09-29")
        },
        {
          stakeholder: stakeholders.government,
          emotion: "concerned",
          emoticon: "👁️",
          shortReaction: "思考プライバシー保護",
          shortDescription: "Neuro-data consent acts…",
          detailedReaction: "“思考データは生体情報”としてGDPR並みの同意要件を新設。未成年使用に保護者PIN義務付け。",
          timestamp: new Date("2035-09-30")
        }
      ]
    },
    {
      id: "203",
      date: new Date("2039-11-11"),
      title: "量子コプロ搭載ウェアラブル『HoloCore Sphere』",
      description: "手首サイズの球体デバイスが立体ホログラムを360°投影し、NVセンターダイヤモンド量子コプロセッサでパーソナルAIを実行。近接センサで空中ジェスチャと音声を融合した操作体系を確立した。",
      category: ["device", "quantum", "display"],
      importance: 4,
      media: [
        {
          type: "image",
          url: "/images/holocore-sphere.jpg",
          caption: "HoloCore Sphere プロトタイプ"
        }
      ],
      links: [
        { title: "Diamond NV quantum computing", url: "https://en.wikipedia.org/wiki/Nitrogen-vacancy_center" }
      ],
      reactions: [
        {
          stakeholder: stakeholders.citizens,
          emotion: "excited",
          emoticon: "🌐",
          shortReaction: "映画の未来が現実！",
          shortDescription: "Star-wars holograms at home…",
          detailedReaction: "腕を上げると友人のミニチュアホログラムが出現。持ち歩けるシアターで感動！",
          timestamp: new Date("2039-11-11")
        },
        {
          stakeholder: stakeholders.techExperts,
          emotion: "excited",
          emoticon: "⚙️",
          shortReaction: "受動素子が臨界寸法へ",
          shortDescription: "Diamond-thin capacitors & HTS micro-inductors…",
          detailedReaction: "量子温度域77 Kを維持するため、高温超伝導YBCO薄膜インダクタ(10 nH)を球状サブストレートに堆積。ダイヤモンド薄膜キャパシタ (耐圧100 V, 500 nF) が熱サイクル1 M回に耐久。冷却損失を抑えるため誘電正接 <1e-5 が必須条件となり、従来MLCCは排除された。",
          timestamp: new Date("2039-11-12")
        },
        {
          stakeholder: stakeholders.investors,
          emotion: "positive",
          emoticon: "🚀",
          shortReaction: "量子IP×民生の夜明け",
          shortDescription: "Consumer-grade quantum edge…",
          detailedReaction: "ダイヤモンド育成ラインの設備投資が加速。専門ファウンドリ設立ラッシュで株価高騰。",
          timestamp: new Date("2039-11-13")
        },
        {
          stakeholder: stakeholders.government,
          emotion: "concerned",
          emoticon: "🛰️",
          shortReaction: "輸出管理を強化",
          shortDescription: "Quantum hardware dual-use…",
          detailedReaction: "NV量子コアが軍事暗号解読に転用される懸念から、Wassenaarリストに新カテゴリ追加検討。",
          timestamp: new Date("2039-11-14")
        }
      ]
    }
  ];




  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateMusicResponse(query: string): ChatTimelineResponse {
  const responses = [
    "Music has evolved tremendously over the centuries! From classical compositions to digital streaming, it's been quite a journey.",
    "The music industry has been transformed by technology multiple times - from vinyl to digital downloads to streaming.",
    "Music reflects cultural changes and has been a powerful force for social movements throughout history.",
  ];

  const events: TimelineEvent[] = [
    {
      id: `music-${Date.now()}-1`,
      date: new Date('1877-12-06'),
      title: 'Phonograph Invented',
      description: 'Thomas Edison invents the phonograph, the first device to record and reproduce sound.',
      category: ['music-technology', 'invention', 'sound'],
      importance: 4
    },
    {
      id: `music-${Date.now()}-2`,
      date: new Date('1981-08-01'),
      title: 'MTV Launches',
      description: 'MTV begins broadcasting, revolutionizing music promotion and popular culture.',
      category: ['music', 'television', 'culture'],
      importance: 4
    },
    {
      id: `music-${Date.now()}-3`,
      date: new Date('2001-10-23'),
      title: 'iPod Launch',
      description: 'Apple launches the iPod, transforming how people listen to and purchase music.',
      category: ['music-technology', 'digital', 'apple'],
      importance: 4
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}

function generateGeneralResponse(query: string): ChatTimelineResponse {
  const responses = [
    "That's an interesting topic! History has many fascinating connections and patterns.",
    "Thanks for your question! Let me share some related historical insights.",
    "History is full of surprising connections. Here are some events that might interest you!",
    "Great question! Historical events often have far-reaching impacts we don't immediately see.",
  ];

  const currentYear = new Date().getFullYear();
  const events: TimelineEvent[] = [
    {
      id: `general-${Date.now()}-1`,
      date: new Date(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`),
      title: `User Query: ${query.length > 30 ? query.substring(0, 30) + '...' : query}`,
      description: `User asked: "${query}"\n\nThis query was processed on ${new Date().toLocaleDateString()} and generated relevant timeline content.`,
      category: ['user-interaction', 'query', 'chat-history'],
      importance: 2
    }
  ];

  return {
    chat: {
      message: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      sender: 'assistant'
    },
    timeline: {
      events,
      append: true
    }
  };
}
