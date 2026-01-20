import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative h-[70vh] rounded-2xl overflow-hidden">
        <Image
          src="/casafragosa.jpg"
          alt="Casa Fragosa - Alojamento Local"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Conteúdo */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo à Casa Fragosa
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Conforto, tranquilidade e uma experiência única para a sua estadia.
          </p>
          <a
            href="/sobre"
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-3 rounded-xl hover:bg-emerald-50 transition"
          >
            Reservar agora
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h3 className="text-3xl font-bold text-gray-800">
          Um espaço pensado para si
        </h3>
        <p className="text-gray-600 text-lg">
          O nosso alojamento oferece quartos confortáveis, totalmente equipados,
          numa localização ideal para relaxar e explorar a região.
        </p>
      </section>

      {/* QUARTOS */}
      <section className="space-y-8">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Os nossos quartos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Dormitório',
              desc: 'Quarto partilhado com 8 camas.',
              capacity: 'Até 8 pessoas',
              slug: 'dormitorio',
              image: '/dormitorio.jpg',
            },
            {
              title: 'Quarto Suite',
              desc: 'Cama de casal + 2 individuais.',
              capacity: 'Até 4 pessoas',
              slug: 'suite',
              image: '/suite.jpg',
            },
            {
              title: 'Estúdio',
              desc: 'Cama de casal + 3 individuais.',
              capacity: 'Até 5 pessoas',
              slug: 'estudio',
              image: '/estudio.jpg',
            },
            {
              title: 'T2',
              desc: 'Apartamento completo com 2 quartos.',
              capacity: 'Até 4 pessoas',
              slug: 't2',
              image: '/t2.jpg',
            },
          ].map((room, index) => (
            <Link
              key={index}
              href={`/quartos/${room.slug}`}
              className="group bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGEM */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* TEXTO */}
              <div className="p-5 space-y-2">
                <h4 className="text-lg font-semibold group-hover:text-emerald-600 transition">
                  {room.title}
                </h4>
                <p className="text-gray-600 text-sm">{room.desc}</p>
                <p className="text-sm text-emerald-600 font-medium">
                  {room.capacity}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/quartos"
            className="inline-block mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            Ver todos os quartos
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-emerald-50 rounded-2xl p-10 text-center space-y-4">
        <h3 className="text-3xl font-bold text-emerald-700">
          Pronto para reservar?
        </h3>
        <p className="text-gray-600 text-lg">
          Entre em contacto connosco e garanta a sua estadia.
        </p>
        <a
          href="/sobre"
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          Contactar
        </a>
      </section>
    </div>
  );
}
