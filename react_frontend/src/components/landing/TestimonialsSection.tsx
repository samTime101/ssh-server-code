import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { getImageUrl } from "@/config/apiConfig";
import { fetchTestimonials } from "@/services/testimonial-service";
import type { Testimonial } from "@/types/testimonial";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTestimonials(1, 6);
        if (!cancelled) setTestimonials(data.results);
      } catch {
        if (!cancelled) setTestimonials([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadTestimonials();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-100">What students say</h2>
        <p className="mt-2 text-slate-400">Real feedback from the Vaidix community.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="qbank-card animate-pulse p-6">
              <div className="h-4 w-3/4 rounded bg-slate-700" />
              <div className="mt-4 h-3 w-full rounded bg-slate-700" />
              <div className="mt-2 h-3 w-5/6 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="qbank-card flex flex-col p-6">
              <Quote className="mb-4 h-6 w-6 text-slate-500" />
              <p className="flex-1 text-[15px] leading-relaxed text-slate-300">
                {testimonial.message}
              </p>
              <div className="mt-6 flex items-center gap-3">
                {testimonial.image_url ? (
                  <img
                    src={getImageUrl(testimonial.image_url)}
                    alt={testimonial.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-300">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-100">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.specialization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
