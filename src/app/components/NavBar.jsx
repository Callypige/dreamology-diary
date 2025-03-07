import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full fixed top-0 left-0 bg-black shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
                <Link href="/" className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300">
                        DreamologyTools
                    </span>
                </Link>

                <Link 
                    href="/addDream"
                    className="bg-pink-500 text-white px-6 py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-300"
                >
                    + Add Dream
                </Link>
            </div>
        </nav>
    );
}
