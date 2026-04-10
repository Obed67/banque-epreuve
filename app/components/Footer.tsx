export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-bold text-gray-800">
                Portail d&apos;Épreuve
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Plateforme de gestion et de partage d&apos;épreuves et de
              ressources académiques.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="/epreuves"
                  className="hover:text-[#0077d2] transition-colors"
                >
                  Épreuves
                </a>
              </li>
              <li>
                <a
                  href="/ressources"
                  className="hover:text-[#0077d2] transition-colors"
                >
                  Ressources
                </a>
              </li>
              <li>
                <a
                  href="/soumettre"
                  className="hover:text-[#0077d2] transition-colors"
                >
                  Soumettre un document
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <p className="text-sm text-gray-600">
              Pour toute question ou assistance, contactez
              l&apos;administration.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Portail d&apos;Épreuve. Tous droits
            réservés.
          </p>
          <p className="mt-2">
            Powered by{" "}
            <a
              href="https://obedev.me"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#0077d2] hover:underline"
            >
              ObeDev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
