import HomeTestimonialCard from "./HomeTestimonialCard";
import { testimonials } from "./testimonials";

export default function HomeTestimonialsSection() {
  return (
    <section
      id="temoignages"
      aria-labelledby="testimonials-heading"
      className="border-b border-gray-100 py-12 sm:py-16 md:py-24"
    >
      <div className="container mx-auto px-0 sm:px-2">
        <div className="mb-10 text-center sm:mb-16">
          <h2
            id="testimonials-heading"
            className="mb-4 text-2xl font-bold text-[#0f172a] sm:text-3xl"
          >
            Témoignages
          </h2>
          <div className="mx-auto h-1 w-20 bg-[#0077d2]" />
          <p className="mx-auto mt-5 max-w-2xl px-1 text-base text-gray-500 sm:text-lg">
            Ce que des étudiants disent de la plateforme.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
          {testimonials.map((testimonial) => (
            <HomeTestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
