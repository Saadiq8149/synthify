"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { Download, ExternalLink, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { BASE_BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SpotifyPlaylistsPage() {
  const [playlists, setPlaylists] = useState<
    { id: string; name: string; owner: string; url: string; status: string }[]
  >([]);
  const [downloadingPlaylist, setDownloadingPlaylist] = useState<string | null>(
    null
  );

  useEffect(() => {
    axios.get(BASE_BACKEND_URL + "spotify_playlists").then(function (response) {
      if (response.status == 200) {
        setPlaylists(response.data);
      }
    });
  }, [downloadingPlaylist]);

  useEffect(() => {
    axios.get(BASE_BACKEND_URL + "download_status").then(function (response) {
      if (response.status == 200 && response.data.status == "downloading") {
        setDownloadingPlaylist(response.data.name);

        const interval = setInterval(() => {
          axios
            .get(BASE_BACKEND_URL + "download_status")
            .then(function (response) {
              if (
                response.status == 200 &&
                response.data.status == "completed"
              ) {
                setDownloadingPlaylist(null);
                clearInterval(interval);
              }
            });
        }, 2000);
      }
    });
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Spotify Playlists" }]}
      />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Your Spotify Playlists
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Browse and download your Spotify playlists for vocal and music
            separation
          </p>
          <NowDownloading playlistName={downloadingPlaylist} />
        </header>

        <SearchBar />
        <PlaylistsGrid
          playlists={playlists}
          setDownloadingPlaylist={setDownloadingPlaylist}
        />
      </div>
    </div>
  );
}

function NowDownloading({ playlistName }: { playlistName: string | null }) {
  return (
    <aside className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 h-fit mt-4 shadow-sm transition-all">
      <h2 className="text-xl font-bold mb-6 text-[var(--text)]">
        Now Downloading
      </h2>

      {playlistName ? (
        <div className="space-y-4">
          <div>
            <span className="text-sm text-[var(--muted)]">Playlist:</span>
            <div className="text-lg font-semibold text-[var(--text)] mt-1 truncate">
              {playlistName}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-yellow-400">
            <span className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span>Downloading...</span>
            <Loader2 className="animate-spin w-4 h-4 text-yellow-400" />
          </div>
        </div>
      ) : (
        <div className="text-sm text-[var(--muted)] italic">
          No active downloads
        </div>
      )}
    </aside>
  );
}

function SearchBar() {
  return (
    <div className="mb-8">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search your playlists..."
          className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
    </div>
  );
}

function PlaylistsGrid(props: {
  playlists: {
    id: string;
    name: string;
    owner: string;
    url: string;
    status: string;
  }[];
  setDownloadingPlaylist: any;
}) {
  var playlists = props.playlists;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Split":
        return "bg-green-500/20 text-green-400";
      case "Downloaded":
        return "bg-blue-500/20 text-blue-400";
      case "Downloading":
        return "bg-yellow-500/20 text-yellow-400";
      case "Splitting":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  function handleDownload(url: string, playlistName: string) {
    axios
      .post(BASE_BACKEND_URL + "download", {
        url: url,
        playlist_name: playlistName,
      })
      .then(function (response) {
        if (response.status == 200) {
          props.setDownloadingPlaylist(playlistName);
          const interval = setInterval(() => {
            axios
              .get(BASE_BACKEND_URL + "download_status")
              .then(function (response) {
                if (
                  response.status == 200 &&
                  response.data.status == "completed"
                ) {
                  props.setDownloadingPlaylist(null);
                  clearInterval(interval);
                }
              });
          }, 2000);
        } else {
          alert("Downloading failed, Try again");
        }
      });
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">All Playlists</h2>
        <div className="text-sm text-[var(--muted)]">
          {playlists.length} playlists found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)] transition-colors group"
          >
            {/* Playlist Image */}
            {/* <div className="w-full aspect-square bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center text-4xl mb-4">
              {playlist.image}
            </div> */}

            {/* Playlist Info */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-[var(--accent)] transition-colors">
                {playlist.name}
              </h3>
            </div>
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  playlist.status
                )}`}
              >
                {playlist.status}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={playlist.url}
                  target="_blank"
                  className="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors cursor-pointer"
                  title="View on Spotify"
                >
                  <ExternalLink className="w-4 h-4 text-[var(--muted)]" />
                </a>
                {playlist.status == "Spotify" ? (
                  <button
                    onClick={() => {
                      handleDownload(playlist.url, playlist.name);
                    }}
                    className="flex items-center gap-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                ) : (
                  <Link
                    href={"/playlist/" + playlist.name}
                    className="flex items-center gap-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
