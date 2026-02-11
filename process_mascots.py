from PIL import Image
import os

def process_sheet(image_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Clean previous attempts
    for f in os.listdir(output_folder):
        if f.startswith("pose_") and f.endswith(".png"):
            os.remove(os.path.join(output_folder, f))

    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    bg_color = img.getpixel((0, 0))
    
    def is_bg(p):
        return abs(p[0]-bg_color[0]) < 30 and abs(p[1]-bg_color[1]) < 30 and abs(p[2]-bg_color[2]) < 30

    mask = Image.new("L", (width, height), 0)
    data = list(img.getdata())
    mask_data = [0 if is_bg(p) else 255 for p in data]
    mask.putdata(mask_data)

    visited = set()
    boxes = []

    for y in range(0, height, 5):
        for x in range(0, width, 5):
            if mask.getpixel((x,y)) == 255 and (x,y) not in visited:
                stack = [(x, y)]
                b_min_x, b_min_y = x, y
                b_max_x, b_max_y = x, y
                
                while stack:
                    cx, cy = stack.pop()
                    if (cx, cy) in visited: continue
                    visited.add((cx, cy))
                    
                    b_min_x = min(b_min_x, cx)
                    b_min_y = min(b_min_y, cy)
                    b_max_x = max(b_max_x, cx)
                    b_max_y = max(b_max_y, cy)
                    
                    for dx, dy in [(0, 5), (0, -5), (5, 0), (-5, 0)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if mask.getpixel((nx, ny)) == 255 and (nx, ny) not in visited:
                                stack.append((nx, ny))
                
                w, h = b_max_x - b_min_x, b_max_y - b_min_y
                # Only keep significant blobs
                if w > 100 and h > 100: 
                    boxes.append((b_min_x, b_min_y, b_max_x, b_max_y))

    print(f"Detected {len(boxes)} monkeys.")
    boxes.sort(key=lambda b: (b[1], b[0]))

    for i, box in enumerate(boxes):
        sprite = img.crop((max(0, box[0]-15), max(0, box[1]-15), min(width, box[2]+15), min(height, box[3]+15)))
        s_data = list(sprite.getdata())
        # Apply cleaner background removal
        new_s_data = [(255, 255, 255, 0) if is_bg(p) else p for p in s_data]
        sprite.putdata(new_s_data)
        sprite.save(os.path.join(output_folder, f"pose_{i+1}.png"), "PNG")
        print(f"Saved pose_{i+1}.png")

if __name__ == "__main__":
    src = r"c:\Users\rodri\ErasmusSupervivience\src\mascot\Gemini_Generated_Image_w4kctaw4kctaw4kc.png"
    dest = r"c:\Users\rodri\ErasmusSupervivience\public\mascot"
    process_sheet(src, dest)
