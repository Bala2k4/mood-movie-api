import pandas as pd
import json
import os

# Load the Kaggle CSV
try:
    df = pd.read_csv('tmdb_5000_movies.csv')
    print("Columns found in your CSV:", df.columns.tolist())
except FileNotFoundError:
    print("Error: tmdb_5000_movies.csv not found in this folder.")
    exit()

# List of columns we WANT. If 'poster_path' is missing, we will skip it for now.
# Note: Many Kaggle datasets use 'homepage' or don't include the poster URL.
required_columns = ['id', 'title', 'vote_average', 'overview', 'release_date', 'genres']
available_columns = [col for col in required_columns if col in df.columns]

# Drop rows only for columns that actually exist
df = df.dropna(subset=['title'])

# Convert the 'genres' column from string-JSON to a list
def extract_genres(genre_str):
    try:
        genres = json.loads(genre_str)
        return [g['name'] for g in genres]
    except:
        return []

if 'genres' in df.columns:
    df['genres_list'] = df['genres'].apply(extract_genres)

# If poster_path is missing, we create a placeholder so your React app doesn't crash
if 'poster_path' not in df.columns:
    print("⚠️ 'poster_path' not found. Adding placeholder values.")
    df['poster_path'] = None 

# Final selection
final_columns = ['id', 'title', 'vote_average', 'overview', 'release_date', 'poster_path', 'genres_list']
final_df = df[final_columns]

# Export to your backend folder
output_path = './src/utils/movies_metadata.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

final_df.to_json(output_path, orient='records', indent=2)
print(f"✅ Success! Created {output_path} with {len(final_df)} movies.")