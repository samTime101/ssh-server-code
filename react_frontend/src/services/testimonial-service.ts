import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { Testimonial, TestimonialListResponse, TestimonialPayload } from "@/types/testimonial";

const buildFormData = (payload: TestimonialPayload, imageFile?: File | null): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("message", payload.message);
  formData.append("specialization", payload.specialization);
  if (imageFile) formData.append("image", imageFile);
  return formData;
};

export const fetchTestimonials = async (
  page = 1,
  pageSize = 6
): Promise<TestimonialListResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.testimonials, {
    params: { page, page_size: pageSize },
  });
  return response.data as TestimonialListResponse;
};

export const createTestimonial = async (
  payload: TestimonialPayload,
  imageFile?: File | null
): Promise<Testimonial> => {
  const formData = buildFormData(payload, imageFile);
  const response = await axiosInstance.post(API_ENDPOINTS.testimonials, formData);
  return response.data as Testimonial;
};

export const updateTestimonial = async (
  id: string,
  payload: TestimonialPayload,
  imageFile?: File | null
): Promise<Testimonial> => {
  const formData = buildFormData(payload, imageFile);
  const response = await axiosInstance.patch(`${API_ENDPOINTS.testimonials}${id}/`, formData);
  return response.data as Testimonial;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.testimonials}${id}/`);
};
