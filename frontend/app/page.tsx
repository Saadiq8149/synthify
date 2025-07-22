"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { Play, Download, Music, Mic } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_BACKEND_URL } from "@/lib/constants"

export default function HomePage() {
  const [hasLastPlaylist, setHasLastPlaylist] = useState<boolean>(false)
  const [lastPlaylistData, setLastPlaylistData] = useState<{name: string, songs: number}>({name: "None", songs: 0})

  useEffect(() => {
    axios.get(BASE_BACKEND_URL + "home_playlist").then(
      function(response) {
        if (response.status == 200 && response.data != null) {
          setHasLastPlaylist(true)
          setLastPlaylistData(response.data)
        }
      }
    )
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <Breadcrumb items={[{ label: "Home" }]} />

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome to <span className="text-[var(--accent)]">Synthify</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">Split vocals and music from your favorite Spotify playlists</p>
        </header>

        {hasLastPlaylist ? <LastPlaylistCard name={lastPlaylistData.name} songs={lastPlaylistData.songs}/>: <GetStartedCard />}

        <FeaturesGrid />
      </div>
    </div>
  )
}

function LastPlaylistCard(props: {name: string, songs: number}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Recently Downloaded</h2>
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center">
            <Music className="w-16 h-16 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{props.name}</h3>
            <p className="text-[var(--muted)] mb-4">{props.songs} tracks</p>


            <Link
              href={"/playlist/" + props.name} 
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
            >
              View Full Playlist →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function GetStartedCard() {
  return (
    <section className="mb-12">
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 lg:p-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Download className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Split Your Music?</h2>
        <p className="text-[var(--muted)] text-lg mb-8 max-w-2xl mx-auto">
          Connect your Spotify account and start separating vocals from instrumentals in your favorite playlists.
        </p>

        <Link
          href="/spotify-playlists"
          className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          Get Started
        </Link>
      </div>
    </section>
  )
}

function FeaturesGrid() {
  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: "High-Quality Separation",
      description: "Advanced AI algorithms for crystal-clear vocal and instrumental separation",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Batch Processing",
      description: "Process entire playlists at once and download all tracks together",
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Instant Playback",
      description: "Preview separated tracks instantly before downloading",
    },
  ]

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Why Choose Synthify?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)] transition-colors"
          >
            <div className="text-[var(--accent)] mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-[var(--muted)]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
