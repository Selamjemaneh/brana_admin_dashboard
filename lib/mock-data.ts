export interface Commentary {
  _id: string
  author: string
  name: string
  language_code: string
  is_premium: boolean
  created_at: string
  cover_image_url: string | null
}

export interface Dictionary {
  _id: string
  name: string
  language_code: string
  is_premium: boolean
  created_at: string
  cover_image_url: string | null
}

export const mockCommentaries: Commentary[] = [
  {
    _id: '693186efd9e2e90c12e17aaa',
    author: 'ፊሊፕ ኢቭሶን',
    name: 'ፊሊፕ ኢቭሶን Commentary',
    language_code: 'AM',
    is_premium: false,
    created_at: '2025-12-04T13:04:47.302Z',
    cover_image_url: null,
  },
  {
    _id: '693186efd9e2e90c12e17aab',
    author: 'Matthew Henry',
    name: 'Matthew Henry Commentary',
    language_code: 'EN',
    is_premium: true,
    created_at: '2025-11-15T10:30:00.000Z',
    cover_image_url: null,
  },
  {
    _id: '693186efd9e2e90c12e17aac',
    author: 'Albert Barnes',
    name: 'Barnes\' Notes on the Bible',
    language_code: 'EN',
    is_premium: false,
    created_at: '2025-10-20T14:45:30.000Z',
    cover_image_url: null,
  },
  {
    _id: '693186efd9e2e90c12e17aad',
    author: 'Charles Spurgeon',
    name: 'Spurgeon\'s Commentary',
    language_code: 'EN',
    is_premium: true,
    created_at: '2025-09-05T09:15:00.000Z',
    cover_image_url: null,
  },
  {
    _id: '693186efd9e2e90c12e17aae',
    author: 'John Gill',
    name: 'Gill\'s Exposition',
    language_code: 'EN',
    is_premium: false,
    created_at: '2025-08-22T16:20:45.000Z',
    cover_image_url: null,
  },
]

export const mockDictionaries: Dictionary[] = [
  {
    _id: '593186efd9e2e90c12e17aaa',
    name: 'Easton\'s Bible Dictionary',
    language_code: 'EN',
    is_premium: false,
    created_at: '2025-12-01T11:00:00.000Z',
    cover_image_url: null,
  },
  {
    _id: '593186efd9e2e90c12e17aab',
    name: 'Smith\'s Bible Dictionary',
    language_code: 'EN',
    is_premium: true,
    created_at: '2025-11-10T13:30:00.000Z',
    cover_image_url: null,
  },
  {
    _id: '593186efd9e2e90c12e17aac',
    name: 'International Standard Bible Encyclopedia',
    language_code: 'EN',
    is_premium: true,
    created_at: '2025-10-15T08:45:00.000Z',
    cover_image_url: null,
  },
]

export const languageCodes = ['All', 'AM', 'EN', 'ES', 'FR', 'DE', 'IT', 'PT', 'RU', 'ZH']
