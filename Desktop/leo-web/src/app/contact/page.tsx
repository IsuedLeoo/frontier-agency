"use client";

export default function Contact() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-6" id="contact">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">We’d love to hear from you! Reach out via any of the methods below.</p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Email:</strong> <a href="mailto:info@frontieragency.com" className="text-blue-400 underline">info@frontieragency.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+17867439361" className="text-blue-400 underline">(786) 743-9361</a></li>
        <li><strong>Address:</strong> 123 Innovation Drive, Miami, FL 33101, USA</li>
      </ul>
      <p className="mb-4">For partnership inquiries, media requests, or support, please use the appropriate channel above.</p>
    </section>
  );
}
