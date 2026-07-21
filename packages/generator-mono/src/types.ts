export interface BlogSite {
  title: string;
  description: string;
}

export interface BlogBasics {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Array<{
    network: string;
    username: string;
    url?: string;
  }>;
}

export interface BlogPost {
  title: string;
  description?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: string;
  slug?: string;
  tags?: string[];
  categories?: string[];
  type?: 'ai' | 'human';
}

export interface PageGridItem {
  title: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  image?: string;
  featured?: boolean;
  date?: string;
  tags?: string[];
}

export interface BlogPage {
  title: string;
  description?: string;
  source?: string;              // Load content from file
  createdAt?: string;
  updatedAt?: string;
  content?: string;
  slug?: string;
  layout?: 'default' | 'grid';  // Page layout type
  items?: PageGridItem[];        // For grid layouts (videos, projects, etc.)
  itemsSource?: string;          // Load items from external JSON file
}

export interface Blog {
  site: BlogSite;
  basics: BlogBasics;
  posts: BlogPost[];
  pages?: BlogPage[];
  meta?: {
    canonical?: string;
    version?: string;
    lastModified?: string;
  };
  settings?: {
    postsPerPage?: number;
  };
}

export interface GeneratedFile {
  name: string;
  content: string;
}
