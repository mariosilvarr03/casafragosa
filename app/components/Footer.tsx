export default function Footer() {
  return (
    <footer className="bg-white shadow-inner p-4 mt-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Alojamento Local. Todos os direitos reservados.
    </footer>
  );
}
