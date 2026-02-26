export interface Property {
  id: number;
  title: string;
  type: string;
  price: string;
  location: string;
  description: string;
  image_url: string;
  category: string;
  amenities?: string;
  landmarks?: string;
  status?: 'Ready to Occupy' | 'Under Construction' | 'Upcoming';
  virtual_tour_url?: string;
  floor_plan_url?: string;
  images?: string[];
  specifications?: string;
  builder_name?: string;
  possession_date?: string;
  total_units?: number;
  rera_id?: string;
  coordinates?: { lat: number; lng: number };
  survey_number?: string;
  village_name?: string;
  sqft_rate?: number;
  vastu_score?: number;
  flood_risk?: 'Low' | 'Medium' | 'High';
  smart_city_score?: number;
  khata_type?: 'A-Khata' | 'B-Khata';
  maintenance_index?: 'Standard' | 'Premium' | 'Marine-Grade';
  white_coat_score?: number;
  yield_estimate?: string;
  matterport_url?: string;
  building_age?: number;
  is_shoreline?: boolean;
  monsoon_index?: number;
  crz_status?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedProperties: number[];
}
