'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="space-y-20 max-w-4xl mx-auto px-4 md:px-0">
      {/* TÍTULO */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Perguntas Frequentes
        </h1>
        <p className="text-gray-600 text-lg">
          FAQs sobre a Casa Fragosa – Alojamento Local
        </p>
      </header>

      {/* FAQ */}
      <section className="space-y-4">
        <FAQItem
          question="Que tipo de quartos posso reservar na Casa Fragosa?"
        >
          <ul className="list-disc list-inside space-y-1">
            <li>Quartos familiares</li>
            <li>Estúdio</li>
            <li>Cama em dormitório partilhado</li>
            <li>Apartamento T2 (Casa completa)</li>
          </ul>
        </FAQItem>

        <FAQItem question="Quais são os horários de check-in e check-out?">
          O check-in é efetuado a partir das <strong>12:00</strong> e o
          check-out deve ser feito até às <strong>11:00</strong>.
        </FAQItem>

        <FAQItem question="Quanto custa ficar hospedado na Casa Fragosa?">
          Os preços variam consoante as datas da estadia e o tipo de
          alojamento escolhido. Para consultar valores atualizados,
          introduza as datas pretendidas.
        </FAQItem>

        <FAQItem question="Que atividades ou serviços estão disponíveis?">
          <ul className="list-disc list-inside space-y-1">
            <li>Acesso direto à praia</li>
            <li>Localização em frente ao mar</li>
          </ul>
        </FAQItem>

        <FAQItem question="A que distância fica do centro da Póvoa de Varzim?">
          A Casa Fragosa está localizada a cerca de <strong>2,3 km</strong>
          do centro da Póvoa de Varzim.
        </FAQItem>

        <FAQItem question="A que distância fica a praia?">
          A praia mais próxima encontra-se a apenas <strong>50 metros</strong>
          da Casa Fragosa.
        </FAQItem>
      </section>
    </div>
  );
}

/* COMPONENTE ACCORDION */
function FAQItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-800">
            {question}
          </h3>
        </div>

        <ChevronDown
          className={`w-6 h-6 text-gray-500 transition-transform duration-500 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* CONTEÚDO COM ANIMAÇÃO */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 text-gray-600 ml-9">
          {children}
        </div>
      </div>
    </div>
  );
}
