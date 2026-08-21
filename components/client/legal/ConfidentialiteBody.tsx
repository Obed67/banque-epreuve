import { LegalSection } from "./LegalSection";

export default function ConfidentialiteBody() {
  return (
    <>
      <LegalSection title="1. Introduction">
        <p>
          La présente politique décrit la manière dont{" "}
          <strong className="font-semibold text-[#0f172a]">Banque Epreuve</strong>{" "}
          collecte, utilise et protège vos données personnelles lorsque vous
          utilisez le Site.
        </p>
        <p>
          Nous nous engageons à traiter vos données de façon loyale, limitée au
          nécessaire, et conformément aux principes du RGPD lorsque celui-ci
          s&apos;applique.
        </p>
      </LegalSection>

      <LegalSection title="2. Responsable du traitement">
        <p>
          Le responsable du traitement est l&apos;équipe administratrice de
          Banque Epreuve. Pour exercer vos droits ou poser une question
          relative à vos données, contactez l&apos;administration via les
          canaux indiqués sur le Site.
        </p>
      </LegalSection>

      <LegalSection title="3. Données collectées">
        <p>Selon votre usage, nous pouvons traiter :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="font-semibold text-[#0f172a]">
              Données de navigation / fréquentation :
            </strong>{" "}
            identifiant de session technique, pages consultées, date et type
            d&apos;événement (visite, téléchargement, soumission) à des fins de
            statistiques agrégées ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">
              Données de soumission :
            </strong>{" "}
            métadonnées du document (titre, établissement, filière, UE, année,
            niveau, type, etc.) et le fichier envoyé ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">
              Données contributeur (opt-in) :
            </strong>{" "}
            pseudo / nom affiché optionnel et adresse email, uniquement si vous
            choisissez d&apos;être informé du résultat de la modération ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">
              Données de contact :
            </strong>{" "}
            nom, email, sujet et message lorsque vous utilisez le formulaire
            « Contacter l&apos;administration » ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">
              Compte administrateur :
            </strong>{" "}
            email et données d&apos;authentification gérées via le prestataire
            d&apos;auth.
          </li>
        </ul>
        <p>
          Les emails contributeurs ne sont <em>jamais</em> exposés dans le
          catalogue public.
        </p>
      </LegalSection>

      <LegalSection title="4. Finalités">
        <p>Vos données sont utilisées pour :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>fournir et améliorer le service de catalogue et de soumission ;</li>
          <li>modérer les documents avant publication ;</li>
          <li>
            envoyer des notifications email (soumission à l&apos;admin ;
            résultat au contributeur si opt-in) ;
          </li>
          <li>
            produire des statistiques d&apos;usage (visites, téléchargements,
            soumissions) ;
          </li>
          <li>
            répondre aux messages envoyés via le formulaire de contact ;
          </li>
          <li>assurer la sécurité et prévenir les abus.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Bases légales">
        <p>Selon le cas, le traitement repose sur :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            l&apos;exécution du service demandé (consultation, soumission) ;
          </li>
          <li>
            votre consentement (opt-in email contributeur, certains cookies /
            stockage local utiles au suivi de session) ;
          </li>
          <li>
            notre intérêt légitime (sécurité, statistiques agrégées,
            amélioration du Site).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Prestataires et hébergement">
        <p>
          Pour faire fonctionner le Site, nous faisons appel à des
          prestataires techniques, notamment :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="font-semibold text-[#0f172a]">Supabase</strong> :
            base de données, authentification et stockage des fichiers ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">Vercel</strong> :
            hébergement de l&apos;application web ;
          </li>
          <li>
            <strong className="font-semibold text-[#0f172a]">Brevo</strong> :
            envoi des emails transactionnels (notifications).
          </li>
        </ul>
        <p>
          Ces prestataires traitent les données pour notre compte, dans la
          limite nécessaire au service.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies et stockage local">
        <p>
          Le Site utilise des mécanismes techniques de stockage navigateur
          (par ex. session / identifiant technique) pour compter les visites et
          éviter les doublons de mesure, ainsi que pour la session
          administrateur.
        </p>
        <p>
          Ces éléments ne sont pas destinés à de la publicité ciblée tierce. Vous
          pouvez les supprimer via les paramètres de votre navigateur ; certaines
          fonctionnalités (connexion admin, mesures) peuvent alors être limitées.
        </p>
      </LegalSection>

      <LegalSection title="8. Durée de conservation">
        <p>
          Les documents publiés et métadonnées associées sont conservés tant
          qu&apos;ils restent utiles au catalogue, sauf retrait. Les contacts
          contributeurs sont conservés pour le suivi de la soumission et les
          notifications liées. Les événements analytiques sont conservés pour
          produire des statistiques, puis peuvent être agrégés ou purgés selon
          les besoins d&apos;exploitation.
        </p>
        <p>
          Les comptes administrateurs sont conservés tant que le compte est
          actif.
        </p>
      </LegalSection>

      <LegalSection title="9. Vos droits">
        <p>
          Conformément à la réglementation applicable, vous pouvez demander
          l&apos;accès, la rectification, l&apos;effacement, la limitation ou
          la portabilité de vos données personnelles, ainsi que vous opposer à
          certains traitements, dans les conditions prévues par la loi.
        </p>
        <p>
          Pour toute demande, contactez l&apos;administration du Site.
        </p>
      </LegalSection>

      <LegalSection title="10. Sécurité">
        <p>
          Nous mettons en œuvre des mesures raisonnables (contrôle
          d&apos;accès, politiques de sécurité côté base, rôles admin) pour
          protéger vos données. Aucun système n&apos;étant totalement
          infaillible, nous vous invitons à signaler toute anomalie suspecte.
        </p>
      </LegalSection>

      <LegalSection title="11. Modifications">
        <p>
          Cette politique peut être mise à jour. La date indiquée dans la
          fenêtre reflète la dernière révision. Nous vous invitons à la
          consulter régulièrement.
        </p>
      </LegalSection>

      <LegalSection title="12. Documents liés">
        <p>
          L&apos;usage du Site est également régi par les conditions
          d&apos;utilisation, accessibles depuis le pied de page du Site.
        </p>
      </LegalSection>
    </>
  );
}
