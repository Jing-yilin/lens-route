export interface Location {
    lat: number;
    lng: number;
    name?: string;
  }
  
  export interface Photo {
    file: string;
    title: string;
    description?: string;
    location?: Location;
  }
  
  export interface PhotoPost {
    slug: string;
    title: string;
    date: string;
    coverImage?: string;
    location?: Location;
    camera?: string;
    tags?: string[];
    photos: Photo[];
    content?: string;
  }