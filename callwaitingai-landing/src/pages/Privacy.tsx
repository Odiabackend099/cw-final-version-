import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-neutral-lightBg">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary-main hover:text-primary-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-darkText mb-4">Privacy Policy</h1>
          <p className="text-neutral-mediumText">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">1. Introduction</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              CallWaitingAI Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our AI receptionist service (the "Service"). This policy complies with the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR).
            </p>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of our Service.
            </p>
          </section>

          {/* Data Controller */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">2. Data Controller</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              CallWaitingAI Limited is the data controller responsible for your personal data. You can contact us at:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText mt-4 space-y-2">
              <li>Email: odiabackend@gmail.com</li>
              <li>Phone: +1 (276) 582-5329</li>
              <li>Address: [Your registered office address - to be added]</li>
            </ul>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">3. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">3.1 Personal Information You Provide</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, company name, business profile</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Flutterwave (we do not store full card details)</li>
              <li><strong>Communications:</strong> Messages sent through our chat widget, call transcripts, voice recordings</li>
              <li><strong>Support Data:</strong> Information provided when you contact customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">3.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Usage Data:</strong> Call logs, call duration, call status, timestamp, IP address</li>
              <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies (see Section 11)</li>
              <li><strong>Call Data:</strong> Audio recordings, transcripts, call metadata processed through Vapi.ai</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">3.3 Third-Party Data</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We integrate with the following third-party services that process your data:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Supabase:</strong> Database and authentication (EU hosted)</li>
              <li><strong>Vapi.ai:</strong> Voice call orchestration and transcription</li>
              <li><strong>Groq/Llama AI:</strong> Text chat processing</li>
              <li><strong>Minimax:</strong> Text-to-speech voice synthesis (for paid users)</li>
              <li><strong>Flutterwave:</strong> Payment processing</li>
              <li><strong>Vercel:</strong> Hosting infrastructure</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">4. How We Use Your Information</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              We process your personal data under the following legal bases (UK GDPR Article 6):
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.1 Contract Performance (Article 6(1)(b))</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Provide and operate the Service (AI receptionist, call handling)</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send service-related notifications (call logs, lead alerts)</li>
              <li>Provide customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.2 Legitimate Interests (Article 6(1)(f))</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Improve and optimize the Service (analytics, bug fixes)</li>
              <li>Detect and prevent fraud, abuse, or security issues</li>
              <li>Develop new features and services</li>
              <li>Conduct business operations and administration</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.3 Consent (Article 6(1)(a))</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Send marketing emails (only if you opt in)</li>
              <li>Send SMS notifications (only if you opt in)</li>
              <li>Use non-essential cookies (with your consent)</li>
              <li>Process voice cloning for custom voices (paid feature with explicit consent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.4 Legal Obligation (Article 6(1)(c))</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Comply with tax, accounting, and financial reporting requirements</li>
              <li>Respond to lawful requests from authorities</li>
              <li>Maintain records as required by law</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">5. Data Retention</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              We retain your personal data only for as long as necessary:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Call Logs &amp; Transcripts:</strong> Retained for 12 months, then anonymized</li>
              <li><strong>Payment Records:</strong> Retained for 7 years (UK tax law requirement)</li>
              <li><strong>Marketing Consent:</strong> Retained until you withdraw consent</li>
              <li><strong>Deleted Accounts:</strong> Personal data deleted within 30 days (except where legal retention applies)</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              You can request deletion of your data at any time (see Section 8).
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">6. How We Share Your Information</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              We do not sell your personal data. We share data only in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.1 Service Providers</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Third-party vendors who process data on our behalf under data processing agreements:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Supabase (database, authentication) - EU region</li>
              <li>Vapi.ai (voice infrastructure) - US-based, GDPR-compliant</li>
              <li>Groq (AI chat processing)</li>
              <li>Minimax (voice synthesis)</li>
              <li>Flutterwave (payment processing)</li>
              <li>Vercel (hosting)</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.2 Legal Requirements</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We may disclose your data if required by law, court order, or regulatory authority.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.3 Business Transfers</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              If we merge, sell assets, or undergo reorganization, your data may transfer to the new entity (you will be notified).
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">7. International Data Transfers</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              Some of our service providers are located outside the UK/EEA (e.g., Vapi.ai in the US). We ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Standard Contractual Clauses (SCCs) approved by the UK ICO</li>
              <li>Vendor compliance with GDPR/UK GDPR</li>
              <li>Adequacy decisions where applicable</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">8. Your Rights Under UK GDPR</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Access (Article 15)</h4>
                <p className="text-neutral-mediumText">Request a copy of your personal data we hold.</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Rectification (Article 16)</h4>
                <p className="text-neutral-mediumText">Correct inaccurate or incomplete data.</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Erasure (Article 17)</h4>
                <p className="text-neutral-mediumText">Request deletion of your data ("right to be forgotten").</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Restriction (Article 18)</h4>
                <p className="text-neutral-mediumText">Limit how we use your data.</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Data Portability (Article 20)</h4>
                <p className="text-neutral-mediumText">Receive your data in a machine-readable format (available in Settings).</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Object (Article 21)</h4>
                <p className="text-neutral-mediumText">Object to processing based on legitimate interests or for marketing.</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-darkText">Right to Withdraw Consent</h4>
                <p className="text-neutral-mediumText">Withdraw consent for marketing emails/SMS anytime (unsubscribe links provided).</p>
              </div>
            </div>

            <p className="text-neutral-mediumText leading-relaxed mt-6">
              <strong>To exercise your rights:</strong> Email odiabackend@gmail.com with "Data Subject Request" in the subject line. We will respond within 30 days.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">9. Data Security</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
              <li>Role-based access controls (RBAC) and row-level security (RLS)</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure API authentication and rate limiting</li>
              <li>Two-factor authentication (2FA) available for accounts</li>
              <li>Automatic logout after inactivity</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              In the event of a data breach, we will notify you and the UK Information Commissioner's Office (ICO) within 72 hours as required by UK GDPR Article 33.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">10. Children's Privacy</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">11. Cookies and Tracking Technologies</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience. You can manage cookie preferences through our cookie banner.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">Cookie Types:</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality (no consent needed)</li>
              <li><strong>Analytics Cookies:</strong> Measure website usage and performance (consent required)</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences (consent required)</li>
            </ul>

            <p className="text-neutral-mediumText leading-relaxed mt-4">
              We comply with PECR Regulation 6 (consent for non-essential cookies). You can withdraw consent by clearing your browser cookies.
            </p>
          </section>

          {/* Marketing Communications */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">12. Marketing Communications (PECR Compliance)</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              We will only send you marketing emails or SMS messages if you have given explicit consent (PECR Regulation 22). You can:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Opt out at any time using the unsubscribe link in emails</li>
              <li>Reply "STOP" to SMS messages</li>
              <li>Update preferences in your account Settings</li>
              <li>Contact us directly to opt out</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              <strong>Note:</strong> Service-related emails (e.g., call logs, billing, security alerts) are not marketing and cannot be unsubscribed from while your account is active.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">13. Third-Party Links</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices of those sites. Please review their privacy policies before providing any personal data.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Posting the new policy on this page with an updated "Last updated" date</li>
              <li>Sending you an email notification (if you have an account)</li>
              <li>Displaying a prominent notice on our website</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Complaints */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">15. How to Complain</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              If you have concerns about how we handle your personal data, please contact us first. If you remain dissatisfied, you have the right to lodge a complaint with the UK supervisory authority:
            </p>
            <div className="mt-4 p-4 bg-neutral-lightBg border border-neutral-mediumText/20 rounded-lg">
              <p className="text-neutral-mediumText"><strong>Information Commissioner's Office (ICO)</strong></p>
              <p className="text-neutral-mediumText">Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
              <p className="text-neutral-mediumText">Phone: 0303 123 1113</p>
              <p className="text-neutral-mediumText">Website: <a href="https://ico.org.uk" className="text-primary-main hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="border-t border-neutral-mediumText/20 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">16. Contact Us</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="p-4 bg-neutral-lightBg border border-neutral-mediumText/20 rounded-lg space-y-2">
              <p className="text-neutral-mediumText"><strong>CallWaitingAI Limited</strong></p>
              <p className="text-neutral-mediumText">Email: odiabackend@gmail.com</p>
              <p className="text-neutral-mediumText">Phone: +1 (276) 582-5329</p>
              <p className="text-neutral-mediumText">Data Protection Officer: [To be appointed if required]</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
