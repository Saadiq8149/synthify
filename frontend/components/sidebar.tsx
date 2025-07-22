import Link from "next/link"
import { Home, Music, Download, Menu, X, Upload } from "lucide-react"

export function Sidebar() {
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <label htmlFor="mobile-menu" className="cursor-pointer">
          <input type="checkbox" id="mobile-menu" className="hidden peer" />
          <Menu className="w-6 h-6 text-[var(--text)] peer-checked:hidden" />
          <X className="w-6 h-6 text-[var(--text)] hidden peer-checked:block" />

          {/* Mobile sidebar overlay */}
          <div className="fixed inset-0 bg-black/50 hidden peer-checked:block" />

          {/* Mobile sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--border)] transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 z-40">
            <SidebarContent />
          </aside>
        </label>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--border)] z-30">
        <SidebarContent />
      </aside>
    </>
  )
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/playlists", icon: Music, label: "Playlists" },
  { href: "/spotify-playlists", icon: Music, label: "Spotify Playlists" },
  { href: "/manual-split", icon: Upload, label: "Manual Split" },
  { href: "/downloads", icon: Download, label: "Downloads" },
]

function SidebarContent() {
  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--accent)]">Synthify</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Music & Vocals Splitter</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg)] transition-colors group"
              >
                <item.icon className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)]" />
                <span className="group-hover:text-[var(--text)]">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] text-center">© 2024 Synthify</p>
      </div>
    </div>
  )
}
