import { 
  FaAws, 
  FaDocker, 
  FaLinux, 
  FaWindows,
  FaServer,
  FaNetworkWired,
  FaShieldAlt,
  FaTools
} from 'react-icons/fa';
import { 
  SiAnsible, 
  SiTerraform, 
  SiGitlab, 
  SiJenkins,
  SiCisco,
  SiVmware
} from 'react-icons/si';

function Skills() {
  const skillCategories = [
    {
      title: "Cloud & Virtualisation",
      icon: FaAws,
      color: "orange",
      skills: [
        { name: "AWS", icon: FaAws },
        { name: "VMware ESXi", icon: SiVmware },
        { name: "Docker", icon: FaDocker },
        { name: "Terraform", icon: SiTerraform }
      ]
    },
    {
      title: "Systèmes d'exploitation",
      icon: FaServer,
      color: "blue",
      skills: [
        { name: "Windows Server", icon: FaWindows },
        { name: "Linux (Debian)", icon: FaLinux },
        { name: "Active Directory", icon: FaServer }
      ]
    },
    {
      title: "DevOps & Automatisation",
      icon: FaTools,
      color: "purple",
      skills: [
        { name: "Ansible", icon: SiAnsible },
        { name: "Terraform", icon: SiTerraform },
        { name: "GitLab CI/CD", icon: SiGitlab },
        { name: "Jenkins", icon: SiJenkins }
      ]
    },
    {
      title: "Réseau & Sécurité",
      icon: FaShieldAlt,
      color: "red",
      skills: [
        { name: "Cisco", icon: SiCisco },
        { name: "Fortigate", icon: FaShieldAlt },
        { name: "Sophos", icon: FaShieldAlt },
        { name: "Zabbix", icon: FaNetworkWired }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: {
        bg: "bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500/20"
      },
      blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20"
      },
      purple: {
        bg: "bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20"
      },
      red: {
        bg: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20"
      }
    };
    return colors[color];
  };

  return (
    <section id="competences" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-gradient">Compétences</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => {
            const CategoryIcon = category.icon;
            const colorClasses = getColorClasses(category.color);
            
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 ${colorClasses.bg} rounded-lg`}>
                    <CategoryIcon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => {
                    const SkillIcon = skill.icon;
                    return (
                      <span 
                        key={skillIndex}
                        className={`flex items-center gap-2 px-4 py-2 ${colorClasses.bg} text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium border ${colorClasses.border} hover:shadow-md transition-all`}
                      >
                        <SkillIcon className={`w-4 h-4 ${colorClasses.text}`} />
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
