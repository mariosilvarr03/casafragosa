import {
  Clock,
  LogOut,
  Baby,
  Ban,
  PawPrint,
  CreditCard,
  CigaretteOff,
  PartyPopper,
} from 'lucide-react';

export default function RegrasPage() {
  return (
    <div className="space-y-20 max-w-4xl mx-auto px-4 md:px-0">
      {/* TÍTULO */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Regras da Casa
        </h1>
        <p className="text-gray-600 text-lg">
          Para garantir uma estadia confortável e tranquila para todos os
          hóspedes, pedimos que respeite as seguintes regras.
        </p>
      </header>

      {/* CHECK-IN / CHECK-OUT */}
      <section className="space-y-6">
        <Rule
          icon={<Clock />}
          title="Check-in"
          description="Das 12:00 às 22:00"
        />
        <Rule
          icon={<LogOut />}
          title="Check-out"
          description="Até às 11:00"
        />
      </section>

      {/* CANCELAMENTO */}
      <section className="space-y-6">
        <Rule
          icon={<Ban />}
          title="Cancelamento / Pré-pagamento"
          description="As condições de cancelamento e pré-pagamento variam consoante o tipo de alojamento. Por favor, introduza as datas da sua estadia para consultar as condições da opção pretendida."
        />
      </section>

      {/* CRIANÇAS */}
      <section className="space-y-6">
        <Rule
          icon={<Baby />}
          title="Crianças e camas"
          description="Crianças de qualquer idade são bem-vindas. Para ver preços e ocupação corretos, adicione o número de crianças e as respetivas idades ao fazer a sua pesquisa."
        />

        <Rule
          icon={<Ban />}
          title="Berços e camas extra"
          description="Berços e camas extra não estão disponíveis nesta propriedade."
        />
      </section>

      {/* IDADE */}
      <section className="space-y-6">
        <Rule
          icon={<Ban />}
          title="Restrição de idade"
          description="Não existe qualquer requisito de idade mínima para o check-in."
        />
      </section>

      {/* ANIMAIS */}
      <section className="space-y-6">
        <Rule
          icon={<PawPrint />}
          title="Animais de estimação"
          description="Animais de estimação são permitidos mediante pedido, sem qualquer custo adicional."
        />
      </section>

      {/* PAGAMENTOS */}
      <section className="space-y-6">
        <Rule
          icon={<CreditCard />}
          title="Pagamentos"
          description="A Booking.com processa o pagamento em nome da propriedade. Recomendamos que traga dinheiro para eventuais extras durante a sua estadia."
        />
      </section>

      {/* PROIBIÇÕES */}
      <section className="space-y-6">
        <Rule
          icon={<CigaretteOff />}
          title="Fumar"
          description="Não é permitido fumar em nenhuma área da propriedade."
        />

        <Rule
          icon={<PartyPopper />}
          title="Festas / Eventos"
          description="Não são permitidas festas nem eventos."
        />
      </section>
    </div>
  );
}

/* COMPONENTE AUXILIAR */
function Rule({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl shadow p-6">
      <div className="text-emerald-600 mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
