"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactCollaborationPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Your message has been sent! We will contact you shortly.');
    // In a real application, you would send this data to a backend.
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Mail className="h-8 w-8 mr-3 text-indigo-600" />
          Contact & Collaboration
        </h1>
        <Button asChild variant="outline">
          <Link to="/torino-dashboard" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300">
              We'd love to hear from you! Use the form below for general inquiries, feedback, or support.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your Name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" required />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" type="text" placeholder="Subject of your message" required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Write your message here..." rows={5} required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Collaboration & Open Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              We believe in the power of collaboration and open data to improve urban mobility. If you are a researcher, developer, or organization with mobility data or innovative ideas, we want to work with you!
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Direct Contact Information:</h3>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                Email: <a href="mailto:info@torinotraffic.com" className="ml-2 text-blue-600 hover:underline">info@torinotraffic.com</a>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                Phone: <a href="tel:+390111234567" className="ml-2 text-blue-600 hover:underline">+39 011 1234 567</a>
              </p>
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                Address: Via Roma 1, 10121 Torino, Italy
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Resources & Partnerships:</h3>
              <p>
                We are open to partnerships with government agencies, universities, and technology companies. Visit our open data portal (if available) or contact us to discuss potential collaborations.
              </p>
              <Button variant="outline" className="w-full">
                <Link to="#" className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  View Our Partners
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ContactCollaborationPage;