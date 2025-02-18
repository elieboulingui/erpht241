import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { CiLinkedin, CiFacebook, CiInstagram } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { MdMonitor } from "react-icons/md";
import { PiSunBold, PiMoonBold } from "react-icons/pi";

import { Button } from "./ui/button";

export default function Footer() {
  const footerSections = [
    {
      title: "Module",
      links: [
        { label: "Module 1", href: "#" },
        { label: "Module 2", href: "#" },
        { label: "Feature 3", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Contact", href: "#" },
        { label: "Roadmap", href: "#" },
        { label: "Docs", href: "#" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Story", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Jobs", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Condition d'utilisation", href: "#" },
        { label: "Politique de confidentialité", href: "#" },
      ],
    },
  ];

  const socialIcons = [
    { Icon: FaXTwitter, label: "Twitter" },
    { Icon: CiLinkedin, label: "Linkedin" },
    { Icon: CiFacebook, label: "Facebook" },
    { Icon: CiInstagram, label: "Instagram" },
    { Icon: FaTiktok, label: "TikTok" },
  ];

  const socialMode = [
    { Icon: MdMonitor, label: "Moniteur" },
    { Icon: PiSunBold, label: "SunBold" },
    { Icon: PiMoonBold, label: "MoonBold" },
  ];

  return (
    <footer className="bg-white border-t py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Mission */}
        <div>
          <Link href="/">
            <img src="/images/ht241.png" alt="Logo" className="h-14 w-14" />
          </Link>
          <p className="mt-4 text-sm text-gray-600 max-w-[280px]">
            Notre mission est de permettre à chaque entreprise de réussir grâce
            à l'IA.
          </p>
        </div>

        {/* Liens */}
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <nav className="flex flex-col space-y-3">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Abonnez-vous à notre newsletter
          </h4>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <Button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
              Souscrire
            </Button>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="container mx-auto border-t border-gray-200 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 mb-4 md:mb-0">
          © 2025 <Link href="#">HighTech 241</Link>. Tous droits réservés.
        </p>
        <div className="flex space-x-4 items-center">
          <div className="flex space-x-2">
            {socialIcons.map(({ Icon, label }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-400 mx-2" />

          <div className="flex items-center space-x-2 border border-gray-400 rounded-full px-2 py-1">
            {socialMode.map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
