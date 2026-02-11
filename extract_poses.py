from PIL import Image, ImageChops, ImageDraw
import os

def extract_sprites(image_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # Assume top-left pixel is background color if it's a solid background sheet
    bg_color = img.getpixel((0, 0))
    
    # Create mask of non-background pixels
    # We'll treat anything very close to the background color as background
    data = img.getdata()
    new_data = []
    
    # Tolerance for background matching
    tol = 30 
    
    def is_bg(pixel):
        return all(abs(pixel[i] - bg_color[i]) < tol for i in range(3))

    # Create a binary image where 255 is foreground, 0 is background
    mask = Image.new("L", (width, height), 0)
    for y in range(height):
        for x in range(width):
            if not is_bg(img.getpixel((x, y))):
                mask.putpixel((x, y), 255)

    # Use the mask to find bounding boxes of contiguous objects
    # Pillow doesn't have a direct "find objects" but we can use getbbox on 
    # disconnected components if we're clever, or just scan for regions.
    # An easier way is to just find the overall bbox, but user says "different states", 
    # implying multiple monkeys.
    
    # Simple strategy: find all non-empty regions
    # We'll use a flood-fill like approach to find connected components
    visited = set()
    spots = []
    
    # To speed up, we'll downsample for detection or just scan
    # Let's just scan and find bounding boxes
    boxes = []
    
    # Helper to find a blob's bounding box
    def get_blob_bbox(start_x, start_y):
        min_x, min_y = start_x, start_y
        max_x, max_y = start_x, start_y
        stack = [(start_x, start_y)]
        visited.add((start_x, start_y))
        
        while stack:
            curr_x, curr_y = stack.pop()
            min_x = min(min_x, curr_x)
            min_y = min(min_y, curr_y)
            max_x = max(max_x, curr_x)
            max_y = max(max_y, curr_y)
            
            # Check neighbors (8-connectivity, stepping 2 for speed)
            for dx in [-2, 0, 2]:
                for dy in [-2, 0, 2]:
                    nx, ny = curr_x + dx, curr_y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) not in visited and mask.getpixel((nx, ny)) == 255:
                            visited.add((nx, ny))
                            stack.append((nx, ny))
        return (min_x, min_y, max_x + 1, max_y + 1)

    # Scan the mask
    for y in range(0, height, 5): # Step to avoid extreme slowness
        for x in range(0, width, 5):
            if (x, y) not in visited and mask.getpixel((x, y)) == 255:
                bbox = get_blob_bbox(x, y)
                # Ignore very small blobs (noise)
                if (bbox[2] - bbox[0]) > 50 and (bbox[3] - bbox[1]) > 50:
                    boxes.append(bbox)

    print(f"Found {len(boxes)} potential poses.")

    for i, box in enumerate(boxes):
        sprite = img.crop(box)
        
        # Make background transparent for the individual sprite
        # Based on the bg_color we found earlier
        sprite_data = sprite.getdata()
        new_sprite_data = []
        for item in sprite_data:
            if is_bg(item):
                new_sprite_data.append((255, 255, 255, 0))
            else:
                new_sprite_data.append(item)
        sprite.putdata(new_sprite_data)
        
        output_path = os.path.join(output_folder, f"pose_{i+1}.png")
        sprite.save(output_path, "PNG")
        print(f"Saved {output_path}")

if __name__ == "__main__":
    input_img = r"c:\Users\rodri\ErasmusSupervivience\src\mascot\Gemini_Generated_Image_w4kctaw4kctaw4kc.png"
    output_dir = r"c:\Users\rodri\ErasmusSupervivience\public\mascot"
    extract_sprites(input_img, output_dir)
