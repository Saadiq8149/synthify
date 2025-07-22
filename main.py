from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from pathlib import Path
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
from mutagen.id3 import ID3, APIC
from split import split_playlist, split_song
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spotify, os, base64

home = Path.home()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_BASE_DIR = os.path.join(home, "synthify")
OUTPUT_DIRECTORY_PLAYLISTS = os.path.join(OUTPUT_BASE_DIR, "playlists") 
OUTPUT_DIRECTORY_SONGS = os.path.join(OUTPUT_BASE_DIR, "songs")
MODEL_NAME = "mdx_extra"


@app.on_event("startup")
async def startup_event():
    if not os.path.exists(OUTPUT_BASE_DIR):
        os.mkdir(OUTPUT_BASE_DIR)
        os.mkdir(OUTPUT_DIRECTORY_PLAYLISTS)
        os.mkdir(OUTPUT_DIRECTORY_SONGS)


@app.get("/")
async def root(): 
    return "Hello World"

import os

@app.get("/download_status")
def get_download_status():
    for playlist_name in os.listdir(OUTPUT_DIRECTORY_PLAYLISTS):
        playlist_path = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name)

        if not os.path.isdir(playlist_path):
            continue  # Skip if not a folder

        downloading_flag = os.path.join(playlist_path, ".downloading")
        downloaded_flag = os.path.join(playlist_path, ".downloaded")

        if os.path.exists(downloading_flag):
            return {"name": playlist_name, "status": "downloading"}
    
    return {"status": "completed"}

@app.get("/home_playlist")
async def get_home_playlist():
    for item in os.listdir(OUTPUT_DIRECTORY_PLAYLISTS):
        songs = 0
        for song in os.listdir(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, item)):
            if not os.path.isdir(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, item, song)):
                songs += 1
        return {"name": item, "songs": songs}
    else:
        return None


@app.get("/spotify_playlists")
async def get_spotify_playlists():
    sp = spotify.get_spotify_client()
    playlists = spotify.get_user_playlists(sp)

    for playlist in playlists:
        playlist_name = playlist["name"]
        playlist_path = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name)

        downloading_file = os.path.join(playlist_path, ".downloading")
        downloaded_file = os.path.join(playlist_path, ".downloaded")
        splitting_file = os.path.join(playlist_path, ".splitting")
        split_file = os.path.join(playlist_path, ".split")

        if os.path.exists(splitting_file):
            playlist["status"] = "Splitting"
        elif os.path.exists(split_file):
            playlist["status"] = "Split"
        elif os.path.exists(downloading_file):
            playlist["status"] = "Downloading"
        elif os.path.exists(downloaded_file):
            playlist["status"] = "Downloaded"
        else:
            playlist["status"] = "Spotify"

    return playlists


class DownloadRequest(BaseModel):
    url: str
    playlist_name: str

def download_playlist_background(url: str, playlist_name: str):
    spotify.download_playlist(url, os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name))
    playlist_dir = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name)
    os.makedirs(playlist_dir, exist_ok=True)

    os.remove(os.path.join(playlist_dir, ".downloading"))

    with open(os.path.join(playlist_dir, ".downloaded"), "w") as f:
        f.write("downloaded")
    

@app.post("/download")
async def post_download_playlist(data: DownloadRequest, background_tasks: BackgroundTasks):
    playlist_dir = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, data.playlist_name)
    os.makedirs(playlist_dir, exist_ok=True)

    with open(os.path.join(playlist_dir, ".downloading"), "w") as f:
        f.write("downloading")

    background_tasks.add_task(download_playlist_background, data.url, data.playlist_name)
    return "started downloading"


@app.post("/playlist")
async def get_playlist(data: dict):
    songs = []
    total_duration = 0
    for song in os.listdir(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, data["name"])):
        song_path = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, data["name"], song)
        if not os.path.isdir(song_path) and song_path.endswith(".mp3"):
            try:
                audio = MP3(song_path, ID3=EasyID3)
                id3_tags = ID3(song_path)

                song_name = audio.get("title", ["Unknown"])[0]
                artist = audio.get("artist", ["Unknown"])[0]
                duration = audio.info.length

                image_data_uri = None

                for tag in id3_tags.values():
                    if isinstance(tag, APIC):
                        image_data = tag.data
                        image_mime = tag.mime 
                        encoded = base64.b64encode(image_data).decode('utf-8')
                        image_data_uri = f"data:{image_mime};base64,{encoded}"
                        break

                songs.append({
                    "file_name": song,
                    "name": song_name,
                    "artist": artist,
                    "duration": duration,
                    "image": image_data_uri
                })

                total_duration += duration

            except Exception as e:
                print(f"Error reading {song_path}: {e}")
    return {"songs": songs, "duration": total_duration, "name": data["name"]} 

def split_playlist_background(playlist_name):
    split_playlist(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name), MODEL_NAME)
    playlist_dir = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name)
    os.makedirs(playlist_dir, exist_ok=True)

    os.remove(os.path.join(playlist_dir, ".splitting"))

    with open(os.path.join(playlist_dir, ".split"), "w") as f:
        f.write("split")

@app.get("/split_status")
def get_split_status(playlist_name: str):
    if os.path.exists(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, ".splitting")):
        songs = os.listdir(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, MODEL_NAME))
        return {"status": "splitting", "split": len(songs)}
    elif os.path.exists(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, ".split")):
        return {"status": "split"}
    else:
        return {"status": "unsplit"}
    
@app.post("/split")
async def post_split_playlist(data: dict, background_tasks: BackgroundTasks):
    playlist_dir = os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, data["playlist_name"])
    os.makedirs(playlist_dir, exist_ok=True)

    os.remove(os.path.join(playlist_dir, ".downloaded"))    

    with open(os.path.join(playlist_dir, ".splitting"), "w") as f:
        f.write("splitting")
    background_tasks.add_task(split_playlist_background, data["playlist_name"])
    return "started splitting"

@app.get("/play_playlist_normal")
async def get_play_normal(playlist_name: str, file_name: str):
    if os.path.isfile(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, file_name)):
        return FileResponse(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, file_name))

@app.get("/play_playlist_vocals")
async def get_play_normal(playlist_name: str, file_name: str):
    if os.path.isfile(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, MODEL_NAME, file_name.replace(".mp3", ""), "vocals.mp3")):
        return FileResponse(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, MODEL_NAME, file_name.replace(".mp3", ""), "vocals.mp3"))

@app.get("/play_playlist_music")
async def get_play_normal(playlist_name: str, file_name: str):
    if os.path.isfile(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, MODEL_NAME, file_name.replace(".mp3", ""), "no_vocals.mp3")):
        return FileResponse(os.path.join(OUTPUT_DIRECTORY_PLAYLISTS, playlist_name, MODEL_NAME, file_name.replace(".mp3", ""), "no_vocals.mp3"))
