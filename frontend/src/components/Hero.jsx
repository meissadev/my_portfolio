import profilePhoto from '../assets/photo_2026-04-03_11-39-44.png';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Hero() {
  return (
    <section id="accueil" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Profile Info */}
          <div className="text-left">
            <div className="mb-6">
              <span className="px-4 py-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold border border-sky-500/20">
                👋 Bienvenue sur mon portfolio
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Meissa Babou</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Administrateur Systèmes, Réseaux & Cybersécurité
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Passionné par le <span className="text-sky-600 dark:text-sky-400 font-semibold">Cloud</span> et le <span className="text-violet-600 dark:text-violet-400 font-semibold">DevOps</span>, 
              je conçois et sécurise des infrastructures IT modernes et hautement disponibles.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="#projets" 
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
              >
                Voir mes projets
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border-2 border-sky-500 text-sky-600 dark:text-sky-400 rounded-lg font-semibold hover:bg-sky-500 hover:text-white transition-all"
              >
                Me contacter
              </a>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-sky-500 hover:text-white transition-all"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-sky-500 hover:text-white transition-all"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right side - Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-violet-600 rounded-2xl blur-2xl opacity-20"></div>
              <img 
                src={profilePhoto} 
                alt="Meissa Babou" 
                className="relative w-80 h-80 object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
