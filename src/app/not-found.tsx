import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden text-black">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6 text-center">
        <p className="mt-6 text-8xl font-semibold tracking-wide text-orange-400 uppercase">
          404
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          This page was not found
        </h1>

        <div className="mt-10">
          <Link
            href="/"
            className="text-md mb-1 rounded-md bg-black px-8 py-4 font-bold text-white transition duration-300 hover:bg-orange-600"
          >
            HOME
          </Link>
        </div>
      </div>
    </main>
  )
}
