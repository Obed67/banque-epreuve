import { LegalSection } from "./LegalSection";

export default function ConditionsUtilisationBody() {
  return (
    <>
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions d&apos;utilisation (ci-après « CGU »)
          régissent l&apos;accès et l&apos;usage de la plateforme{" "}
          <strong className="font-semibold text-[#0f172a]">Banque Epreuve</strong>{" "}
          (le « Site »), service communautaire de partage de documents
          académiques : épreuves, cours, TD, mémoires et ressources
          pédagogiques associées.
        </p>
        <p>
          En accédant au Site ou en l&apos;utilisant, vous acceptez sans réserve
          les présentes CGU. Si vous n&apos;y consentez pas, veuillez ne pas
          utiliser le Site.
        </p>
      </LegalSection>

      <LegalSection title="2. Description du service">
        <p>Le Site permet notamment de :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>consulter un catalogue d&apos;épreuves et de ressources validées ;</li>
          <li>télécharger des documents publiés ;</li>
          <li>
            soumettre des documents pour contribution, sous réserve de
            modération ;
          </li>
          <li>
            pour les administrateurs : modérer, valider ou rejeter les
            soumissions.
          </li>
        </ul>
        <p>
          Le Site est fourni à titre informatif et pédagogique. Il ne se
          substitue pas aux supports officiels des établissements
          d&apos;enseignement.
        </p>
      </LegalSection>

      <LegalSection title="3. Accès au Site">
        <p>
          L&apos;accès au catalogue public est libre. Certaines fonctionnalités
          (espace administrateur) nécessitent un compte et des droits
          spécifiques.
        </p>
        <p>
          Vous êtes responsable de la confidentialité de vos identifiants et de
          toute activité réalisée via votre compte.
        </p>
      </LegalSection>

      <LegalSection title="4. Soumission de documents">
        <p>En soumettant un document, vous déclarez et garantissez que :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            vous disposez des droits nécessaires pour le partager sur le Site ;
          </li>
          <li>
            le contenu est licite, lisible, pertinent et à caractère académique
            ;
          </li>
          <li>
            le fichier respecte les formats et tailles acceptés (PDF, DOC, DOCX)
            ;
          </li>
          <li>
            vous n&apos;uploadez pas de contenu malveillant, trompeur,
            diffamatoire, discriminatoire ou portant atteinte aux droits de
            tiers.
          </li>
        </ul>
        <p>
          Toute soumission est soumise à validation par l&apos;équipe
          d&apos;administration. Un document peut être accepté, rejeté ou retiré
          à tout moment, notamment en cas de doublon, de non-conformité ou de
          signalement.
        </p>
        <p>
          L&apos;indication d&apos;un nom ou d&apos;un email contributeur est
          optionnelle (opt-in). Ces informations ne sont pas publiées dans le
          catalogue.
        </p>
      </LegalSection>

      <LegalSection title="5. Propriété intellectuelle">
        <p>
          Les éléments du Site (marque, interface, textes éditoriaux, design)
          restent la propriété de Banque Epreuve ou de ses ayants droit.
        </p>
        <p>
          Les documents partagés restent sous la responsabilité de leurs
          auteurs/contributeurs. En soumettant un fichier, vous accordez à
          Banque Epreuve une licence non exclusive, gratuite et mondiale pour
          héberger, afficher et permettre le téléchargement du document dans le
          cadre du service, pour la durée de sa mise en ligne.
        </p>
        <p>
          Les utilisateurs s&apos;engagent à n&apos;utiliser les documents
          téléchargés qu&apos;à des fins personnelles et pédagogiques, et à
          respecter les droits d&apos;auteur applicables.
        </p>
      </LegalSection>

      <LegalSection title="6. Comportements interdits">
        <p>Il est notamment interdit de :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            tenter d&apos;accéder sans autorisation à l&apos;espace admin ou aux
            données d&apos;autres utilisateurs ;
          </li>
          <li>
            perturber le fonctionnement du Site (surcharge, scraping abusif,
            malware) ;
          </li>
          <li>
            usurper une identité ou fournir des informations volontairement
            fausses ;
          </li>
          <li>
            republier massivement le catalogue à des fins commerciales sans
            autorisation.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Modération et retrait">
        <p>
          L&apos;équipe d&apos;administration se réserve le droit de refuser,
          retirer ou modifier la visibilité de tout contenu, sans obligation de
          motiver chaque décision au-delà des informations éventuellement
          transmises au contributeur (si opt-in email).
        </p>
      </LegalSection>

      <LegalSection title="8. Disponibilité et responsabilité">
        <p>
          Le Site est fourni « en l&apos;état ». Nous nous efforçons d&apos;assurer
          une disponibilité raisonnable, sans garantie d&apos;absence
          d&apos;interruption, d&apos;erreur ou de perte de données.
        </p>
        <p>
          Banque Epreuve ne saurait être tenue responsable des dommages
          indirects, ni de l&apos;usage fait des documents téléchargés, ni de
          l&apos;exactitude ou de l&apos;exhaustivité des contenus soumis par les
          contributeurs.
        </p>
      </LegalSection>

      <LegalSection title="9. Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans la politique de
          confidentialité, accessible depuis le pied de page du Site.
        </p>
      </LegalSection>

      <LegalSection title="10. Modification des CGU">
        <p>
          Nous pouvons modifier les présentes CGU à tout moment. La date de
          mise à jour figurant dans la fenêtre fait foi. La poursuite de
          l&apos;utilisation du Site après publication vaut acceptation des
          nouvelles conditions.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Pour toute question relative aux présentes CGU, contactez
          l&apos;administration du Site via les moyens indiqués sur la
          plateforme.
        </p>
      </LegalSection>
    </>
  );
}
