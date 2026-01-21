import NextImage from 'next/image';

export default function QuartosPage() {
  return (
    <div className="space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Os nossos quartos
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Conheça as diferentes opções de alojamento disponíveis,
          adaptadas a vários tipos de estadia.
        </p>
      </header>

      <div className="space-y-12">
        <RoomCard
          title="Dormitório"
          image="/dormitorio.jpg"
          capacity="Até 8 pessoas"
          description="Quarto partilhado com 8 camas, casa de banho partilhada e acesso a cozinha partilhada."
          features={[
            '8 camas individuais',
            'Casa de banho partilhada',
            'Cozinha partilhada',
          ]}
          link="/quartos/dormitorio"
        />

        <RoomCard
          title="Quarto Suite"
          image="/suite.jpg"
          capacity="Até 4 pessoas"
          description="Suite confortável com 1 cama de casal e 2 camas individuais, casa de banho privada e acesso à cozinha do dormitório."
          features={[
            '1 cama de casal',
            '2 camas individuais',
            'Casa de banho privada',
          ]}
          link="/quartos/suite"
        />

        <RoomCard
          title="Estúdio"
          image="/estudio.jpg"
          capacity="Até 5 pessoas"
          description="Estúdio totalmente equipado com cozinha privada, ideal para famílias ou grupos."
          features={[
            '1 cama de casal',
            '3 camas individuais',
            'Cozinha privada',
            'Casa de banho privada',
          ]}
          link="/quartos/estudio"
        />

        <RoomCard
          title="T2"
          image="/t2.jpg"
          capacity="Até 4 pessoas"
          description="Apartamento T2 com sala, cozinha equipada e dois quartos independentes."
          features={[
            '1 quarto com cama de casal',
            '1 quarto com 2 camas individuais',
            'Sala',
            'Cozinha equipada',
            'Casa de banho',
          ]}
          link="/quartos/t2"
        />
      </div>
    </div>
  );
}

/* COMPONENTE AUXILIAR */
function RoomCard({
  title,
  image,
  capacity,
  description,
  features,
  link,
}: {
  title: string;
  image: string;
  capacity: string;
  description: string;
  features: string[];
  link: string;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-200">
        <NextImage
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-emerald-600 font-medium">{capacity}</p>
        <p className="text-gray-600">{description}</p>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <a
          href={link}
          className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Ver quarto →
        </a>
      </div>
    </section>
  );
}
