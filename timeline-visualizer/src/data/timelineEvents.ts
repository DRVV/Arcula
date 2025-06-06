import { TimelineEvent, Stakeholder } from '@/types/timeline';

// Define common stakeholders
export const stakeholders: Record<string, Stakeholder> = {
  citizens: {
    id: 'citizens',
    name: 'General Public',
    type: 'citizen',
    icon: '👥'
  },
  techExperts: {
    id: 'tech-experts',
    name: 'Tech Experts',
    type: 'expert',
    icon: '🤓'
  },
  investors: {
    id: 'investors',
    name: 'Stock Market',
    type: 'market',
    icon: '📈'
  },
  media: {
    id: 'media',
    name: 'Tech Media',
    type: 'media',
    icon: '📰'
  },
  competitors: {
    id: 'competitors',
    name: 'Competitors',
    type: 'competitor',
    icon: '🏢'
  },
  government: {
    id: 'government',
    name: 'Regulators',
    type: 'government',
    icon: '🏛️'
  }
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: '10',
    date: new Date('2007-01-09'),
    title: 'iPhone発表',
    description: '2007年のMacworldでスティーブ・ジョブズがマルチタッチ搭載の「3-in-1」デバイスである初代iPhoneを披露し、スマートフォンの常識を塗り替えた。',
    category: ['hardware', 'smartphone', 'milestone'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: '/images/iphone-2007.jpg',
        caption: 'First-generation iPhone (2007)'
      }
    ],
    links: [
      { title: 'iPhone (1st generation)', url: 'https://en.wikipedia.org/wiki/IPhone_(1st_generation)' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '📱',
        shortReaction: 'タッチ操作の未来が来た！',
        shortDescription: 'タッチベーススマホ革命の始まり...',
        detailedReaction: '電話・音楽プレイヤー・インターネットが一体となった革新的デバイスにワクワクが止まらない。キーボード無しで画面を指で触るだけの操作は、まるでSFの世界だ。',
        timestamp: new Date('2007-01-09')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🧑‍💻',
        shortReaction: 'マルチタッチ実装に衝撃',
        shortDescription: '静電容量式マルチタッチが全てを変える...',
        detailedReaction: '静電容量式マルチタッチとiOSの滑らかなUIはモバイル設計の常識を覆す。ARM11プロセッサ + PowerVR GPU、カスタムOSX、WebKit搭載ブラウザ。SDK公開が待ち遠しく、開発者コミュニティは熱狂している。',
        timestamp: new Date('2007-01-10')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💹',
        shortReaction: '株価上昇の予感',
        shortDescription: 'モバイル市場拡大の機会...',
        detailedReaction: 'アップルの携帯市場参入で収益源が拡大する可能性が高い。供給網とキャリア提携の行方に注目が集まる。',
        timestamp: new Date('2007-01-11')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '📜',
        shortReaction: '販売モデルの規制検討',
        shortDescription: '垂直統合モデルが懸念を喚起...',
        detailedReaction: '端末とサービスを垂直統合で提供するモデルが競争政策に与える影響を評価する必要がある。',
        timestamp: new Date('2007-01-12')
      }
    ]
  },

  {
    id: '11',
    date: new Date('2008-07-10'),
    title: 'App Store開始',
    description: 'アップルは500本のアプリとともにApp Storeを開設し、モバイルプラットフォームのビジネスモデルを決定づけるワンストップのソフトウェア市場を創出した。',
    category: ['software', 'ecosystem'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: '/images/app-store.jpg',
        caption: 'iOS App Store'
      }
    ],
    links: [
      { title: 'App Store (Apple)', url: 'https://en.wikipedia.org/wiki/App_Store_(Apple)' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '🛍️',
        shortReaction: 'アプリ買い放題！',
        shortDescription: 'ワンストップアプリマーケット革命開始...',
        detailedReaction: '携帯でゲームも家計簿もダウンロードするだけで手に入るなんて便利すぎる。友達とアプリを共有するのが新しい日課になりそうだ。',
        timestamp: new Date('2008-07-10')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '💡',
        shortReaction: 'デジタル流通革命',
        shortDescription: 'デジタル配信プラットフォームが開発を変革...',
        detailedReaction: 'Code signing、Sandboxing、iTunes決済システム統合。審査付きマーケットと一括配信の仕組みで、個人開発者でも世界中にアプリを提供できる。DRMとOTA更新の組み合わせが新たなビジネスモデルを可能にする。',
        timestamp: new Date('2008-07-11')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '📈',
        shortReaction: '収益モデルが激変',
        shortDescription: '30%プラットフォーム収益モデルが登場...',
        detailedReaction: 'アプリ内課金30%モデルは継続的な手数料収入を確保する強力なエコシステム戦略。プラットフォーム支配力が一段と強まる。',
        timestamp: new Date('2008-07-12')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔎',
        shortReaction: '課税・審査体制を検討',
        shortDescription: 'デジタル課税と監視の課題が浮上...',
        detailedReaction: '国境を越えたデジタル流通が急増するため、VATや著作権監視体制をアップデートする必要がある。',
        timestamp: new Date('2008-07-13')
      }
    ]
  },

  {
    id: '12',
    date: new Date('2008-09-23'),
    title: '初のAndroid搭載電話',
    description: 'HTC Dream（T-Mobile G1として販売）はGoogleのオープンソースAndroid OSを搭載した初の市販端末となり、iOSとの二頭立て競争の幕を開けた。',
    category: ['hardware', 'smartphone', 'open_source'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: '/images/htc-dream-android.jpg',
        caption: 'HTC Dream / T-Mobile G1 with Android'
      }
    ],
    links: [
      { title: 'HTC Dream', url: 'https://en.wikipedia.org/wiki/HTC_Dream' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'positive',
        emoticon: '🤖',
        shortReaction: '選択肢が増えた！',
        shortDescription: 'ついにスマホの選択肢が拡大...',
        detailedReaction: 'iPhone以外にもタッチ式スマホが登場し、料金プランや端末デザインを自由に選べる時代が来た。',
        timestamp: new Date('2008-09-23')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🔧',
        shortReaction: 'オープンソース万歳',
        shortDescription: 'オープンソースモバイルが開発を革命化...',
        detailedReaction: 'Linux kernel + Java ベースDalvik VM、Apache/GPLライセンス。Androidのオープン性はカスタムROM開発、ハードウェア多様化、フラグメンテーション課題を同時にもたらす。WebKit、SQLite、OpenGL ES統合でWeb標準準拠を実現。',
        timestamp: new Date('2008-09-24')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'cautious',
        emoticon: '💼',
        shortReaction: '市場競争激化',
        shortDescription: '競争激化がマージンに影響...',
        detailedReaction: '複数ベンダーがAndroidを採用すれば市場は急拡大するが、価格競争で利益率が低下するリスクもある。',
        timestamp: new Date('2008-09-25')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'neutral',
        emoticon: '⚖️',
        shortReaction: '標準化と互換性に注目',
        shortDescription: '標準化と互換性の検討課題...',
        detailedReaction: '多様なデバイスが急増することで、電波利用や端末認証のルールを整理する必要がある。',
        timestamp: new Date('2008-09-26')
      }
    ]
  },

  {
    id: '13',
    date: new Date('2010-04-03'),
    title: 'iPadがタブレットを主流に',
    description: 'アップルの初代iPadはiPhone OSを9.7インチ画面に最適化し、モバイルコンピューティングとメディア消費の新時代を切り開いた。',
    category: ['hardware', 'tablet'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: '/images/ipad-first-gen.jpg',
        caption: 'First-generation iPad'
      }
    ],
    links: [
      { title: 'iPad (1st generation)', url: 'https://en.wikipedia.org/wiki/IPad_(1st_generation)' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '📖',
        shortReaction: '大画面で動画ざんまい',
        shortDescription: '大画面モバイルエンターテインメント体験...',
        detailedReaction: '寝転びながら映画やネットを楽しめる薄型端末に惹かれる。新聞や雑誌を電子版で読めるのは画期的だ。',
        timestamp: new Date('2010-04-03')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'positive',
        emoticon: '🖥️',
        shortReaction: 'SoCとUI拡張の技術革新',
        shortDescription: 'カスタムSoCとUI拡張の技術革新...',
        detailedReaction: 'A4 SoC（Apple初の独自チップ）、IPS液晶、大容量バッテリー管理技術。iOS UI Kitのスケーリング、Split View概念の原型。大画面専用UIの設計パターンとレスポンシブデザインが新たな課題。',
        timestamp: new Date('2010-04-04')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💰',
        shortReaction: '新カテゴリー誕生',
        shortDescription: '新たなタブレット市場カテゴリーが誕生...',
        detailedReaction: 'ノートPCとスマホの間に新市場が生まれ、アクセサリやコンテンツ販売も期待できる。',
        timestamp: new Date('2010-04-05')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'interested',
        emoticon: '🏛️',
        shortReaction: '教育利用を検討',
        shortDescription: '教育とデジタルガバナンスの可能性...',
        detailedReaction: '電子教科書や行政手続きのデジタル化に活用できる可能性を調査する方針。',
        timestamp: new Date('2010-04-06')
      }
    ]
  },

  {
    id: '14',
    date: new Date('2012-09-21'),
    title: '4G LTEが普及期へ',
    description: 'AppleのiPhone 5やSamsungのGalaxy S IIIなどがLTE無線を搭載して出荷され、本格的なモバイルブロードバンドが当たり前となった。',
    category: ['network', 'hardware', 'standard'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: '/images/iphone-5-lte.jpg',
        caption: 'iPhone 5 Apple first LTE handset'
      }
    ],
    links: [
      { title: 'LTE', url: 'https://en.wikipedia.org/wiki/LTE_(telecommunication)' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '⚡',
        shortReaction: '動画がサクサク！',
        shortDescription: 'ついに高速モバイルインターネットが到来...',
        detailedReaction: '地下鉄でも高画質動画が止まらずに見られ、ストリーミング音楽も快適。ネットがさらに身近になった。',
        timestamp: new Date('2012-09-21')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'positive',
        emoticon: '🌐',
        shortReaction: 'OFDMA技術の実用化',
        shortDescription: 'OFDMA技術がモバイル帯域を革命化...',
        detailedReaction: 'OFDMA + MIMO、All-IP Architecture、EPC（Evolved Packet Core）によるパケット最適化。帯域効率が3Gの10倍向上し、クラウドストレージやWebアプリのレスポンスが劇的改善。キャリアアグリゲーションで更なる高速化の道筋も見える。',
        timestamp: new Date('2012-09-22')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '🏗️',
        shortReaction: 'インフラ投資拡大',
        shortDescription: 'インフラ投資急増が予想される...',
        detailedReaction: '基地局更新と周波数オークションでCAPEXは増えるが、ARPU改善で回収可能との見方。',
        timestamp: new Date('2012-09-23')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '📡',
        shortReaction: '周波数再編と公平性',
        shortDescription: '周波数割当と公平性の懸念...',
        detailedReaction: 'LTE用帯域割当とMVNO接続ルールを策定し、通信品質を確保する必要がある。',
        timestamp: new Date('2012-09-24')
      }
    ]
  },

  {
    id: '15',
    date: new Date('2014-09-09'),
    title: 'Apple Watch発表',
    description: 'ティム・クックがApple Watchを披露し、手首をモバイルアプリとヘルストラッキングのプラットフォームに変え、スマートウェアラブルのブームを巻き起こした。',
    category: ['hardware', 'wearable'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: '/images/apple-watch.jpg',
        caption: 'Original Apple Watch (2015 model pictured)'
      }
    ],
    links: [
      { title: 'Apple Watch', url: 'https://en.wikipedia.org/wiki/Apple_Watch' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '⌚',
        shortReaction: '健康管理が楽しい',
        shortDescription: 'ウェアラブル健康追跡革命が開始...',
        detailedReaction: '歩数や心拍数が自動で記録され、通知も手元で確認できる。ファッションアイテムとしても話題に。',
        timestamp: new Date('2014-09-09')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🏃',
        shortReaction: 'ウェアラブル技術の集大成',
        shortDescription: 'ウェアラブル技術が新たな洗練度に到達...',
        detailedReaction: 'S1 SiP（System in Package）、Taptic Engine、Digital Crown、心拍センサー統合。低電力Bluetooth LE、HealthKit連携、Force Touch技術。ウェアラブルSDKとCore Animation最適化で、小画面向けUXパラダイムを確立。',
        timestamp: new Date('2014-09-10')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💸',
        shortReaction: '周辺市場拡大',
        shortDescription: 'アクセサリとサービス市場の拡大...',
        detailedReaction: 'バンド、アプリ、ヘルスサービスなど周辺ビジネスが広がり、平均販売単価を押し上げる見通し。',
        timestamp: new Date('2014-09-11')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔒',
        shortReaction: '個人データ保護を強化',
        shortDescription: 'バイオメトリクスデータプライバシー懸念が浮上...',
        detailedReaction: 'バイタル情報の収集・送信には厳格なプライバシー指針が欠かせない。',
        timestamp: new Date('2014-09-12')
      }
    ]
  },

  {
    id: '16',
    date: new Date('2019-04-26'),
    title: '初の折りたたみスマートフォン',
    description: 'SamsungのGalaxy Foldが（短い延期を経て）市販され、フレキシブルOLEDスクリーンが日常使用に耐えることを証明し、折りたたみ端末への業界トレンドを生んだ。',
    category: ['hardware', 'design', 'innovation'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: '/images/galaxy-fold.jpg',
        caption: 'Samsung Galaxy Fold unfolded'
      }
    ],
    links: [
      { title: 'Samsung Galaxy Fold', url: 'https://en.wikipedia.org/wiki/Samsung_Galaxy_Fold' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '📱',
        shortReaction: '画面が折れるなんて！',
        shortDescription: '折りたたみスクリーン技術が消費者を驚嘆...',
        detailedReaction: 'タブレットサイズの画面をポケットに収められるのは魅力的だが、耐久性と価格が気になる。',
        timestamp: new Date('2019-04-26')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🪄',
        shortReaction: 'フレキシブル素材工学の勝利',
        shortDescription: 'フレキシブル素材工学の突破口を達成...',
        detailedReaction: '超薄型ガラス（UTG）、ポリイミド基板、複雑なヒンジ機構、App Continuity技術。フレキシブルOLED製造プロセス、折り曲げ耐久性テスト、マルチスクリーンUI設計。材料科学とソフトウェア工学の高度な融合が量産レベルで実現。',
        timestamp: new Date('2019-04-27')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'cautious',
        emoticon: '💸',
        shortReaction: '高リスク高リターン',
        shortDescription: '不確実なリターンを伴うハイリスクイノベーション...',
        detailedReaction: '歩留まりと返品率が収益を左右するが、先行者利益でブランドイメージを高められる可能性も。',
        timestamp: new Date('2019-04-28')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🛡️',
        shortReaction: 'リサイクル課題を注視',
        shortDescription: '複雑な素材リサイクル課題が出現...',
        detailedReaction: '複合材料の再資源化プロセスを整備し、環境負荷を抑える必要がある。',
        timestamp: new Date('2019-04-29')
      }
    ]
  },

  {
    id: '17',
    date: new Date('2020-10-13'),
    title: '5Gが大衆市場に浸透',
    description: 'AppleのiPhone 12シリーズ（および同時期のAndroidフラッグシップ）が世界的な5G対応で出荷され、次世代モバイルブロードバンドが新たな基準となった。',
    category: ['network', 'smartphone'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: '/images/iphone-12-5g.jpg',
        caption: 'iPhone 12 on retail display'
      }
    ],
    links: [
      { title: '5G', url: 'https://en.wikipedia.org/wiki/5G' }
    ],
    reactions: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '🚀',
        shortReaction: '通信がさらに速い！',
        shortDescription: '次世代モバイル速度がついに到来...',
        detailedReaction: '大容量動画のダウンロードが一瞬で終わり、ARゲームも遅延なく楽しめる。',
        timestamp: new Date('2020-10-13')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '⚙️',
        shortReaction: 'mmWave + Sub-6技術統合',
        shortDescription: 'mmWaveとSub-6技術統合の突破口...',
        detailedReaction: 'mmWave（24-100GHz）、Sub-6GHz、Massive MIMO、ビームフォーミング、Network Slicing。5G NR（New Radio）規格、Ultra-Reliable Low Latency通信、エッジコンピューティング統合。リアルタイムAI処理、AR/VR、自動運転の基盤技術が整備完了。',
        timestamp: new Date('2020-10-14')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💷',
        shortReaction: '新ビジネスの地ならし',
        shortDescription: '新たなビジネス機会が出現...',
        detailedReaction: '5G対応端末とサービス更新需要でサプライチェーン全体が活性化。ARPU上昇も期待できる。',
        timestamp: new Date('2020-10-15')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔒',
        shortReaction: '基地局整備と安全保障',
        shortDescription: 'インフラセキュリティ考慮事項が浮上...',
        detailedReaction: '国産機器の活用やサプライチェーンリスクを踏まえた5Gインフラ整備戦略を策定する必要がある。',
        timestamp: new Date('2020-10-16')
      }
    ]
  }
];
