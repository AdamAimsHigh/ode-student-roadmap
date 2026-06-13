import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import csv

# Set up the API
scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file("credentials.json", scopes)
credentials = flow.run_local_server(port=0)
youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

def get_playlist_items(playlist_id):
    items = []
    request = youtube.playlistItems().list(part="snippet,contentDetails", playlistId=playlist_id, maxResults=50)
    while request:
        response = request.execute()
        items.extend(response["items"])
        request = youtube.playlistItems().list_next(request, response)
    return items

# REPLACE with your actual Playlist ID (found in the URL of your playlist)
playlist_id = "PLNCEk8WQFyCDRKT6YCm90ZbB_83nuF0Rd"
all_items = get_playlist_items(playlist_id)

# Save to CSV
with open("playlist_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Position", "Title", "VideoID", "PlaylistItemID"])
    for item in all_items:
        writer.writerow([
            item["snippet"]["position"],
            item["snippet"]["title"],
            item["contentDetails"]["videoId"],
            item["id"]
        ])

print(f"Successfully extracted {len(all_items)} videos to playlist_data.csv")