import { FaShieldAlt, FaCloud, FaCogs } from 'react-icons/fa';

function About() {
  return (
    <section id="apropos" className="py-20 px-6 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-gradient">À propos de moi</span>
        </h2>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-lg">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Passionné par les technologies de l'information, je me spécialise dans l'administration 
            des systèmes, la sécurité des réseaux et la cybersécurité. Mon expertise s'étend également 
            aux technologies Cloud et aux pratiques DevOps modernes.
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            J'ai développé une solide expérience dans la conception, le déploiement et la maintenance 
            d'infrastructures IT sécurisées et hautement disponibles. Mon approche combine rigueur 
            technique et innovation pour répondre aux défis complexes de la transformation numérique.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <FaShieldAlt className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Cybersécurité</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Protection et sécurisation des infrastructures</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-sky-500/10 rounded-full">
                  <FaCloud className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Cloud</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Déploiement et gestion cloud</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-violet-500/10 rounded-full">
                  <FaCogs className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">DevOps</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Automatisation et CI/CD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
