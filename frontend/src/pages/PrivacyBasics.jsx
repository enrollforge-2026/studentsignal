import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Shield, Lock, Eye, Mail } from 'lucide-react';

const PrivacyBasics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Shield className="text-green-700 mx-auto mb-4" size={64} />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy & Data Basics
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy matters. Here's how we protect your information.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 mb-8 space-y-8">
          {/* What We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">What Information We Collect</h2>
            </div>
            <p className="text-gray-700 mb-4">
              When you create a Student Signal account, we collect basic information to personalize your experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Name and email address for account creation</li>
              <li>Academic profile (GPA, test scores, interests) to match you with colleges</li>
              <li>Saved colleges and scholarships to build your personalized dashboard</li>
              <li>Information request forms you submit to colleges</li>
            </ul>
          </section>

          {/* How We Use It */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We use your information solely to provide and improve Student Signal services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Personalize college and scholarship recommendations</li>
              <li>Save your progress and preferences across sessions</li>
              <li>Connect you with colleges when you request information</li>
              <li>Improve our platform based on anonymous usage patterns</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>We will never:</strong> Sell your personal information to third parties, send unsolicited marketing emails, or share your data without your explicit consent.
            </p>
          </section>

          {/* Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-green-700" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">How We Protect Your Data</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Your security is our priority. We implement industry-standard measures:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Encrypted password storage using secure hashing</li>
              <li>Secure HTTPS connections for all data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Limited staff access to user data on a need-to-know basis</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights & Control</h2>
            <p className="text-gray-700 mb-4">
              You have full control over your data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Access:</strong> View all information we have about you at any time</li>
              <li><strong>Update:</strong> Correct or modify your profile information through your account settings</li>
              <li><strong>Delete:</strong> Request complete deletion of your account and data</li>
              <li><strong>Export:</strong> Download a copy of your data in a standard format</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Tracking</h2>
            <p className="text-gray-700">
              Student Signal uses essential cookies to maintain your login session and remember your preferences. We do not use third-party advertising or tracking cookies. You can disable cookies in your browser, but some features may not function properly.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700">
              We may update this privacy policy as we add new features or comply with regulatory changes. We'll notify users of significant changes via email or dashboard notifications.
            </p>
          </section>
        </div>

        {/* Contact */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <Mail className="text-green-700 mx-auto mb-3" size={40} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Questions About Privacy?</h3>
          <p className="text-gray-700 mb-4">
            If you have concerns about how we handle your data or want to exercise your rights, please contact us.
          </p>
          <a
            href="mailto:privacy@studentsignal.com"
            className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            Contact Privacy Team
          </a>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Last Updated: November 2025
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyBasics;
