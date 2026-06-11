"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      <section className="max-w-4xl mx-auto py-12 px-6 mt-20" id="terms">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance</h2>
      <p className="mb-4">
        By creating an account, accessing, or using Frontier Agency’s website, services, or applications (collectively the "Service"), you agree to these Terms of Service ("Terms") and any future amendments.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Account</strong> – Your registered user profile.</li>
        <li><strong>Content</strong> – Any data, text, graphics, or other material you submit, upload, or generate through the Service.</li>
        <li><strong>Feedback</strong> – Suggestions, ideas, or comments you provide regarding the Service.</li>
        <li><strong>Subscription</strong> – Any paid plan you select for accessing premium features.</li>
        <li><strong>User Data</strong> – Personal information you provide under the Privacy Policy.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Responsibilities</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide accurate, current, and complete information during registration.</li>
        <li>Maintain the confidentiality of your login credentials.</li>
        <li>Notify us immediately of any unauthorized use of your Account.</li>
        <li>Ensure that all Content you post complies with these Terms.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Permitted Use</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Use the Service solely for lawful business or personal purposes.</li>
        <li>Do not reverse‑engineer, decompile, or otherwise attempt to derive the underlying source code.</li>
        <li>Do not transmit viruses, malware, or any malicious code.</li>
        <li>Do not infringe upon intellectual property rights of any third party.</li>
        <li>Do not use the Service to harass, defame, or threaten others.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment & Billing</h2>
      <p className="mb-4">
        Subscriptions are billed in advance on a recurring basis (monthly, quarterly, or annually) per the selected plan. All fees are non‑refundable unless required by law. We reserve the right to modify pricing with 30‑day notice.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
      <p className="mb-4">
        The Service, including all software, designs, trademarks, and documentation, is owned by Frontier Agency or its licensors. You retain ownership of your Content, but you grant us a worldwide, royalty‑free, sublicensable license to host, display, and distribute that Content as part of providing the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. User‑Generated Content</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You are solely responsible for the legality and accuracy of your Content.</li>
        <li>We may remove or disable Content that violates these Terms or any law.</li>
        <li>We reserve the right, without notice, to terminate or suspend any Account that repeatedly breaches this provision.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimer & Limitation of Liability</h2>
      <p className="mb-4">
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON‑INFRINGEMENT. TO THE MAXIMUM EXTENT PERMITTED BY LAW, FRONTIER AGENCY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
      <p className="mb-4">
        You agree to defend, indemnify, and hold harmless Frontier Agency, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys’ fees, arising out of or related to (a) your breach of these Terms; (b) your violation of any law; or (c) your Content or use of the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your Account at any time, with or without cause, for violations of these Terms, illegal activity, or at our sole discretion. Upon termination, your right to access the Service ends, and we may delete your Account and Content, except as required by law.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law & Dispute Resolution</h2>
      <p className="mb-4">
        These Terms are governed by the laws of the State of Florida, United States, without regard to conflict‑of‑law principles. Any dispute arising out of or relating to these Terms shall be resolved by binding arbitration in Miami‑Dade County, Florida, administered by the American Arbitration Association under its Rules.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">12. Modification of Terms</h2>
      <p className="mb-4">
        We may modify these Terms at any time. Notice of material changes will be posted on our website. Your continued use of the Service after such notice constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">13. Entire Agreement</h2>
      <p className="mb-4">
        These Terms, together with our Privacy Policy, constitute the entire agreement between you and Frontier Agency regarding the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">14. Contact</h2>
      <p>
        For any questions concerning these Terms, please contact us at <a href="mailto:support@frontieragency.com" className="text-blue-400 underline">support@frontieragency.com</a>.
      </p>
    </section>
      <Footer />
    </>
  );
}
