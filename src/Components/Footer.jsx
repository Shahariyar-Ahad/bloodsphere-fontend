import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="footer p-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        
        {/* Brand & Contact */}
        <aside>
          <h2 className="text-xl font-bold text-red-500">Blood Sphere</h2>
          <p className="mt-2 text-sm">
            Saving lives through safe blood donation.
          </p>
          <p className="mt-3 text-sm">
            📍 Dhaka, Bangladesh <br />
            📞 +880 1XXX-XXXXXX <br />
            ✉️ support@bloodsphere.org
          </p>
        </aside>

        {/* Services */}
        <nav>
          <h6 className="footer-title">Services</h6>
          <a href="/all-request" className="link link-hover">Donate Blood</a>
          <a href="/donation-requests" className="link link-hover">Request Blood</a>
          <a href="/campaigns" className="link link-hover">Campaigns</a>
        </nav>

        {/* Company */}
        <nav>
          <h6 className="footer-title">Company</h6>
          <a href="/about" className="link link-hover">About Us</a>
          <a href="/contact" className="link link-hover">Contact</a>
          <a href="/volunteer" className="link link-hover">Volunteer</a>
        </nav>

        {/* Legal */}
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a href="/terms" className="link link-hover">Terms of Use</a>
          <a href="/privacy" className="link link-hover">Privacy Policy</a>
          <a href="/cookies" className="link link-hover">Cookie Policy</a>
        </nav>

        {/* Social */}
        <nav>
          <h6 className="footer-title">Social</h6>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            GitHub
          </a>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-content/20 text-center py-4 text-sm">
        © {new Date().getFullYear()} Blood Sphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
