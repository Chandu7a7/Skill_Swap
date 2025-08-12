// Footer.jsx
import { Facebook, Instagram, Linkedin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand with Logo */}
        <div>
          <a href="/" className="flex items-center gap-2 mb-3">
            <img
              src="./src/assids/Skillsawp.png"
              alt="SkillSwap Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-white tracking-tight">SkillSwap</span>
          </a>
          <p className="text-gray-400">
            Exchange. Learn. Grow. A community where everyone teaches and learns.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Courses</a></li>
            <li><a href="#" className="hover:text-white">Become a Mentor</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-400">Connect with Us</h3>
          <div className="flex gap-4 text-gray-400 mb-4">
            <a href="#"><Facebook className="hover:text-white" /></a>
            <a href="#"><Instagram className="hover:text-white" /></a>
            <a href="#"><Linkedin className="hover:text-white" /></a>
            <a href="tel:+91XXXXXXXXXX"><Phone className="hover:text-white" /></a>
          </div>
          <p className="text-sm text-gray-400">Email: hello@skillswap.com</p>
          <p className="text-sm text-gray-400">Phone: +91-98765-43210</p>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />

      <p className="text-center text-gray-500 text-sm">
        © {currentYear} SkillSwap. Empowering learners worldwide.
      </p>
    </footer>
  );
}
