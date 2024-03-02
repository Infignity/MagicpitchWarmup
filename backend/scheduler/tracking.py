from typing import List
from scheduler.settings import TRACKING_PIXELS_DIR
import numpy as np 
from PIL import Image
import time
import uuid

def generate_unique_image_name(extension='.png'):
    timestamp = str(int(time.time() * 1000))  # Current timestamp in milliseconds
    unique_string = uuid.uuid4().hex  # Random UUID string
    image_name = f"{timestamp}_{unique_string}{extension}"
    return image_name

print(f"Tracking pixels dir -> {TRACKING_PIXELS_DIR}")

def gen_tracking_images(warmup_batch_identifier, length) -> List[str]:
    image_urls = []
    
    for i in range(length):
        random_image_name = f"tpx__{batch_id}-{generate_unique_image_name()}"
        img = np.ones((1,1,3), dtype=np.uint8)
        Imagae.fromarray(img).save(os.path.join(TRACKING_PIXELS_DIR, random_image_name))
        image_urls.append(
            f"https://ketchwarmup.azurewebsites.net/tpximgs/{random_image_name}"
        )
    
    return image_urls
