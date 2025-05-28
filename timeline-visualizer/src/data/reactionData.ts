import { Reaction, Stakeholder } from '@/types/timeline';

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

export const reactionData: Reaction[] = [
  // 10. iPhone 発表 (2007-01-09)
  {
    id: 'reaction-iphone-unveiled',
    eventId: '10',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '📱',
        shortReaction: 'タッチ操作の未来が来た！',
        detailedReaction: '電話・音楽プレイヤー・インターネットが一体となった革新的デバイスにワクワクが止まらない。キーボード無しで画面を指で触るだけの操作は、まるでSFの世界だ。',
        timestamp: new Date('2007-01-09')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'curious',
        emoticon: '🧑‍💻',
        shortReaction: 'マルチタッチ実装に衝撃',
        detailedReaction: '静電容量式マルチタッチとiOSの滑らかなUIはモバイル設計の常識を覆す。SDK公開が待ち遠しく、開発者コミュニティは熱狂している。',
        timestamp: new Date('2007-01-10')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💹',
        shortReaction: '株価上昇の予感',
        detailedReaction: 'アップルの携帯市場参入で収益源が拡大する可能性が高い。供給網とキャリア提携の行方に注目が集まる。',
        timestamp: new Date('2007-01-11')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '📜',
        shortReaction: '販売モデルの規制検討',
        detailedReaction: '端末とサービスを垂直統合で提供するモデルが競争政策に与える影響を評価する必要がある。',
        timestamp: new Date('2007-01-12')
      }
    ]
  },

  // 11. App Store 開始 (2008-07-10)
  {
    id: 'reaction-app-store-launch',
    eventId: '11',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '🛍️',
        shortReaction: 'アプリ買い放題！',
        detailedReaction: '携帯でゲームも家計簿もダウンロードするだけで手に入るなんて便利すぎる。友達とアプリを共有するのが新しい日課になりそうだ。',
        timestamp: new Date('2008-07-10')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '💡',
        shortReaction: 'モバイル開発元年',
        detailedReaction: '審査付きマーケットと一括配信の仕組みで、個人開発者でも世界中にアプリを提供できる環境が整った。新たなビジネスチャンスが広がる。',
        timestamp: new Date('2008-07-11')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '📈',
        shortReaction: '収益モデルが激変',
        detailedReaction: 'アプリ内課金30%モデルは継続的な手数料収入を確保する強力なエコシステム戦略。プラットフォーム支配力が一段と強まる。',
        timestamp: new Date('2008-07-12')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔎',
        shortReaction: '課税・審査体制を検討',
        detailedReaction: '国境を越えたデジタル流通が急増するため、VATや著作権監視体制をアップデートする必要がある。',
        timestamp: new Date('2008-07-13')
      }
    ]
  },

  // 12. 初の Android 搭載電話 (2008-09-23)
  {
    id: 'reaction-first-android-phone',
    eventId: '12',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'positive',
        emoticon: '🤖',
        shortReaction: '選択肢が増えた！',
        detailedReaction: 'iPhone以外にもタッチ式スマホが登場し、料金プランや端末デザインを自由に選べる時代が来た。',
        timestamp: new Date('2008-09-23')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🔧',
        shortReaction: 'オープンソース万歳',
        detailedReaction: 'Androidのオープン性はカスタムROMや自由なハード設計を可能にし、イノベーションの速度を加速させるだろう。',
        timestamp: new Date('2008-09-24')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'cautious',
        emoticon: '💼',
        shortReaction: '市場競争激化',
        detailedReaction: '複数ベンダーがAndroidを採用すれば市場は急拡大するが、価格競争で利益率が低下するリスクもある。',
        timestamp: new Date('2008-09-25')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'neutral',
        emoticon: '⚖️',
        shortReaction: '標準化と互換性に注目',
        detailedReaction: '多様なデバイスが急増することで、電波利用や端末認証のルールを整理する必要がある。',
        timestamp: new Date('2008-09-26')
      }
    ]
  },

  // 13. iPad がタブレットを主流に (2010-04-03)
  {
    id: 'reaction-ipad-mainstream',
    eventId: '13',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '📖',
        shortReaction: '大画面で動画ざんまい',
        detailedReaction: '寝転びながら映画やネットを楽しめる薄型端末に惹かれる。新聞や雑誌を電子版で読めるのは画期的だ。',
        timestamp: new Date('2010-04-03')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'positive',
        emoticon: '🖥️',
        shortReaction: 'UI拡張の挑戦',
        detailedReaction: '大画面専用UIの設計が新たな課題。開発者は既存アプリの最適化に奔走している。',
        timestamp: new Date('2010-04-04')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💰',
        shortReaction: '新カテゴリー誕生',
        detailedReaction: 'ノートPCとスマホの間に新市場が生まれ、アクセサリやコンテンツ販売も期待できる。',
        timestamp: new Date('2010-04-05')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'interested',
        emoticon: '🏛️',
        shortReaction: '教育利用を検討',
        detailedReaction: '電子教科書や行政手続きのデジタル化に活用できる可能性を調査する方針。',
        timestamp: new Date('2010-04-06')
      }
    ]
  },

  // 14. 4G LTE が普及期へ (2012-09-21)
  {
    id: 'reaction-4g-lte-mainstream',
    eventId: '14',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '⚡',
        shortReaction: '動画がサクサク！',
        detailedReaction: '地下鉄でも高画質動画が止まらずに見られ、ストリーミング音楽も快適。ネットがさらに身近になった。',
        timestamp: new Date('2012-09-21')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'positive',
        emoticon: '🌐',
        shortReaction: 'モバイルクラウド時代へ',
        detailedReaction: '帯域が10倍になり、クラウドストレージやWebアプリのレスポンスが劇的に向上。UX設計が変わる。',
        timestamp: new Date('2012-09-22')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '🏗️',
        shortReaction: 'インフラ投資拡大',
        detailedReaction: '基地局更新と周波数オークションでCAPEXは増えるが、ARPU改善で回収可能との見方。',
        timestamp: new Date('2012-09-23')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '📡',
        shortReaction: '周波数再編と公平性',
        detailedReaction: 'LTE用帯域割当とMVNO接続ルールを策定し、通信品質を確保する必要がある。',
        timestamp: new Date('2012-09-24')
      }
    ]
  },

  // 15. Apple Watch 発表 (2014-09-09)
  {
    id: 'reaction-apple-watch',
    eventId: '15',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '⌚',
        shortReaction: '健康管理が楽しい',
        detailedReaction: '歩数や心拍数が自動で記録され、通知も手元で確認できる。ファッションアイテムとしても話題に。',
        timestamp: new Date('2014-09-09')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '🏃',
        shortReaction: 'ウェアラブルSDKに期待',
        detailedReaction: 'センサーAPIと触覚フィードバックを組み合わせた新しいUXを探る絶好の機会。',
        timestamp: new Date('2014-09-10')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💸',
        shortReaction: '周辺市場拡大',
        detailedReaction: 'バンド、アプリ、ヘルスサービスなど周辺ビジネスが広がり、平均販売単価を押し上げる見通し。',
        timestamp: new Date('2014-09-11')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔒',
        shortReaction: '個人データ保護を強化',
        detailedReaction: 'バイタル情報の収集・送信には厳格なプライバシー指針が欠かせない。',
        timestamp: new Date('2014-09-12')
      }
    ]
  },

  // 16. 初の折りたたみスマートフォン (2019-04-26)
  {
    id: 'reaction-foldable-phone',
    eventId: '16',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'curious',
        emoticon: '📱',
        shortReaction: '画面が折れるなんて！',
        detailedReaction: 'タブレットサイズの画面をポケットに収められるのは魅力的だが、耐久性と価格が気になる。',
        timestamp: new Date('2019-04-26')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'intrigued',
        emoticon: '🪄',
        shortReaction: 'ヒンジ設計に敬礼',
        detailedReaction: '折り曲げ可能なOLEDと複雑なヒンジ構造が量産レベルで実現したのは材料工学の大きな成果。',
        timestamp: new Date('2019-04-27')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'cautious',
        emoticon: '💸',
        shortReaction: '高リスク高リターン',
        detailedReaction: '歩留まりと返品率が収益を左右するが、先行者利益でブランドイメージを高められる可能性も。',
        timestamp: new Date('2019-04-28')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🛡️',
        shortReaction: 'リサイクル課題を注視',
        detailedReaction: '複合材料の再資源化プロセスを整備し、環境負荷を抑える必要がある。',
        timestamp: new Date('2019-04-29')
      }
    ]
  },

  // 17. 5G が大衆市場に浸透 (2020-10-13)
  {
    id: 'reaction-5g-mass-market',
    eventId: '17',
    stakeholders: [
      {
        stakeholder: stakeholders.citizens,
        emotion: 'excited',
        emoticon: '🚀',
        shortReaction: '通信がさらに速い！',
        detailedReaction: '大容量動画のダウンロードが一瞬で終わり、ARゲームも遅延なく楽しめる。',
        timestamp: new Date('2020-10-13')
      },
      {
        stakeholder: stakeholders.techExperts,
        emotion: 'excited',
        emoticon: '⚙️',
        shortReaction: 'エッジAIの実装好機',
        detailedReaction: '5Gの低遅延を活かしリアルタイム処理を端末側で行うアプリ設計が現実的になった。',
        timestamp: new Date('2020-10-14')
      },
      {
        stakeholder: stakeholders.investors,
        emotion: 'positive',
        emoticon: '💷',
        shortReaction: '新ビジネスの地ならし',
        detailedReaction: '5G対応端末とサービス更新需要でサプライチェーン全体が活性化。ARPU上昇も期待できる。',
        timestamp: new Date('2020-10-15')
      },
      {
        stakeholder: stakeholders.government,
        emotion: 'concerned',
        emoticon: '🔒',
        shortReaction: '基地局整備と安全保障',
        detailedReaction: '国産機器の活用やサプライチェーンリスクを踏まえた5Gインフラ整備戦略を策定する必要がある。',
        timestamp: new Date('2020-10-16')
      }
    ]
  }
]
