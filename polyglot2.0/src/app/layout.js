import './globals.css';
import '../styles/globals.scss';

export const metadata = {
  title: 'Polyglot | Gestão Acadêmica',
  description: 'Sistema de gestão acadêmica para cursos de idiomas'
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
