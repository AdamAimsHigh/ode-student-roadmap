import google_auth_oauthlib.flow
import googleapiclient.discovery
import csv
import time

# Set up the API
scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]
flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file("credentials.json", scopes)
credentials = flow.run_local_server(port=0)
youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

# Load your sorted CSV
with open("sorted_playlist_data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    all_videos = list(reader)

print(f"Loaded {len(all_videos)} total videos from your CSV.")

# --- NEW RESUME FEATURE ---
start_input = input("Enter the position number you want to resume from (e.g., 200), or press Enter to start at 0: ")
if start_input.strip() == "":
    start_index = 0
else:
    start_index = int(start_input.strip())

# Slice the list to only include the remaining videos
videos_to_update = all_videos[start_index:]
print(f"\nResuming update from position {start_index}... ({len(videos_to_update)} videos remaining to process)")
# --------------------------

# Update positions
for video in videos_to_update:
    # --- SAFETY NET FOR EXCEL BUG ---
    if video['VideoID'] == '#NAME?':
        print(f"⚠️ Skipping corrupted ID for: {video['Title']}")
        continue 
    # --------------------------------
    
    print(f"Moving '{video['Title']}' to position {video['Position']}...")
    try:
        request = youtube.playlistItems().update(
            part="snippet",
            body={
                "id": video["PlaylistItemID"],
                "snippet": {
                    "playlistId": "PLNCEk8WQFyCDRKT6YCm90ZbB_83nuF0Rd", 
                    "resourceId": {"kind": "youtube#video", "videoId": video["VideoID"]},
                    "position": int(video["Position"])
                }
            }
        )
        request.execute()
        # Small delay to respect API rate limits
        time.sleep(1.5) 
    except Exception as e:
        print(f"❌ Error updating {video['Title']}: {e}")

print("\n✅ Update complete or daily quota reached!")