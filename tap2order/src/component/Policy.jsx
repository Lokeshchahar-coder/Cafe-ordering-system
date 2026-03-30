import React from "react";

const InfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-36 md:pt-40">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-8">
          {/* About Us Section */}
          <section id="about-us" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">About Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>GD CAFE</strong>, where innovation meets convenience in the hospitality industry.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We specialize in providing a seamless self-ordering system for cafes and restaurants using QR code technology. Our solution empowers your customers to scan, browse, and order directly from their smartphones, ensuring an efficient and contactless dining experience.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              At <strong>GD CAFE</strong>, we believe in creating technology that simplifies operations for businesses while enhancing the customer experience. Our self-ordering system reduces wait times, improves order accuracy, and boosts operational efficiency, allowing you to focus on what you do best—serving great food and creating memorable experiences.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              With a customer-centric approach, we are dedicated to helping cafes and restaurants of all sizes embrace the future of dining. Join us in transforming the way people dine out!
            </p>
          </section>

          {/* Delivery Section */}
          <section id="delivery" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              At <strong>GD CAFE</strong>, our self-ordering system does not involve physical delivery of products but instead offers a digital solution for cafes and restaurants. Here’s what you can expect:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700 leading-relaxed">
              <li><strong>Instant Access:</strong> Our system is cloud-based, ensuring quick setup and immediate access for your staff and customers.</li>
              <li><strong>Contactless Experience:</strong> Customers can scan QR codes placed on tables to explore the menu and place their orders without needing additional assistance.</li>
              <li><strong>Real-Time Updates:</strong> Orders are seamlessly transmitted to your kitchen or staff dashboard, streamlining communication and ensuring timely preparation.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              For further assistance or to learn more about how our system works, feel free to contact us at <strong>91+ 9068247501</strong>.
            </p>
          </section>

          {/* Privacy Policy Section */}
          <section id="privacy-policy">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Effective Date:</strong>31/03/2026
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>GD CAFE</strong> values your privacy and is committed to protecting the personal information of our users. This Privacy Policy outlines how we collect, use, and safeguard the data shared with us.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Information We Collect</h3>
            <p className="text-gray-700 leading-relaxed mt-4">
              We only collect information that is necessary to provide ordering and support services.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-700 leading-relaxed">
              <li><strong>Customer Data:</strong> Customer name, phone number, and order preferences entered during checkout.</li>
              <li><strong>Business Data:</strong> Restaurant details, menu items, and order history.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">How We Use Your Data</h3>
            <ul className="list-disc list-inside mt-4 text-gray-700 leading-relaxed">
              <li>To facilitate and improve the ordering process for customers and restaurants.</li>
              <li>To analyze usage patterns and enhance system features.</li>
              <li>To provide customer support and respond to inquiries.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Data Security</h3>
            <p className="text-gray-700 leading-relaxed mt-4">
              We use advanced encryption and secure servers to ensure the confidentiality of your data. Access to your information is restricted to authorized personnel only.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Third-Party Sharing</h3>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell or share your data with third parties, except as required by law or to facilitate services directly related to our platform (e.g., payment processors).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Cookies and Tracking</h3>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our website may use cookies to enhance user experience and track system performance. You can opt-out by adjusting your browser settings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6">Your Rights</h3>
            <ul className="list-disc list-inside mt-4 text-gray-700 leading-relaxed">
              <li>Access and update your personal data.</li>
              <li>Request deletion of your data (subject to legal or contractual obligations).</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              For any privacy-related inquiries, please contact us at <strong>lovechahar2005@gmail.com / 91+ 9068247501</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;