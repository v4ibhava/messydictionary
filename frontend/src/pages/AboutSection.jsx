export default function AboutSection() {
  return (
    <section 
    id="about"
    className="relative z-10 bg-neutral-950 text-neutral-200 px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Messy Dictionary 📖
          </h2>
          <p className="text-neutral-400 text-lg">
            A playful, community-driven slang dictionary
          </p>
        </div>

        {/* What is this */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">✨ What is this project?</h3>
          <p className="text-neutral-300 leading-relaxed">
            Messy Dictionary is a <strong>fun, parody-style dictionary</strong> where people
            can add and explore <strong>local, regional, or informal words</strong> that
            usually never make it into traditional dictionaries.
          </p>
          <p className="text-neutral-300 leading-relaxed">
            It’s not about being academically correct — it’s about documenting the
            words people <em>actually use</em> in daily life: street slang, inside jokes,
            regional phrases, and informal expressions.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">🚀 Features</h3>
          <ul className="grid sm:grid-cols-2 gap-3 text-neutral-300">
            <li>🔍 Search for words</li>
            <li>💡 Live suggestions while typing</li>
            <li>➕ Add new words with meanings</li>
            <li>🌍 Support for multiple languages & slang</li>
            <li>🎨 Playful UI with animations</li>
            <li>
    ✍️ Add missing words by dragging{" "}
    <span className="text-[#D1855C] font-semibold">MY</span> down
  </li>
          </ul>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">📌 How it works</h3>
          <ol className="list-decimal list-inside space-y-2 text-neutral-300">
            <li>Users search for a word</li>
            <li>The app fetches definitions from the backend</li>
            <li>If a word doesn’t exist, users can add it themselves</li>
            <li>Suggestions help discover similar words</li>
          </ol>
          <p className="text-neutral-400 text-sm">
            No login. No restrictions. Just fun contributions.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">🛠️ Tech Stack</h3>

          <div className="grid sm:grid-cols-2 gap-6 text-neutral-300">
            <div>
              <h4 className="font-semibold mb-2">Frontend</h4>
              <ul className="space-y-1">
                <li>• React (Vite)</li>
                <li>• Tailwind CSS</li>
                <li>• Framer Motion</li>
                <li>• Axios</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Backend</h4>
              <ul className="space-y-1">
                <li>• Node.js</li>
                <li>• Express</li>
                <li>• MongoDB (Atlas)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">💡 Why this project?</h3>
          <p className="text-neutral-300 leading-relaxed">
            This project was built to experiment with full-stack deployment, explore
            playful UX/UI ideas, and capture real-world language usage — while building
            something more fun than a generic CRUD app.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-900">
          <h3 className="text-xl font-semibold mb-2">⚠️ Disclaimer</h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            This is a community-driven and informal dictionary. Definitions may be
            humorous, exaggerated, or region-specific and are not meant to be
            linguistically authoritative.
          </p>
        </div>

        {/* Contribution */}
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-semibold">📬 Contributions</h3>
          <p className="text-neutral-300">
            Feel free to fork the project, suggest improvements, or add new ideas.
            This project is intentionally simple and open.
          </p>
          <p className="text-neutral-400 text-sm">
            Built with curiosity and fun ✨
          </p>
        </div>

      </div>
    </section>
  )
}
