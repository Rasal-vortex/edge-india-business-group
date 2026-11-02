import type { Member } from '@/components/data';

export interface MemberRow {
  id: string;
  username: string;
  name: string;
  company: string;
  designation: string | null;
  category: string | null;
  bio: string | null;
  image_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  company_logo_url: string | null;
  personal_instagram_url: string | null;
  company_instagram_url: string | null;
  office_phone: string | null;
  map_url: string | null;
  is_active: boolean;
  display_order: number;
  priority: 'high' | 'medium' | 'low';
  level: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function sortMembersByPriorityAndPin<T extends Pick<MemberRow, 'priority' | 'is_pinned' | 'created_at'>>(members: T[]) {
  const priorityRank = { high: 0, medium: 1, low: 2 } as const;
  return [...members].sort((a, b) =>
    priorityRank[a.priority] - priorityRank[b.priority] ||
    Number(b.is_pinned) - Number(a.is_pinned) ||
    Date.parse(b.created_at) - Date.parse(a.created_at),
  );
}

export function slugifyMemberName(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'member';
}

export function toPublicMember(row: MemberRow): Member {
  const category = row.category?.trim() ?? '';

  return {
    id: row.id,
    username: row.username || slugifyMemberName(row.name),
    name: row.name,
    role: row.designation || 'Member',
    badge: category || 'MEMBER',
    categories: category ? [category] : [],
    company: row.company,
    image: row.image_url || '',
    description: row.bio || '',
    sector: '',
    fullBio: row.bio || '',
    keyInitiatives: [],
    location: '',
    tenure: '',
    website: row.website,
    email: row.email,
    phone: row.phone,
    companyLogo: row.company_logo_url,
    personalInstagram: row.personal_instagram_url,
    companyInstagram: row.company_instagram_url,
    officePhone: row.office_phone,
    mapUrl: row.map_url,
    priority: row.priority,
    level: row.level,
    isPinned: row.is_pinned,
  };
}

export function isMemberPhotoUrl(imageUrl: string | null | undefined) {
  return Boolean(imageUrl?.includes('/storage/v1/object/public/member-photos/'));
}
