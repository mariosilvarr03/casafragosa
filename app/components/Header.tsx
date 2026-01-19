export default function Header() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="hover:text-emerald-500"><h1 className="text-xl font-bold text-emerald-600">Casa Fragosa 🏡</h1></a>
        <nav className="space-x-4">
          <a href="/" className="hover:text-emerald-500">Home</a>
          <a href="/quartos" className="hover:text-emerald-500">Quartos</a>
          <a href="/galeria" className="hover:text-emerald-500">Galeria</a>
          <a href="/sobre" className="hover:text-emerald-500">Sobre</a>
          <a href="/regras" className="hover:text-emerald-500">Regras</a>
          <a href="/faq" className="hover:text-emerald-500">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
