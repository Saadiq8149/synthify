"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import axios from "axios";
import {
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Music,
  Mic,
  Download,
  MoreHorizontal,
  ProportionsIcon,
  Loader2,
  Pause,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BASE_BACKEND_URL } from "@/lib/constants";

function secondsToHms(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins ") : "";
  return hDisplay + mDisplay;
}

export default function PlaylistDetailPage() {
  const [playlistDetails, setPlaylistDetails] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songMode, setSongMode] = useState("All");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [splitStatus, setSplitStatus] = useState<
    "unsplit" | "splitting" | "split"
  >("unsplit");
  const [splitCount, setSplitCount] = useState(0);
  const [songPaused, setSongPaused] = useState(true);

  const handlePlaySong = (song: any, index: number, mode = songMode) => {
    song.index = index;
    switch (mode) {
      case "All":
        song.audio_url =
          BASE_BACKEND_URL +
          `play_playlist_normal?playlist_name=${encodeURIComponent(
            playlistDetails.name
          )}&file_name=${encodeURIComponent(song.file_name)}`;
        break;
      case "Vocals":
        song.audio_url =
          BASE_BACKEND_URL +
          `play_playlist_vocals?playlist_name=${encodeURIComponent(
            playlistDetails.name
          )}&file_name=${encodeURIComponent(song.file_name)}`;
        break;
      case "Music":
        song.audio_url =
          BASE_BACKEND_URL +
          `play_playlist_music?playlist_name=${encodeURIComponent(
            playlistDetails.name
          )}&file_name=${encodeURIComponent(song.file_name)}`;
        break;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setSongPaused(false);
    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  };

  function handleSplit() {
    axios
      .get(BASE_BACKEND_URL + "split_status", {
        params: { playlist_name: playlistDetails.name },
      })
      .then((response) => {
        const { status, split } = response.data;
        if (status == "unsplit") {
          axios
            .post(BASE_BACKEND_URL + "split", {
              playlist_name: playlistDetails.name,
            })
            .then(function (response) {
              if (response.status == 200) {
                const interval = setInterval(() => {
                  axios
                    .get(BASE_BACKEND_URL + "split_status", {
                      params: { playlist_name: playlistDetails.name },
                    })
                    .then((response) => {
                      const { status, split } = response.data;
                      setSplitStatus(status);
                      if (status === "splitting" && typeof split === "number") {
                        setSplitCount(split);
                      }

                      if (status === "split") {
                        clearInterval(interval);
                      }
                    })
                    .catch((err) => {
                      console.error("Error fetching split status:", err);
                    });
                }, 4000);
              }
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching split status:", err);
      });
  }

  const closePlayer = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  useEffect(() => {
    if (!playlistDetails?.name) return;

    const fetchStatus = () => {
      axios
        .get(BASE_BACKEND_URL + "split_status", {
          params: { playlist_name: playlistDetails.name },
        })
        .then((response) => {
          const { status, split } = response.data;
          setSplitStatus(status);
          if (status === "splitting" && typeof split === "number") {
            setSplitCount(split);
          }

          if (status === "split" || status == "unsplit") {
            clearInterval(interval);
          }
        })
        .catch((err) => {
          console.error("Error fetching split status:", err);
        });
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [playlistDetails?.name]);

  useEffect(() => {
    var playlistName: string = window.location.href;
    playlistName = playlistName.split("/").pop() || "";
    playlistName = playlistName.replaceAll("%20", " ");
    axios
      .post(BASE_BACKEND_URL + "playlist", {
        name: playlistName,
      })
      .then(function (response) {
        if (response.status == 200) {
          setPlaylistDetails(response.data);
          console.log(response.data);
        }
      });
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Playlists", href: "/playlists" },
          { label: "My Chill Vibes" },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <PlaylistHeader
          name={playlistDetails?.name}
          tracks={playlistDetails?.songs?.length}
          duration={secondsToHms(playlistDetails?.duration)}
          image={playlistDetails?.songs[0]?.image}
          handlePlay={() => handlePlaySong(playlistDetails.songs[0], 0)}
          handleSplit={handleSplit}
          splitStatus={splitStatus}
        />

        {splitStatus === "splitting" && (
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-400 mb-4">
            <span className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full"></span>
            <span>
              Splitting {splitCount} / {playlistDetails?.songs?.length}...
            </span>
            <Loader2 className="animate-spin w-4 h-4 text-yellow-400" />
          </div>
        )}

        {splitStatus === "unsplit" && (
          <div className="text-sm text-gray-400 mb-4">
            Vocals & Music not yet split.
          </div>
        )}

        {splitStatus === "split" && (
          <div className="text-sm text-green-400 mb-4">
            ✅ All tracks split!
          </div>
        )}
        <SongsList
          songs={playlistDetails?.songs}
          handlePlaySong={handlePlaySong}
        />
      </div>
      {currentSong && isPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white text-3xl font-light"
            onClick={closePlayer}
          >
            ×
          </button>

          {/* Album Art */}
          <img
            src={currentSong.image}
            alt="album"
            className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-lg mb-6"
          />

          {/* Title + Artist */}
          <div className="text-center mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {currentSong.name}
            </h3>
            <p className="text-md text-[var(--muted)]">{currentSong.artist}</p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-6 mb-6">
            <button
              className="p-3"
              onClick={() => {
                if (currentSong.index != 0) {
                  handlePlaySong(
                    playlistDetails.songs[currentSong.index - 1],
                    currentSong.index - 1
                  );
                }
              }}
            >
              <SkipBack className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => {
                if (audioRef.current?.paused) {
                  audioRef.current?.play();
                  setSongPaused(false);
                } else {
                  audioRef.current?.pause();
                  setSongPaused(true);
                }
              }}
              className="p-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full transition"
            >
              {songPaused ? (
                <Play className="w-7 h-7 text-white" />
              ) : (
                <Pause className="w-7 h-7 text-white" />
              )}
            </button>
            <button
              className="p-3"
              onClick={() => {
                if (currentSong.index != playlistDetails.songs.length - 1) {
                  handlePlaySong(
                    playlistDetails.songs[currentSong.index + 1],
                    currentSong.index + 1
                  );
                }
              }}
            >
              <SkipForward className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Mode Selection */}
          {splitStatus == "split" && (
            <div className="flex justify-center gap-3 mb-4">
              <button
                onClick={() => {
                  setSongMode("All");
                  handlePlaySong(currentSong, currentSong.index, "All");
                }}
                className={`px-4 py-2 ${
                  songMode == "All" ? "bg-[var(--accent)]" : "bg-[var(--bg)]"
                } text-white rounded-lg`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setSongMode("Vocals");
                  handlePlaySong(currentSong, currentSong.index, "Vocals");
                }}
                className={`px-4 py-2 ${
                  songMode == "Vocals" ? "bg-[var(--accent)]" : "bg-[var(--bg)]"
                } text-white rounded-lg`}
              >
                Vocals
              </button>
              <button
                onClick={() => {
                  setSongMode("Music");
                  handlePlaySong(currentSong, currentSong.index, "Music");
                }}
                className={`px-4 py-2 ${
                  songMode == "Music" ? "bg-[var(--accent)]" : "bg-[var(--bg)]"
                } text-white rounded-lg`}
              >
                Music
              </button>
            </div>
          )}

          {/* Volume Slider */}
          <div className="w-full max-w-sm mb-6">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              className="w-full"
              onChange={(e) => {
                if (audioRef.current)
                  audioRef.current.volume = parseFloat(e.target.value);
              }}
            />
          </div>

          {/* Shuffle & Loop */}
          {/* <div className="flex items-center gap-4">
            <button className="text-white hover:text-[var(--accent)]">
              <Shuffle className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-[var(--accent)]">
              <Repeat className="w-5 h-5" />
            </button>
          </div> */}

          {/* Hidden audio element */}
          <audio ref={audioRef} src={currentSong.audio_url} hidden autoPlay />
        </div>
      )}
    </div>
  );
}

function PlaylistHeader(props: {
  name: string;
  tracks: number;
  duration: string;
  image: string;
  handleSplit: any;
  handlePlay: any;
  splitStatus: string;
}) {
  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-64 h-64 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl flex items-center justify-center">
          <img src={props.image}></img>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{props.name}</h1>
          <p className="text-[var(--muted)] text-lg mb-4">
            {props.tracks} tracks • {props.duration}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={props.handlePlay}
              className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play className="w-5 h-5" />
              Play All
            </button>
            {props.splitStatus != "split" && (
              <button
                onClick={props.handleSplit}
                className="flex items-center gap-2 bg-[var(--highlight)] hover:bg-[var(--highlight)]/80 text-[var(--bg)] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Music className="w-5 h-5" />
                Split All Tracks
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function SongsList(props: {
  songs: { name: string; artist: string; duration: number; image: string }[];
  handlePlaySong: any;
}) {
  const songs = props.songs;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tracks</h2>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[var(--card-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-5 border-b border-[var(--border)] text-sm text-[var(--muted)] font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-3">Actions</div>
        </div>

        {songs?.map((song, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-b-0"
          >
            <div className="col-span-1 text-[var(--muted)]">{index + 1}</div>
            <div className="col-span-6 flex items-center gap-4">
              <img
                src={song.image || "/default-cover.png"}
                alt={song.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-medium text-base truncate">{song.name}</h3>
                <p className="text-sm text-[var(--muted)] truncate">
                  {song.artist}
                </p>
              </div>
            </div>
            <div className="col-span-2 text-[var(--muted)] text-sm">
              {secondsToHms(song.duration)}
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <button
                className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors"
                onClick={() => props.handlePlaySong(song, index)}
              >
                <Play className="w-5 h-5" />
              </button>

              <button className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-5">
        {songs?.map((song, index) => (
          <div
            key={index}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5"
          >
            <div className="flex gap-4 items-center mb-4">
              <img
                src={song.image || "/default-cover.png"}
                alt={song.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base truncate">{song.name}</h3>
                <p className="text-sm text-[var(--muted)] truncate">
                  {song.artist}
                </p>
              </div>
              <span className="text-sm text-[var(--muted)]">
                {secondsToHms(song.duration)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 hover:bg-[var(--card-bg)] rounded-lg transition-colors"
                  onClick={() => props.handlePlaySong(song, index)}
                >
                  <Play className="w-5 h-5" />
                </button>
              </div>
              <button className="p-2 hover:bg-[var(--bg)] rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
