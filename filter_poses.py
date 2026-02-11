import os

def filter_mascots(folder):
    files = [f for f in os.listdir(folder) if f.startswith("pose_") and f.endswith(".png")]
    paths = [os.path.join(folder, f) for f in files]
    
    # Get sizes
    sized_files = []
    for p in paths:
        size = os.path.getsize(p)
        sized_files.append((p, size))
    
    # Sort by size descending
    sized_files.sort(key=lambda x: x[1], reverse=True)
    
    # Keep the top significant files.
    # Usually these generated sheets have 4, 6, or 9 poses.
    # Let's count how many are over a reasonable threshold (e.g. 50kb)
    threshold = 50 * 1024 
    valid_poses = [f for f in sized_files if f[1] > threshold]
    
    print(f"Total files: {len(sized_files)}")
    print(f"Files > 50KB: {len(valid_poses)}")
    
    for p, size in sized_files:
        if size <= threshold:
            os.remove(p)
    
    # Rename valid ones to 1, 2, 3...
    for i, (p, size) in enumerate(valid_poses):
        new_path = os.path.join(folder, f"pose_{i+1}.png")
        if os.path.exists(new_path) and new_path != p:
            os.remove(new_path) # Overwrite logic
        os.rename(p, new_path)
        print(f"Kept {new_path} ({size // 1024} KB)")

if __name__ == "__main__":
    filter_mascots(r"c:\Users\rodri\ErasmusSupervivience\public\mascot")
