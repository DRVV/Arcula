import { TimelineEvent } from '@/types/timeline';

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
        caption: 'iPhone 5—Apple’s first LTE handset'
      }
    ],
    links: [
      { title: 'LTE', url: 'https://en.wikipedia.org/wiki/LTE_(telecommunication)' }
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
    ]
  }
]
