// Matches ListingCardDto — used in grids / search results
export interface ListingCard {
  id: string;
  title: string;
  price: number;
  city: string;
  status: ListingStatus;
  isNegotiable: boolean;
  createdAt: Date;
  categoryName: string;
  mainImageUrl?: string;
  sellerUsername: string;
}

// Matches ListingDto — full detail view
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  status: ListingStatus;
  isNegotiable: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  categoryId: string;
  mainImageUrl?: string;
  images: ListingImage[];
  seller: Seller;
  isFavoritedByCurrentUser: boolean;
}

export interface ListingImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
  order: number;
}

export interface Seller {
  id: string;
  username: string;
  city?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

export type ListingStatus = 'Active' | 'Sold' | 'Paused';

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  city: string;
  isNegotiable: boolean;
  categoryId: string;
}

export interface UpdateListingRequest {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  isNegotiable?: boolean;
  categoryId?: string;
}

export interface UpdateStatusRequest {
  status: ListingStatus;
}
