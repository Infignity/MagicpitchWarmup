from api.app_config import BASE_DIR
import os

with open(os.path.join(BASE_DIR, "datasets/subjects.txt")) as sf:
    texts = sf.readlines()

# Remove quotes
clean = [text.split('"', 1)[-1].strip('"') for text in texts]
# Remove line numbers
clean = [
    text.split(".", 1)[-1].strip() for text in clean if text.split(".", 1)[-1].strip()
]
# Remove duplicates
clean = [
    text.strip('"').title() + "\n" for text in set(clean) if text.strip('"') != "ai"
]

print(len(clean))

# Save back into another file
with open(os.path.join(BASE_DIR, "datasets/clean_subjects.txt"), "w") as clean_sf:
    clean_sf.writelines(clean)
