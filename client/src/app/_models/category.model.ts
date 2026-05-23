// Matches CategoryDto — tree structure (parent with nested children)
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children: Category[];
}
