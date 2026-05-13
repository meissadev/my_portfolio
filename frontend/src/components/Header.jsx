import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">
            MB
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('accueil')} className="hover:text-sky-500 transition-colors">
              Accueil
            </button>
            <button onClick={() => scrollToSection('apropos')} className="hover:text-sky-500 transition-colors">
              À propos
            </button>
            <button onClick={() => scrollToSection('competences')} className="hover:text-sky-500 transition-colors">
              Compétences
            </button>
            <button onClick={() => scrollToSection('projets')} className="hover:text-sky-500 transition-colors">
              Projets
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-sky-500 transition-colors">
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <button onClick={() => scrollToSection('accueil')} className="block w-full text-left hover:text-sky-500 transition-colors">
              Accueil
            </button>
            <button onClick={() => scrollToSection('apropos')} className="block w-full text-left hover:text-sky-500 transition-colors">
              À propos
            </button>
            <button onClick={() => scrollToSection('competences')} className="block w-full text-left hover:text-sky-500 transition-colors">
              Compétences
            </button>
            <button onClick={() => scrollToSection('projets')} className="block w-full text-left hover:text-sky-500 transition-colors">
              Projets
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left hover:text-sky-500 transition-colors">
              Contact
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
