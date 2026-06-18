"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <section className="max-w-4xl mx-auto py-12 px-6 mt-20" id="contact">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <p className="mb-6">
        We’d love to hear from you! Whether you have a question about our AI automation services, need technical support, or want to discuss a partnership, feel free to reach out through any of the channels below.
      </p>

      {/* Contact Details */}
      <ul className="list-disc pl-6 space-y-3 mb-8">
        <li>
          <strong>Email (General Inquiries):</strong>{' '}
          <a href="mailto:info@frontieragency.com" className="text-blue-400 underline">
            info@frontieragency.com
          </a>
        </li>
        <li>
          <strong>Support:</strong>{' '}
          <a href="mailto:support@frontieragency.com" className="text-blue-400 underline">
            support@frontieragency.com
          </a>
        </li>
        <li>
          <strong>Phone:</strong>{' '}
          <a href="tel:+19862010858" className="text-blue-400 underline">
            (986) 201–0858
          </a>
        </li>
        <li>
          <strong>Mailing Address:</strong>{' '}Virtual Production (online only)
        </li>
        <li>
          <strong>Social Media:</strong>{' '}
          <a href="https://twitter.com/FrontierAgency" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            Twitter
          </a>,{' '}
          <a href="https://linkedin.com/company/frontier-agency" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
            LinkedIn
          </a>
        </li>
      </ul>

      {/* Simple Contact Form (placeholder) */}
      <div className="bg-[#0a0a0a] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
        <form
          action="#"
          method="POST"
          className="grid gap-4"
          onSubmit={e => { e.preventDefault(); alert('Thank you! Your message has been received.'); }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full p-2 bg-[#111] border border-[#333] text-white placeholder-[#555]"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full p-2 bg-[#111] border border-[#333] text-white placeholder-[#555]"
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            required
            className="w-full p-2 bg-[#111] border border-[#333] text-white placeholder-[#555]"
          />
          <button
            type="submit"
            className="self-start px-6 py-2 bg-[#C5A55A] text-black font-medium hover:bg-[#b1944d] transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
      <Footer />
    </>
  );
}
