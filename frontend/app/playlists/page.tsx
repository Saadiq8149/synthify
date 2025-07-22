import { Breadcrumb } from "@/components/breadcrumb"
import { Music, ExternalLink, Play } from "lucide-react"

export default function PlaylistsPage() {
  return (
    <div className="p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Playlists" }]} />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Your Playlists</h1>
          <p className="text-[var(--muted)] text-lg">
            Select a playlist from Spotify to start splitting vocals and music
          </p>
        </header>

        <div className="mb-8">
          <label htmlFor="spotify-modal" className="cursor-pointer">
            <input type="checkbox" id="spotify-modal" className="hidden peer" />

            <button className="flex items-center gap-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 rounded-lg font-semibold transition-colors">
              <Music className="w-5 h-5" />
              Get Playlists from Spotify
            </button>

            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black/50 hidden peer-checked:flex items-center justify-center z-50 p-4">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <SpotifyPlaylistModal />
              </div>
            </div>
          </label>
        </div>

        <RecentPlaylists />
      </div>
    </div>
  )
}

function SpotifyPlaylistModal() {
  const playlists = [
    { id: 1, name: "My Chill Vibes", tracks: 32, image: "🎵", description: "Perfect for relaxing" },
    { id: 2, name: "Workout Hits", tracks: 45, image: "💪", description: "High energy tracks" },
    { id: 3, name: "Road Trip Mix", tracks: 28, image: "🚗", description: "Songs for the journey" },
    { id: 4, name: "Late Night Jazz", tracks: 19, image: "🎷", description: "Smooth jazz collection" },
    { id: 5, name: "Pop Favorites", tracks: 67, image: "⭐", description: "Top pop hits" },
    { id: 6, name: "Indie Discoveries", tracks: 41, image: "🎸", description: "Hidden indie gems" },
  ]

  return (
    <>
      {/* Modal Header */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Select Spotify Playlist</h2>
          <label htmlFor="spotify-modal" className="cursor-pointer text-[var(--muted)] hover:text-[var(--text)]">
            ✕
          </label>
        </div>
        <p className="text-[var(--muted)] mt-2">Choose a playlist to split vocals and music</p>
      </div>

      {/* Modal Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center gap-4 p-4 bg-[var(--bg)] hover:bg-[var(--border)] rounded-lg cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center text-xl">
                {playlist.image}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate group-hover:text-[var(--accent)]">{playlist.name}</h3>
                <p className="text-sm text-[var(--muted)] truncate">
                  {playlist.tracks} tracks • {playlist.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-[var(--muted)]" />
                </button>
                <button className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors">
                  <Play className="w-4 h-4 text-[var(--accent)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="flex justify-between items-center">
          <p className="text-sm text-[var(--muted)]">
            Connected to Spotify as <span className="text-[var(--text)]">user@example.com</span>
          </p>
          <label htmlFor="spotify-modal">
            <button className="px-4 py-2 bg-[var(--border)] hover:bg-[var(--muted)] rounded-lg transition-colors">
              Cancel
            </button>
          </label>
        </div>
      </div>
    </>
  )
}

function RecentPlaylists() {
  const recentPlaylists = [
    { name: "My Chill Vibes", tracks: 32, status: "completed", lastSplit: "2 hours ago" },
    { name: "Workout Hits", tracks: 45, status: "processing", lastSplit: "1 day ago" },
    { name: "Road Trip Mix", tracks: 28, status: "completed", lastSplit: "3 days ago" },
  ]

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Recently Processed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPlaylists.map((playlist, index) => (
          <div
            key={index}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  playlist.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {playlist.status}
              </span>
            </div>

            <h3 className="font-semibold mb-2 truncate">{playlist.name}</h3>
            <p className="text-[var(--muted)] text-sm mb-4">
              {playlist.tracks} tracks • Split {playlist.lastSplit}
            </p>

            <button className="w-full bg-[var(--bg)] hover:bg-[var(--border)] py-2 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
