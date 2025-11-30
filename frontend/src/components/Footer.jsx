export default function Footer() {
    return (
      <footer className="
          w-full
          bg-gradient-to-r from-blue-500 to-sky-400
          text-white text-center
          py-4
        "
      >
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Copyright – Acne Detection
        </p>
      </footer>
    );
  }