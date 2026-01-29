
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-bold text-gray-800">
                Portail d'Épreuve
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Plateforme de gestion et de partage d'épreuves et de ressources
              académiques.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/epreuves" className="hover:text-[#0077d2] transition-colors">
                  Épreuves
                </a>
              </li>
              <li>
                <a href="/ressources" className="hover:text-[#0077d2] transition-colors">
                  Ressources
                </a>
              </li>
              <li>
                <a href="/soumettre" className="hover:text-[#0077d2] transition-colors">
                  Soumettre un document
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <p className="text-sm text-gray-600">
              Pour toute question ou assistance, contactez l'administration.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Portail d'Épreuve. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
