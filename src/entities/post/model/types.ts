export type RawPost = Record<string, unknown> & {
  id?: string | number;
  postId?: string | number;
  uuid?: string;
  title?: string;
  content?: string;
  body?: string;
  authorNickname?: string;
  nickname?: string;
  userName?: string;
  userId?: number | string;
  authorId?: number | string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  createDateTime?: string;
  createdAt?: string;
  thumbnail?: string;
};

export interface PostListResponse {
  articles?: RawPost[];
  totalElements?: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

export interface NormalizedPost {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorId: number | string | null;
  categoryId: string | null;
  categoryName: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string | null;
  thumbnail: string | null;
}

export type RawCategory = Record<string, unknown> & {
  id?: string;
  uuid?: string;
  title?: string;
  name?: string;
  order?: number;
  sortOrder?: number;
};

export interface CategoryListResponse {
  categories?: RawCategory[];
}

export interface NormalizedCategory {
  id: string;
  title: string;
  order: number;
}
