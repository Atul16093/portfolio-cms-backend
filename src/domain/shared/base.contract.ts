export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseCreateInput {
  [key: string]: any;
}

export interface BaseUpdateInput {
  [key: string]: any;
}

export interface BaseQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

