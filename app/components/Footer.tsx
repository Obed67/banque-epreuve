"use client";

import Link from "next/link";
import ContactDialog from "@/components/client/contact/ContactDialog";
import LegalDialog from "@/components/client/legal/LegalDialog";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-800">
                Banque Epreuve
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Plateforme de gestion et de partage d&apos;épreuves et de
              ressources académiques.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">Liens rapides</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/epreuves"
                  className="transition-colors hover:text-[#0077d2]"
                >
                  Épreuves
                </Link>
              </li>
              <li>
                <Link
                  href="/ressources"
                  className="transition-colors hover:text-[#0077d2]"
                >
                  Ressources
                </Link>
              </li>
              <li>
                <Link
                  href="/soumettre"
                  className="transition-colors hover:text-[#0077d2]"
                >
                  Soumettre un document
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <ContactDialog triggerClassName="transition-colors hover:text-[#0077d2]">
                  Écrire à l&apos;administration
                </ContactDialog>
              </li>
              <li className="text-xs leading-relaxed text-gray-500">
                Questions, signalements ou suggestion
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800">
              Informations légales
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <LegalDialog
                  document="conditions"
                  triggerClassName="transition-colors hover:text-[#0077d2]"
                >
                  Conditions d&apos;utilisation
                </LegalDialog>
              </li>
              <li>
                <LegalDialog
                  document="confidentialite"
                  triggerClassName="transition-colors hover:text-[#0077d2]"
                >
                  Politique de confidentialité
                </LegalDialog>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 text-center text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} Banque Epreuve. Tous droits réservés.
          </p>
          <p>
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
