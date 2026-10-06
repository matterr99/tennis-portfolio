export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  date: { en: string; es: string };
  location: { en: string; es: string };
  copyright?: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'miami-open',
    src: '/miamiopen.jpg',
    alt: 'Miami Open Stadium Court',
    date: { en: 'March 2026', es: 'Marzo 2026' },
    location: { en: 'Miami, Florida · Hard Rock Stadium', es: 'Miami, Florida · Hard Rock Stadium' },
    copyright: '© Gabriel Vasquez'
  }
];
