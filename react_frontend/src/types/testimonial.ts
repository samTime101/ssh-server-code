export interface Testimonial {
  id: string;
  name: string;
  message: string;
  specialization: string;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export type TestimonialPayload = Omit<
  Testimonial,
  "id" | "image_url" | "created_at" | "updated_at"
>;

export interface TestimonialFormState {
  name: string;
  message: string;
  specialization: string;
}

export interface TestimonialListResponse {
  count: number;
  total_pages: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: Testimonial[];
}
