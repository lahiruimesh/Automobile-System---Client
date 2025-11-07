import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using AutoService, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              AutoService provides an online platform for vehicle service appointment management, 
              progress tracking, and communication between customers and service providers. We reserve 
              the right to modify, suspend, or discontinue any part of our service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Appointment Booking</h2>
            <p className="text-gray-600 leading-relaxed">
              All appointments are subject to availability and confirmation. We reserve the right to 
              cancel or reschedule appointments if necessary. Customers will be notified of any changes 
              as soon as possible. Cancellation policies may apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use the service for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Upload malicious code or engage in any harmful activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Service Fees and Payments</h2>
            <p className="text-gray-600 leading-relaxed">
              Service fees will be clearly communicated before you confirm any service. Payment terms 
              and methods will be specified at the time of booking. All fees are subject to applicable 
              taxes. Refund policies are determined on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The service and its original content, features, and functionality are owned by AutoService 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              AutoService shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages resulting from your use or inability to use the service. We do not 
              guarantee the quality of services provided by third-party service providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The service is provided "as is" and "as available" without warranties of any kind, either 
              express or implied, including but not limited to warranties of merchantability, fitness 
              for a particular purpose, or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to terminate or suspend your account and access to the service 
              immediately, without prior notice, for any reason, including breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. We will provide notice 
              of any material changes by posting the new Terms on this page. Your continued use of the 
              service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 text-gray-700">
              <p>Email: legal@autoservice.com</p>
              <p>Phone: +1 555-123-4567</p>
              <p>Address: 123 Auto Street, Service City, SC 12345</p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last Updated: November 7, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
