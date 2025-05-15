import { TimelineEvent } from '@/types/timeline';

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: new Date('1973-04-03'),
    title: 'First Mobile Phone Call',
    description: 'Martin Cooper of Motorola made the first mobile phone call using the DynaTAC prototype, a device weighing 2.4 pounds and measuring 10 inches long.',
    category: ['hardware', 'milestone'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/DynaTAC8000X.jpg/220px-DynaTAC8000X.jpg',
        caption: 'Motorola DynaTAC 8000X, the first commercial portable cellular phone'
      }
    ],
    links: [
      {
        title: 'First Mobile Phone Call',
        url: 'https://en.wikipedia.org/wiki/Martin_Cooper_(inventor)'
      }
    ]
  },
  {
    id: '2',
    date: new Date('1983-03-06'),
    title: 'Motorola DynaTAC 8000X',
    description: 'The first commercial portable cellular phone approved by the FCC. It cost $3,995, weighed 2 pounds, and offered 30 minutes of talk time.',
    category: ['hardware', 'commercial'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/DynaTAC8000X.jpg/220px-DynaTAC8000X.jpg',
        caption: 'Motorola DynaTAC 8000X'
      }
    ]
  },
  {
    id: '3',
    date: new Date('1989-09-01'),
    title: 'Motorola MicroTAC',
    description: 'One of the first truly pocket-sized flip phones, introduced a new era of compact mobile devices.',
    category: ['hardware', 'design'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Motorola_MicroTAC_9800x_01.jpg/220px-Motorola_MicroTAC_9800x_01.jpg',
        caption: 'Motorola MicroTAC'
      }
    ]
  },
  {
    id: '4',
    date: new Date('1992-11-23'),
    title: 'IBM Simon',
    description: 'The first device that could be considered a "smartphone," combining a cell phone, pager, and PDA with a touchscreen interface.',
    category: ['hardware', 'milestone', 'innovation'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/IBM_Simon_Personal_Communicator.png/220px-IBM_Simon_Personal_Communicator.png',
        caption: 'IBM Simon'
      }
    ],
    links: [
      {
        title: 'IBM Simon',
        url: 'https://en.wikipedia.org/wiki/IBM_Simon'
      }
    ]
  },
  {
    id: '5',
    date: new Date('1996-08-01'),
    title: 'Nokia 9000 Communicator',
    description: 'One of the first successful smartphones, featuring a QWERTY keyboard and advanced functionality for its time.',
    category: ['hardware', 'commercial'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Nokia_9000_Communicator_%282007-06-09%29.jpg/220px-Nokia_9000_Communicator_%282007-06-09%29.jpg',
        caption: 'Nokia 9000 Communicator'
      }
    ]
  },
  {
    id: '6',
    date: new Date('1996-03-10'),
    title: 'Palm Pilot',
    description: 'While not a phone, the Palm Pilot PDA established the market for handheld digital devices and influenced future mobile device design.',
    category: ['hardware', 'PDA'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/PalmPilot1000.jpg/220px-PalmPilot1000.jpg',
        caption: 'Palm Pilot 1000'
      }
    ]
  },
  {
    id: '7',
    date: new Date('1999-01-01'),
    title: 'BlackBerry 850',
    description: 'The first BlackBerry device, featuring email capabilities and a QWERTY keyboard that would become iconic.',
    category: ['hardware', 'business'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/RIM_850.jpg/220px-RIM_850.jpg',
        caption: 'BlackBerry 850'
      }
    ]
  },
  {
    id: '8',
    date: new Date('2002-10-01'),
    title: 'Smartphone OS Wars Begin',
    description: 'Symbian, Palm OS, Windows Mobile, and BlackBerry OS competed for dominance in the early smartphone market.',
    category: ['software', 'operating system'],
    importance: 3
  },
  {
    id: '9',
    date: new Date('2007-01-09'),
    title: 'iPhone Introduction',
    description: 'Steve Jobs unveiled the first iPhone, revolutionizing mobile devices with its multi-touch interface, mobile web browser, and app-centric design.',
    category: ['hardware', 'milestone', 'software', 'innovation'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_with_the_Apple_iPhone_in_2007.jpg/220px-Steve_Jobs_with_the_Apple_iPhone_in_2007.jpg',
        caption: 'Steve Jobs introducing the original iPhone'
      }
    ],
    links: [
      {
        title: 'iPhone Introduction',
        url: 'https://www.youtube.com/watch?v=vN4U5FqrOdQ'
      }
    ]
  },
  {
    id: '10',
    date: new Date('2008-07-10'),
    title: 'App Store Launch',
    description: 'Apple launched the App Store, creating a new ecosystem for mobile applications and changing how software is distributed and consumed.',
    category: ['software', 'milestone', 'ecosystem'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Original_iPhone_App_Store.png/220px-Original_iPhone_App_Store.png',
        caption: 'Original iPhone App Store'
      }
    ]
  },
  {
    id: '11',
    date: new Date('2008-09-23'),
    title: 'First Android Phone: T-Mobile G1 / HTC Dream',
    description: 'The first commercial Android smartphone, marking the beginning of the Android ecosystem.',
    category: ['hardware', 'software', 'milestone'],
    importance: 5,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/HTC_Dream_Orange_FR.jpeg/220px-HTC_Dream_Orange_FR.jpeg',
        caption: 'HTC Dream / T-Mobile G1'
      }
    ]
  },
  {
    id: '12',
    date: new Date('2010-04-03'),
    title: 'iPad Release',
    description: 'Apple released the iPad, establishing the modern tablet market and expanding the definition of mobile devices.',
    category: ['hardware', 'tablets'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/IPad.png/220px-IPad.png',
        caption: 'Original iPad'
      }
    ]
  },
  {
    id: '13',
    date: new Date('2011-10-04'),
    title: 'Siri Introduction',
    description: 'Apple introduced Siri with the iPhone 4S, bringing voice assistants to mainstream mobile devices.',
    category: ['software', 'AI'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Apple_Siri_Logo.svg/220px-Apple_Siri_Logo.svg.png',
        caption: 'Siri logo'
      }
    ]
  },
  {
    id: '14',
    date: new Date('2011-01-01'),
    title: '4G LTE Networks Expansion',
    description: 'Widespread deployment of 4G LTE networks began, significantly increasing mobile data speeds and enabling new mobile applications.',
    category: ['network', 'infrastructure'],
    importance: 4
  },
  {
    id: '15',
    date: new Date('2012-09-19'),
    title: 'Fingerprint Authentication',
    description: 'The iPhone 5S introduced Touch ID, bringing fingerprint authentication to mainstream mobile devices.',
    category: ['hardware', 'security'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/IPhone_5S_Touch_ID.png/220px-IPhone_5S_Touch_ID.png',
        caption: 'Touch ID on iPhone 5S'
      }
    ]
  },
  {
    id: '16',
    date: new Date('2015-04-24'),
    title: 'Apple Watch Release',
    description: 'Apple entered the wearable market with the Apple Watch, extending the mobile device ecosystem to the wrist.',
    category: ['hardware', 'wearables'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Apple_Watch.jpg/220px-Apple_Watch.jpg',
        caption: 'First-generation Apple Watch'
      }
    ]
  },
  {
    id: '17',
    date: new Date('2016-10-04'),
    title: 'Google Pixel Launch',
    description: 'Google launched the Pixel line of smartphones, marking a shift to more integrated hardware and software development.',
    category: ['hardware', 'ecosystem'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pixel_XL.png/220px-Google_Pixel_XL.png',
        caption: 'First-generation Google Pixel'
      }
    ]
  },
  {
    id: '18',
    date: new Date('2017-11-03'),
    title: 'Facial Recognition: iPhone X',
    description: 'The iPhone X introduced Face ID, bringing advanced facial recognition to mobile devices.',
    category: ['hardware', 'security', 'innovation'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/220px-IPhone_X_vector.svg.png',
        caption: 'iPhone X'
      }
    ]
  },
  {
    id: '19',
    date: new Date('2019-02-20'),
    title: 'Foldable Phones: Samsung Galaxy Fold',
    description: 'Samsung released the Galaxy Fold, the first widely available foldable smartphone, introducing a new form factor.',
    category: ['hardware', 'innovation', 'design'],
    importance: 4,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Samsung_Galaxy_Fold.png/220px-Samsung_Galaxy_Fold.png',
        caption: 'Samsung Galaxy Fold'
      }
    ]
  },
  {
    id: '20',
    date: new Date('2019-04-03'),
    title: '5G Networks Launch',
    description: 'Commercial 5G networks began rolling out, promising dramatically faster speeds and new possibilities for mobile applications.',
    category: ['network', 'infrastructure', 'milestone'],
    importance: 5
  },
  {
    id: '21',
    date: new Date('2020-10-13'),
    title: 'iPhone 12: MagSafe & 5G',
    description: 'Apple introduced MagSafe for iPhone and 5G capabilities with the iPhone 12 lineup.',
    category: ['hardware', 'innovation'],
    importance: 3,
    media: [
      {
        type: 'image',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/IPhone_12_blue.svg/220px-IPhone_12_blue.svg.png',
        caption: 'iPhone 12'
      }
    ]
  },
  {
    id: '22',
    date: new Date('2022-02-09'),
    title: 'Metaverse Focus',
    description: 'Major tech companies began investing heavily in AR/VR technologies for mobile devices as gateways to the metaverse.',
    category: ['hardware', 'software', 'future'],
    importance: 3
  },
  {
    id: '23',
    date: new Date('2023-01-01'),
    title: 'AI-Powered Mobile Devices',
    description: 'Smartphone manufacturers started integrating dedicated AI processing units for on-device machine learning and AI capabilities.',
    category: ['hardware', 'AI', 'innovation'],
    importance: 4
  },
  {
    id: '24',
    date: new Date('2024-05-01'),
    title: 'Augmented Reality Glasses',
    description: 'Major tech companies released consumer-focused AR glasses that pair with smartphones, expanding mobile computing beyond the traditional screen.',
    category: ['hardware', 'wearables', 'future'],
    importance: 4
  }
];
