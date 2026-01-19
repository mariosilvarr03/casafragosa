import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wifi,
  Car,
  Home,
  Users,
  Ban,
} from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="space-y-24 max-w-5xl mx-auto px-4 md:px-0">
      {/* SOBRE NÓS */}
      <section className="space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Sobre a Casa Fragosa
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A <strong>Casa Fragosa</strong> é um alojamento local situado mesmo em
          cima da praia, com vista direta para o mar, na Póvoa de Varzim.
          Desde 2018 recebemos hóspedes de todo o mundo, oferecendo conforto,
          tranquilidade e uma localização privilegiada para desfrutar do melhor
          da costa.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Póvoa de Varzim</span>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Aberto desde 2018</span>
          </div>
        </div>
      </section>

      {/* ABOUT THIS PROPERTY */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          About this property
        </h2>

        <div className="space-y-6 text-gray-600 max-w-4xl mx-auto">
          <p>
            <strong>Beachfront Location:</strong> A Casa Fragosa oferece acesso
            direto à praia e vistas deslumbrantes sobre o mar. Os hóspedes podem
            relaxar no jardim ou desfrutar da área exterior com assentos.
          </p>

          <p>
            <strong>Comfortable Accommodations:</strong> O alojamento dispõe de
            quartos familiares com casas de banho privadas, cozinha partilhada e
            Wi-Fi gratuito. Inclui ainda sala comum, minimercado e churrasqueira.
          </p>

          <p>
            <strong>Convenient Facilities:</strong> Estacionamento gratuito no
            local, máquina de lavar roupa, pátio e área de piquenique. O serviço
            de limpeza garante uma estadia confortável.
          </p>

          <p>
            <strong>Nearby Attractions:</strong> A Praia do Fragosinho fica a
            poucos passos, enquanto o Aeroporto Francisco Sá Carneiro está a
            cerca de 23 km. A zona é ideal para surf.
          </p>

          <p className="italic text-sm text-gray-500">
            Casais classificaram a localização com <strong>9.8</strong> para
            viagens a dois.
          </p>
        </div>
      </section>

      {/* COMODIDADES */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Comodidades mais populares
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Facility icon={<Wifi />} label="Wi-Fi gratuito" />
          <Facility icon={<Car />} label="Estacionamento gratuito" />
          <Facility icon={<Home />} label="Em frente à praia" />
          <Facility icon={<Users />} label="Quartos familiares" />
          <Facility icon={<Ban />} label="Quartos para não fumadores" />
        </div>
      </section>

      {/* CONTACTOS */}
      <section className="bg-white rounded-2xl shadow p-10 space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Contactos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TELEFONE */}
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-xl">
              <Phone className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <a
                href="tel:+351962365756"
                className="text-lg font-medium text-gray-800 hover:text-emerald-600"
              >
                +351 962 365 756
              </a>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-xl">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a
                href="mailto:casafragosa@gmail.com"
                className="text-lg font-medium text-gray-800 hover:text-emerald-600"
              >
                casafragosa@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* COMPONENTE AUXILIAR */
function Facility({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-5 shadow-sm">
      <div className="text-emerald-600">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}
