import React from "react";

const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Contact Us</h1>
      <p className="text-center mb-6">
        Have questions or need support? Reach out to us!
      </p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <strong>Email:</strong>
          <a href="mailto:support@example.com" className="text-blue-500">
            support@example.com
          </a>
        </div>
        <div className="flex justify-between">
          <strong>Phone:</strong>
          <p>(123) 456-7890</p>
        </div>
        <div className="flex justify-between">
          <strong>Address:</strong>
          <p>123 Health St, City, Country</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
