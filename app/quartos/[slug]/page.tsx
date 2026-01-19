import NextImage from 'next/image';
import RoomCalendar from '../../components/RoomCalendar';

const rooms = {
  dormitorio: {
    name: 'Dormitório',
    price: '15€ / noite',
    capacity: 'Até 9 pessoas',
    description:
      'Quarto partilhado com 9 camas, casa de banho e cozinha partilhadas.',
    images: ['/dormitorio.jpg', '/dormitorio.jpg', '/dormitorio.jpg'],
  },
  suite: {
    name: 'Quarto Suite',
    price: '80€ / noite',
    capacity: 'Até 4 pessoas',
    description:
      'Suite com 1 cama de casal, 2 individuais, casa de banho privada e acesso à cozinha.',
    images: ['/suite.jpg', '/suite.jpg', '/suite.jpg'],
  },
  estudio: {
    name: 'Estúdio',
    price: '100€ / noite',
    capacity: 'Até 5 pessoas',
    description:
      'Estúdio totalmente equipado com cozinha privada e casa de banho.',
    images: ['/estudio.jpg', '/estudio.jpg', '/estudio.jpg'],
  },
  t2: {
    name: 'T2',
    price: '120€ / noite',
    capacity: 'Até 4 pessoas',
    description:
      'Apartamento T2 com sala, cozinha equipada e dois quartos.',
    images: ['/t2.jpg', '/t2.jpg', '/t2.jpg'],
  },
};

// **OBS:** async porque vamos poder buscar reservas
export default async function QuartoPage({
  params,
}: {
  params: { slug: keyof typeof rooms } | Promise<{ slug: keyof typeof rooms }>;
}) {
  // Se params for Promise, resolvemos
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const room = rooms[slug];

  if (!room) return <p>Quarto não encontrado.</p>;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{room.name}</h1>
        <p className="text-emerald-600 font-medium">
          {room.capacity} · {room.price}
        </p>
        <p className="text-gray-600 max-w-3xl">{room.description}</p>
      </header>

      {/* Galeria */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {room.images.map((img, i) => (
          <div
            key={i}
            className="relative h-56 rounded-xl overflow-hidden bg-gray-200"
          >
            <NextImage src={img} alt={`${room.name} ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </section>

      {/* Calendário */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Disponibilidade</h2>
        <RoomCalendar quarto={slug} />
      </section>

      {/* CTA */}
      <div>
        <a
          href="/contactos"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          Pedir disponibilidade
        </a>
      </div>
    </div>
  );
}
