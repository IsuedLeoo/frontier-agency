#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os
import subprocess

base_dir = '/Users/leongladyshev/Desktop/AM/ai-chat-app/src-tauri/icons'
os.makedirs(base_dir, exist_ok=True)

def find_font(size):
    """Find a working system font."""
    candidates = [
        '/System/Library/Fonts/Helvetica.ttc',
        '/System/Library/Fonts/HelveticaNeue.ttc',
        '/System/Library/Fonts/SF-Pro.ttf',
        '/Library/Fonts/Arial.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ]
    for fc in candidates:
        if os.path.exists(fc):
            try:
                return ImageFont.truetype(fc, size)
            except:
                pass
    return ImageFont.load_default()

def draw_icon(size, filename):
    """Generate a black square icon with white 'A.M.' text."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # Use larger base for small sizes to avoid font rendering issues
    scale = 4 if size < 64 else 2 if size < 256 else 1
    work_size = size * scale

    big = Image.new('RGBA', (work_size, work_size), (0, 0, 0, 255))
    big_draw = ImageDraw.Draw(big)

    font_size = int(work_size * 0.45)
    font = find_font(font_size)
    text = 'A.M.'

    # Measure
    try:
        bbox = big_draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
    except Exception:
        text_w = int(len(text) * font_size * 0.6)
        text_h = font_size

    x = (work_size - text_w) / 2
    y = (work_size - text_h) / 2

    big_draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)

    # Downscale with high quality
    img = big.resize((size, size), Image.LANCZOS)

    out_path = os.path.join(base_dir, filename)
    img.save(out_path, format='PNG')
    print(f'Generated {filename} ({size}x{size})')

# ICNS icon set sizes
iconset_sizes = {
    'icon_16x16.png': 16,
    'icon_16x16@2x.png': 32,
    'icon_32x32.png': 32,
    'icon_32x32@2x.png': 64,
    'icon_128x128.png': 128,
    'icon_128x128@2x.png': 256,
    'icon_256x256.png': 256,
    'icon_256x256@2x.png': 512,
    'icon_512x512.png': 512,
    'icon_512x512@2x.png': 1024,
}

# Tauri bundle PNGs
tauri_sizes = {
    '32x32.png': 32,
    '128x128.png': 128,
    '128x128@2x.png': 256,
    'icon.png': 512,
}

all_icons = {**iconset_sizes, **tauri_sizes}
for fname, s in all_icons.items():
    draw_icon(s, fname)

# Create .icns file for macOS
print("Creating iconset for macOS .icns...")
icondir = os.path.join(base_dir, 'icon.iconset')
os.makedirs(icondir, exist_ok=True)

# Symlink/copy all icon files into iconset with proper naming
for src_name, size in iconset_sizes.items():
    src = os.path.join(base_dir, src_name)
    dst = os.path.join(icondir, src_name)
    if os.path.exists(src):
        import shutil
        shutil.copy2(src, dst)

# Use iconutil to compile .icns (macOS builtin)
try:
    icns_out = os.path.join(base_dir, 'icon.icns')
    subprocess.run(['iconutil', '-c', 'icns', icondir, '-o', icns_out], check=True)
    print(f'Generated icon.icns')
except Exception as e:
    print(f'iconutil failed: {e}')
    # Fallback: just copy the 512x512 as icns
    import shutil
    shutil.copy2(os.path.join(base_dir, 'icon_512x512.png'), os.path.join(base_dir, 'icon.icns'))

# ICO file (Windows icon container)
# Tauri uses PNG-based ICO, just copy a high-res PNG with .ico extension
import shutil
shutil.copy2(os.path.join(base_dir, 'icon.png'), os.path.join(base_dir, 'icon.ico'))
print('Generated icon.ico')

print('\nAll logo icons generated successfully!')
