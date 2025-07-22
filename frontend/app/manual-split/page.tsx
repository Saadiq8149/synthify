import { Breadcrumb } from "@/components/breadcrumb"
import { Search, Upload, Play, Download, Music, Mic, Clock } from "lucide-react"

export default function ManualSplitPage() {
  return (
    <div className="p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Manual Split" }]} />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Manual Split</h1>
          <p className="text-[var(--muted)] text-lg">
            Split or download single songs manually by searching or uploading your own files
          </p>
        </header>

        <InputSection />
        <SearchResults />
      </div>
    </div>
  )
}

function InputSection() {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Input */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-[var(--accent)]" />
            Search Tracks
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search for songs, artists, or albums..."
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <button className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] py-3 rounded-lg font-semibold transition-colors">
              Search Tracks
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[var(--accent)]" />
            Upload Audio File
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[var(--accent)] transition-colors">
              <Upload className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
              <p className="text-[var(--muted)] mb-2">Drag and drop your audio file here</p>
              <p className="text-sm text-[var(--muted)] mb-4">Supports MP3, WAV, FLAC files up to 50MB</p>
              <label className="inline-flex items-center gap-2 bg-[var(--bg)] hover:bg-[var(--border)] px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Choose File
                <input type="file" accept="audio/*" className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SearchResults() {
  const searchResults = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      image: "🌟",
      available: true,
    },
    {
      id: 2,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "2:54",
      image: "🍉",
      available: true,
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      image: "✨",
      available: false,
    },
    {
      id: 4,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      image: "💜",
      available: true,
    },
    {
      id: 5,
      title: "Stay",
      artist: "The Kid LAROI & Justin Bieber",
      album: "F*CK LOVE 3",
      duration: "2:21",
      image: "🎤",
      available: true,
    },
    {
      id: 6,
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      duration: "3:58",
      image: "🌊",
      available: false,
    },
  ]

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <div className="text-sm text-[var(--muted)]">{searchResults.length} results found</div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] text-sm text-[var(--muted)] font-medium">
          <div className="col-span-1"></div>
          <div className="col-span-5">Track</div>
          <div className="col-span-2">Album</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-2">Actions</div>
        </div>

        {searchResults.map((track) => (
          <div
            key={track.id}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-b-0"
          >
            <div className="col-span-1">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center text-lg">
                {track.image}
              </div>
            </div>
            <div className="col-span-5">
              <h3 className="font-medium truncate">{track.title}</h3>
              <p className="text-sm text-[var(--muted)] truncate">{track.artist}</p>
            </div>
            <div className="col-span-2 text-[var(--muted)] truncate">{track.album}</div>
            <div className="col-span-2 text-[var(--muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {track.duration}
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <button className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors">
                <Play className="w-4 h-4" />
              </button>
              {track.available ? (
                <>
                  <button className="flex items-center gap-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-3 h-3" />
                    Split
                  </button>
                </>
              ) : (
                <span className="text-xs text-[var(--muted)] bg-[var(--bg)] px-2 py-1 rounded-full">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {searchResults.map((track) => (
          <div key={track.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                {track.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{track.title}</h3>
                <p className="text-sm text-[var(--muted)] truncate">{track.artist}</p>
                <p className="text-xs text-[var(--muted)] truncate">{track.album}</p>
              </div>
              <div className="text-xs text-[var(--muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {track.duration}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors">
                <Play className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {track.available ? (
                  <>
                    <button className="flex items-center gap-1 bg-[var(--bg)] hover:bg-[var(--border)] px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <Mic className="w-3 h-3" />
                      Vocals
                    </button>
                    <button className="flex items-center gap-1 bg-[var(--bg)] hover:bg-[var(--border)] px-3 py-1.5 rounded-lg text-sm transition-colors">
                      <Music className="w-3 h-3" />
                      Music
                    </button>
                    <button className="flex items-center gap-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      <Download className="w-3 h-3" />
                      Split
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-[var(--muted)] bg-[var(--bg)] px-2 py-1 rounded-full">Unavailable</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
