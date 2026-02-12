from PIL import Image
import os

def extract_poses(image_path, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # Based on the image analysis, we have 6 monkeys in two rows.
    # We'll use a more robust extraction finding contiguous blobs.
    
    # 1. Create a mask for anything that isn't the background color
    # The background is checkered with shades of gray.
    # We will treat any color where R, G, B are similar and > 150 as background.
    # Also catch white.
    
    mask = Image.new("L", (width, height), 0)
    data = img.getdata()
    mask_data = []
    for pixel in data:
        r, g, b = pixel[:3]
        # Detect gray/white checkers: all channels close to each other
        is_gray = abs(r - g) < 15 and abs(g - b) < 15 and abs(r - b) < 15 and r > 160
        is_white = r > 240 and g > 240 and b > 240
        mask_data.append(0 if (is_gray or is_white) else 255)
    mask.putdata(mask_data)
    
    # 2. Find bounding boxes of the 6 monkeys.
    cell_w = width // 3
    cell_h = height // 2
    
    extracted_count = 0
    for r in range(2):
        for c in range(3):
            left = c * cell_w
            top = r * cell_h
            right = (c + 1) * cell_w
            bottom = (r + 1) * cell_h
            
            cell_mask = mask.crop((left, top, right, bottom))
            bbox = cell_mask.getbbox()
            
            if bbox:
                content_left = left + bbox[0]
                content_top = top + bbox[1]
                content_right = left + bbox[2]
                content_bottom = top + bbox[3]
                
                monkey = img.crop((content_left, content_top, content_right, content_bottom))
                
                # Final transparency pass
                monkey_data = monkey.getdata()
                final_data = []
                for p in monkey_data:
                    pr, pg, pb = p[:3]
                    is_bg = abs(pr - pg) < 15 and abs(pg - pb) < 15 and pr > 160
                    if is_bg or (pr > 240 and pg > 240 and pb > 240):
                        final_data.append((0, 0, 0, 0))
                    else:
                        final_data.append(p)
                
                monkey.putdata(final_data)
                
                extracted_count += 1
                out_path = os.path.join(output_folder, f"pose_{extracted_count}.png")
                monkey.save(out_path, "PNG")
                print(f"Saved {out_path}")

if __name__ == "__main__":
    input_img = r"c:\Users\rodri\ErasmusSupervivience\src\mascot\Gemini_Generated_Image_i1x7nji1x7nji1x7.png"
    output_dir = r"c:\Users\rodri\ErasmusSupervivience\public\mascot"
    extract_poses(input_img, output_dir)
