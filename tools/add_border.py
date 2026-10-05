#!/usr/bin/env python3
"""Add a black outline around the opaque region of transparent PNGs.

Usage: add_border.py INPUT_DIR [OUTPUT_DIR] [--width 1]
Without OUTPUT_DIR, files are overwritten in place.
"""
import sys, argparse
from pathlib import Path
from PIL import Image, ImageFilter

def add_border(im, width):
    im = im.convert("RGBA")
    pad = width
    canvas = Image.new("RGBA", (im.width + 2*pad, im.height + 2*pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    alpha = canvas.split()[3]
    # grow the alpha mask by `width` pixels (MaxFilter needs an odd size)
    grown = alpha.filter(ImageFilter.MaxFilter(2*width + 1))
    outline = Image.new("RGBA", canvas.size, (0, 0, 0, 255))
    outline.putalpha(grown)
    return Image.alpha_composite(outline, canvas)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("dst", nargs="?")
    p.add_argument("--width", type=int, default=1)
    a = p.parse_args()
    src = Path(a.src)
    dst = Path(a.dst) if a.dst else src
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(src.glob("*.png")):
        add_border(Image.open(f), a.width).save(dst / f.name)
        print("done", f.name)

if __name__ == "__main__":
    main()
