from demucs.separate import main 
import os

def split_song(mp3_path, model_name, output_path):
    command = ['--mp3', '--two-stems', 'vocals', '-n', model_name,mp3_path, '-o', output_path]
    main(command)
    

def split_playlist(output_path, model_name):
    for file in os.listdir(output_path):
        if not os.path.isdir(os.path.join(output_path, file)) and file.endswith(".mp3"):
            split_song(os.path.join(output_path, file), model_name, output_path)    