import spotipy, os, subprocess
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv


load_dotenv()

def get_spotify_client():
    return spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=os.getenv('SPOTIFY_CLIENT_ID'),
                                               client_secret=os.getenv('SPOTIFY_CLIENT_SECRET'),
                                               redirect_uri=os.getenv('SPOTIFY_REDIRECT_URL'),
                                               scope="user-library-read"))

def get_user_playlists(sp):
    playlists = sp.current_user_playlists()
    return [{"id": playlist["id"], 
             "name": playlist["name"], 
             "owner": playlist["owner"]["display_name"], 
             "url": playlist["external_urls"]["spotify"]} for playlist in playlists['items']]

def download_playlist(url, output_path):
    download_command = ["spotdl", "download", url,  "--output", output_path,  "--user-auth"]
    subprocess.run(download_command)