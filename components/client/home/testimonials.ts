export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  paragraphs: string[];
};

export const testimonials: Testimonial[] = [
  {
    id: "zankpo-frejus",
    name: "ZANKPO Fréjus",
    role: "Étudiant IFRI",
    initials: "ZF",
    paragraphs: [
      "J'ai beaucoup apprécié votre application que vous aviez partager la dernière dans le groupe IFRI L1 2025-2026.",
      "C'est une bonne initiative et ça permettra au étudiant de ne plus se galérer avant de trouver des épreuves.",
      "Je tiens à vous que je suis disponible pour vous fournir des épreuves.",
      "J'ai a ma disposition tous les épreuves du session normal de IFRI de la première année 2025-2026 et quelques épreuves du session de rattrapage que je peux vous balancer.",
    ],
  },
  {
    id: "bhildollars",
    name: "Bhildollars",
    role: "Étudiant",
    initials: "B",
    paragraphs: [
      "Je tenais absolument à te tirer mon chapeau pour le travail remarquable que tu as accompli sur la banque d'épreuves.",
      "Développer une telle plateforme, permettre le téléchargement libre de documents (notamment en .docx, ce qui est super pratique) et offrir le fruit de plusieurs mois de travail (29 janvier jusqu'a aujourd'hui.. c'est quand même beaucoup de temps de travail) à la communauté sans rien demander en retour, c'est un geste fort. Ça montre une vraie vision et un engagement concret pour la démocratisation de l'accès aux ressources académiques.",
      "Ce genre d'initiative fait vraiment avancer l'écosystème local et inspire énormément.",
      "Respect pour le boulot, le temps investi et l'esprit de partage. Force à toi pour la suite de tes projets !",
    ],
  },
];
