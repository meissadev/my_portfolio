import { FaGithub, FaGitlab, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Meissa Babou</h3>
            <p className="text-sm mb-4">
              Administrateur Systèmes, Réseaux & Cybersécurité
            </p>
            <p className="text-sm">
              Passionné par les infrastructures IT et la sécurité informatique.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#accueil" className="hover:text-white transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-white transition-colors">À propos</a>
              </li>
              <li>
                <a href="#competences" className="hover:text-white transition-colors">Compétences</a>
              </li>
              <li>
                <a href="#projets" className="hover:text-white transition-colors">Projets</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:meissababou66@gmail.com" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <FaEnvelope /> meissababou66@gmail.com
              </a>
              <div className="flex gap-4 mt-4">
                <a 
                  href="https://github.com/meissadev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://gitlab.com/meissababou66" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-orange-500 transition-colors"
                  aria-label="GitLab"
                >
                  <FaGitlab />
                </a>
                <a 
                  href="https://linkedin.com/in/meissa-babou" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-blue-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Meissa Babou. Tous droits réservés.
          </p>
          <p className="mt-2">
            Développé avec React, Express & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
