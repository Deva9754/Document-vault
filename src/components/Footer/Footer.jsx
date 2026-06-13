import { FiShield } from 'react-icons/fi'
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from 'react-icons/fa'


const CONTACT_EMAIL = 'devashishsahu01@gmail.com'

const socials = [
  { Icon: FaTwitter, label: 'Twitter', href: '#' },
  {
    Icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/devashish_2_/',
  },
  { Icon: FaFacebookF, label: 'Facebook', href: '#' },
  {
    Icon: FaLinkedinIn,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/devashish-sahu-a509401b3/',
  },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
      
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <span className="footer-logo">
            <FiShield />
            <span>Document Vault</span>
          </span>
          <p className="footer-copy">
            Copyright © {new Date().getFullYear()}
          </p>
          <p className="footer-tagline">Secure. Simple. Yours.</p>
        </div>

        <div className="footer-end">
          <hr className="footer-divider" />        
          <div className="footer-socials">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                'Document Vault — Contact'
              )}`}
              className="footer-cta"
            >
              Contact us
            </a>
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="footer-social"
                {...(href !== '#'
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
