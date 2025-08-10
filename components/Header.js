import Link from 'next/link';

export default function Header({ name }) {
  return (
    <header className="pt-20 pb-12">
      <div className="flex justify-between items-center mb-12">
        <p className="text-xl leading-7 text-gray-700 dark:text-gray-300">
          {name}
        </p>
        <nav className="flex gap-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Home
          </Link>
          <Link href="/generate" className="text-blue-600 dark:text-blue-400 hover:underline">
            AI Generator
          </Link>
        </nav>
      </div>
    </header>
  );
}