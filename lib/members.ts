import type { Member } from '@/components/data';

export interface MemberRow {
  id: string;
  name: string;
  company: string;
  designation: string | null;
  category: string | null;
  bio: string | null;
  image_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function toPublicMember(row: MemberRow): Member {
  const category = row.category?.trim() ?? '';

  return {
    id: row.id,
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
  };
}

export function isMemberPhotoUrl(imageUrl: string | null | undefined) {
  return Boolean(imageUrl?.includes('/storage/v1/object/public/member-photos/'));
}
