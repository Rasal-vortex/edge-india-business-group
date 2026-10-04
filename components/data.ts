export interface Member {
  id: string;
  name: string;
  role: string;
  badge: string;
  categories: string[];
  company?: string;
  image: string;
  description: string;
  sector: string;
  fullBio: string;
  keyInitiatives: string[];
  location: string;
  tenure: string;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'events' | 'meetings' | 'community';
  tag: string;
  description: string;
  image: string;
  colSpan?: string;
  rowSpan?: string;
  location?: string;
  participants?: string;
  keyTakeaways: string[];
}

// The images are visual illustrations. The copy describes documented activity
// formats, not photographic records of specific Edge India attendees.
export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'ai-business-automation',
    title: 'AI & Business Automation',
    category: 'events',
    tag: 'Learning & Growth',
    description: 'Learner’s Meetings explore practical ways AI tools can support business workflows, efficiency, and growth.',
    image: '/Cinematic Corporate Networking Reception.png',
    colSpan: 'sm:col-span-2',
    rowSpan: 'sm:row-span-2',
    location: 'Manjeri, Kerala',
    participants: 'Entrepreneurs, professionals, and business leaders',
    keyTakeaways: [
      'The profile records Learner’s Meetings featuring Sainudheen Kaderi, co-founder of Coyot AI.',
      'Sessions focus on practical applications of AI in day-to-day business.',
    ],
  },
  {
    id: 'business-evolution-meetings',
    title: 'Business Evolution Meetings',
    category: 'meetings',
    tag: 'In-person Meetings',
    description: 'In-person gatherings create space for local business connections, shared learning, and collaboration.',
    image: '/Corporate Networking in Blue Light.jpg',
    location: 'Kaizen Hall or Indian Mall, Manjeri',
    participants: 'Local entrepreneurs, professionals, and business leaders',
    keyTakeaways: ['The Manjeri chapter profile identifies these as physical community meetups.'],
  },
  {
    id: 'business-acceleration',
    title: 'Business Acceleration',
    category: 'meetings',
    tag: 'Business Learning',
    description: 'Business Acceleration sessions support practical learning, collaboration, and growth among local businesses.',
    image: '/pexels-silverkblack-36712857.jpg',
    rowSpan: 'sm:row-span-2',
    location: 'Manjeri, Kerala',
    participants: 'Local entrepreneurs, professionals, and business leaders',
    keyTakeaways: ['The profile lists Business Acceleration among the chapter’s in-person meeting formats.'],
  },
  {
    id: 'edge-india-best-meeting',
    title: 'EDGE India Best Meeting',
    category: 'meetings',
    tag: 'Online Meeting',
    description: 'A Google Meet gathering that gives chapter leadership a way to align on the community and its growth.',
    image: '/1.png',
    location: 'Online via Google Meet',
    participants: 'Chapter leadership',
    keyTakeaways: ['The profile identifies Google Meet as the format for this online meeting.'],
  },
  {
    id: 'local-launch-support',
    title: 'Supporting Local Business',
    category: 'community',
    tag: 'Community Support',
    description: 'The community network supports regional ventures, including the stock-launching ceremony for Nashadz E-Commerce.',
    image: '/Corporate Networking in Blue Light.jpg',
    colSpan: 'sm:col-span-2',
    location: 'Manjeri, Kerala',
    participants: 'Local businesses and community members',
    keyTakeaways: ['The profile records community support for the stock-launching ceremony for Nashadz E-Commerce.'],
  },
];

export const BRAND_ASSETS = {
  logo: '/compony-logos/edege-india-logo-png-file.png',
  aboutConference: '/1.png',
};
