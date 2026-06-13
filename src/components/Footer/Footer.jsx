import { FiShield } from 'react-icons/fi'
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from 'react-icons/fa'


const socials = [
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaInstagram, label: 'Instagram' },
  { Icon: FaFacebookF, label: 'Facebook' },
  { Icon: FaLinkedinIn, label: 'LinkedIn' },
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
                <button type="button" className="footer-cta">
          Contact us
        </button>
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="footer-social"
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
