import Card from "../../../app/components/Card";

export default function SubmissionInfoCard() {
  return (
    <Card className="overflow-hidden border-0 p-0 shadow-lg ring-1 ring-black/5">
      <div className="bg-[#0077d2] p-6 text-center text-white">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm">
          📝
        </div>
        <h3 className="text-xl font-bold">Informations Cles</h3>
        <p className="mt-1 text-sm text-blue-100">
          Guide pour une soumission reussie
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        <div className="bg-white p-6 transition-colors hover:bg-gray-50">
          <h4 className="mb-4 font-bold text-gray-800">
            Impact de la contribution
          </h4>
          <div className="space-y-3 pl-6 text-sm text-gray-600">
            <p>
              <span className="mr-2 font-bold text-purple-600">•</span>
              Aide pour{" "}
              <strong className="text-gray-900">500+ etudiants</strong>
            </p>
            <p>
              <span className="mr-2 font-bold text-purple-600">•</span>
              Succes academique commun
            </p>
            <p>
              <span className="mr-2 font-bold text-purple-600">•</span>
              Partage de connaissances
            </p>
          </div>
        </div>

        <div className="bg-white p-6 transition-colors hover:bg-gray-50">
          <h4 className="mb-4 font-bold text-gray-800">Directives a suivre</h4>
          <ul className="space-y-2.5 pl-6 text-sm text-gray-600">
            <li>
              <span className="mr-2 text-green-500">✓</span>Document lisible et
              net
            </li>
            <li>
              <span className="mr-2 text-green-500">✓</span>Contenu exact et
              complet
            </li>
            <li>
              <span className="mr-2 text-green-500">✓</span>Nom de fichier
              descriptif
            </li>
            <li>
              <span className="mr-2 text-green-500">✓</span>Format PDF
            </li>
            <li className="text-orange-600">
              <span className="mr-2">✗</span>Rejet si non conforme
            </li>
          </ul>
        </div>

        <div className="bg-blue-50/50 p-6">
          <h4 className="mb-4 font-bold text-gray-800">Validation</h4>
          <div className="relative flex items-center justify-between px-2">
            <Step number={1} label="Envoi" active />
            <div className="relative top-[-10px] mx-2 h-0.5 flex-1 bg-gray-200" />
            <Step number={2} label="Verif" />
            <div className="relative top-[-10px] mx-2 h-0.5 flex-1 bg-gray-200" />
            <Step number={3} label="Publie" done />
          </div>
        </div>
      </div>
    </Card>
  );
}

type StepProps = {
  number: number;
  label: string;
  active?: boolean;
  done?: boolean;
};

function Step({ number, label, active, done }: StepProps) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-4 ring-white shadow-sm";

  const style = done
    ? "bg-[#1cb427] text-white"
    : active
      ? "bg-[#0077d2] text-white"
      : "border-2 border-[#0077d2] bg-white text-[#0077d2]";

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className={`${base} ${style}`}>{number}</div>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-tight text-gray-600">
        {label}
      </span>
    </div>
  );
}
