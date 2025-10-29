import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
          <h1 className="text-4xl font-bold text-neutral-darkText mb-4">Terms of Service</h1>
          <p className="text-neutral-mediumText">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">

          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">1. Agreement to Terms</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," or "Customer") and CallWaitingAI Limited ("CallWaitingAI," "we," "our," or "us") governing your use of the CallWaitingAI service, website, and related applications (collectively, the "Service").
            </p>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">2. Service Description</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              CallWaitingAI provides an AI-powered receptionist service that handles incoming calls, captures leads, and manages customer interactions on behalf of businesses. The Service includes:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Voice call answering and routing via AI assistant</li>
              <li>Text chat functionality for website visitors</li>
              <li>Lead capture and management dashboard</li>
              <li>Call logs, transcripts, and recordings</li>
              <li>Integration with third-party services (as described)</li>
              <li>Custom agent configuration and voice selection</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">3. Eligibility</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              To use the Service, you must:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding contract</li>
              <li>Represent a legitimate business or organization</li>
              <li>Provide accurate and complete registration information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">4. Account Registration and Security</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.1 Account Creation</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              You must create an account to use the Service. You agree to:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">4.2 Account Termination</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
            </p>
          </section>

          {/* Subscription Plans and Pricing */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">5. Subscription Plans and Pricing</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">5.1 Free Trial</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>New users receive 50 free call minutes upon signup</li>
              <li>Credit card required for trial activation (no charge during trial)</li>
              <li>Unused trial minutes expire after 30 days</li>
              <li>Trial is limited to one per person/business</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">5.2 Paid Plans</h3>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              Subscription plans are billed monthly in advance:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Starter:</strong> $49/month - 500 call minutes</li>
              <li><strong>Professional:</strong> $80/month - 1,500 call minutes</li>
              <li><strong>Pro:</strong> $180/month - 5,000 call minutes</li>
              <li><strong>Enterprise:</strong> Custom pricing - contact sales</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">5.3 Overage Charges</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              If you exceed your plan's included minutes, overage charges apply at the following rates:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Starter: $0.15 per additional minute</li>
              <li>Professional: $0.12 per additional minute</li>
              <li>Pro: $0.10 per additional minute</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              Overage charges are billed at the end of each billing cycle. Minutes are calculated based on call duration, rounded up to the nearest minute.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">5.4 Billing and Payment</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Payments are processed securely through Flutterwave</li>
              <li>Subscriptions auto-renew monthly unless cancelled</li>
              <li>You authorize us to charge your payment method on file</li>
              <li>Failed payments may result in service suspension</li>
              <li>Prices are in USD and exclude applicable taxes</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">5.5 Price Changes</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We may change pricing with 30 days' notice. Existing subscribers will be grandfathered at their current rate for 90 days after the price change.
            </p>
          </section>

          {/* Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">6. Cancellation and Refunds</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.1 Cancellation Policy</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. You will retain access to paid features until the period ends.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.2 Refund Policy</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>No refunds for partial months or unused minutes</li>
              <li>Refunds may be issued at our sole discretion for service outages exceeding 24 consecutive hours</li>
              <li>Disputed charges must be reported within 30 days of billing</li>
              <li>Refund requests: contact support@callwaitingai.com</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">6.3 Account Deletion</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              If you delete your account, all data will be permanently removed within 30 days (except where legal retention applies). This action is irreversible.
            </p>
          </section>

          {/* Acceptable Use Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">7. Acceptable Use Policy</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              You agree NOT to use the Service for:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Illegal activities or purposes prohibited by law</li>
              <li>Harassment, abuse, threats, or hate speech</li>
              <li>Spam, unsolicited marketing, or fraudulent schemes</li>
              <li>Violating third-party intellectual property rights</li>
              <li>Distributing malware, viruses, or harmful code</li>
              <li>Impersonating others or misrepresenting your identity</li>
              <li>Scraping, crawling, or unauthorized data collection</li>
              <li>Reverse engineering or tampering with the Service</li>
              <li>Political campaigning or robocalls (unless compliant with regulations)</li>
              <li>Circumventing usage limits or access controls</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              <strong>Violation of this policy may result in immediate account termination without refund.</strong>
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">8. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">8.1 Our IP</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              CallWaitingAI owns all rights, title, and interest in the Service, including software, trademarks, logos, and documentation. You may not copy, modify, distribute, or create derivative works without our written permission.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">8.2 Your Data</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              You retain ownership of your data (call logs, transcripts, leads). By using the Service, you grant us a limited license to process your data as necessary to provide the Service. See our Privacy Policy for details.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">8.3 Voice Cloning</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              If you use our voice cloning feature (Pro/Enterprise only), you represent and warrant that you own or have obtained all necessary rights to the voice recordings provided. You are solely responsible for any claims arising from unauthorized voice use.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">9. Third-Party Services and Integrations</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              The Service integrates with third-party providers (Vapi.ai, Groq, Minimax, Flutterwave, Supabase). We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Third-party service availability, accuracy, or security</li>
              <li>Changes to third-party terms or pricing</li>
              <li>Data breaches or losses caused by third parties</li>
              <li>Disputes with third-party providers</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              Your use of third-party services is subject to their respective terms and privacy policies.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">10. Service Availability and Support</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">10.1 Uptime SLA</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We target 99.5% uptime but cannot guarantee uninterrupted service. Planned maintenance will be announced in advance when possible.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">10.2 Support</h3>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li><strong>Starter:</strong> Email support (48-hour response time)</li>
              <li><strong>Professional:</strong> Priority email support (24-hour response)</li>
              <li><strong>Pro/Enterprise:</strong> Phone + email support (4-hour response)</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">10.3 Beta Features</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Some features may be labeled "Beta." These are experimental and provided "as is" without warranty. We may discontinue or modify Beta features at any time.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">11. Disclaimer of Warranties</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>The Service will be error-free or uninterrupted</li>
              <li>Defects will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>Results obtained from the Service will be accurate or reliable</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">12. Limitation of Liability</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>CallWaitingAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION</li>
              <li>OUR TOTAL LIABILITY FOR ALL CLAIMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM</li>
              <li>Some jurisdictions do not allow exclusion of certain warranties or liability limitations, so the above may not apply to you</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">13. Indemnification</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              You agree to indemnify, defend, and hold harmless CallWaitingAI, its affiliates, and their respective officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your data or content submitted to the Service</li>
            </ul>
          </section>

          {/* Data Protection and Compliance */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">14. Data Protection and Compliance</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              You are responsible for ensuring your use of the Service complies with applicable laws, including:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>UK GDPR and data protection regulations</li>
              <li>PECR (Privacy and Electronic Communications Regulations)</li>
              <li>Telephone Consumer Protection Act (TCPA) if applicable</li>
              <li>CAN-SPAM Act for email communications</li>
              <li>Industry-specific regulations (e.g., HIPAA, PCI-DSS)</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              <strong>You must obtain proper consent before recording calls or storing personal data. We are not liable for your non-compliance.</strong>
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">15. Dispute Resolution and Governing Law</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">15.1 Governing Law</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              These Terms are governed by the laws of England and Wales, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">15.2 Dispute Resolution</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Before filing a legal claim, you agree to attempt informal resolution by contacting support@callwaitingai.com. If unresolved within 30 days, either party may pursue formal proceedings.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">15.3 Jurisdiction</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Any legal action must be brought in the courts of England and Wales. You consent to the exclusive jurisdiction of these courts.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">16. Changes to These Terms</h2>
            <p className="text-neutral-mediumText leading-relaxed">
              We may update these Terms from time to time. Material changes will be notified via:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Email to your registered address (at least 30 days' notice)</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification</li>
            </ul>
            <p className="text-neutral-mediumText leading-relaxed mt-4">
              Continued use after changes constitutes acceptance. If you disagree, you must cancel your subscription.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">17. Termination</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">17.1 Termination by You</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              You may terminate by cancelling your subscription. Your data will be retained for 30 days post-cancellation for recovery, then permanently deleted.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">17.2 Termination by Us</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>Violate these Terms or Acceptable Use Policy</li>
              <li>Fail to pay outstanding balances</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Pose a security risk to the Service or other users</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">17.3 Effect of Termination</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Upon termination:
            </p>
            <ul className="list-disc list-inside text-neutral-mediumText space-y-2">
              <li>All licenses and rights to use the Service cease immediately</li>
              <li>You remain liable for all outstanding payments</li>
              <li>Provisions that survive termination: Sections 8 (IP), 11 (Disclaimers), 12 (Liability), 13 (Indemnification), 15 (Disputes)</li>
            </ul>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">18. General Provisions</h2>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">18.1 Entire Agreement</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and CallWaitingAI.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">18.2 Severability</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              If any provision is found unenforceable, the remaining provisions remain in full effect.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">18.3 Waiver</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              Failure to enforce any right or provision does not constitute a waiver of that right.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">18.4 Assignment</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              You may not assign these Terms without our written consent. We may assign these Terms to any successor entity.
            </p>

            <h3 className="text-xl font-semibold text-neutral-darkText mt-6 mb-3">18.5 Force Majeure</h3>
            <p className="text-neutral-mediumText leading-relaxed">
              We are not liable for delays or failures caused by events beyond our reasonable control (natural disasters, war, strikes, pandemics, internet outages, third-party service failures).
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-neutral-mediumText/20 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-darkText mb-4">19. Contact Information</h2>
            <p className="text-neutral-mediumText leading-relaxed mb-4">
              For questions about these Terms, please contact:
            </p>
            <div className="p-4 bg-neutral-lightBg border border-neutral-mediumText/20 rounded-lg space-y-2">
              <p className="text-neutral-mediumText"><strong>CallWaitingAI Limited</strong></p>
              <p className="text-neutral-mediumText">Email: support@callwaitingai.com</p>
              <p className="text-neutral-mediumText">Phone: +1 (276) 582-5329</p>
              <p className="text-neutral-mediumText">Legal inquiries: odiabackend@gmail.com</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-neutral-darkText">
                <strong>Notice:</strong> By clicking "I agree" or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
