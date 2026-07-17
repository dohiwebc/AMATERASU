#!/usr/bin/env python3
"""logo-amaterasu.png から favicon 一式を生成する。"""

from __future__ import annotations

import io
import struct
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
LOGO = PUBLIC / 'images' / 'logo-amaterasu.png'


def extract_mark(logo: Image.Image) -> Image.Image:
    w, h = logo.size
    px = logo.load()
    thresh = 80
    y1 = int(h * 0.58)

    minx, miny, maxx, maxy = w, h, -1, -1
    for y in range(0, y1):
        for x in range(w):
            if px[x, y][3] > thresh:
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)

    cx = (minx + maxx) / 2
    cy = (miny + maxy) / 2
    content_w = maxx - minx + 1
    content_h = maxy - miny + 1
    side = int(max(content_w, content_h) * 1.08)
    left = int(round(cx - side / 2))
    top = int(round(cy - side / 2))
    right = left + side
    bottom = top + side

    mark = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    src_box = (max(0, left), max(0, top), min(w, right), min(h, bottom))
    paste_xy = (src_box[0] - left, src_box[1] - top)
    cropped = logo.crop(src_box)
    mark.paste(cropped, paste_xy, cropped)
    return mark


def resize_mark(mark: Image.Image, size: int, *, bg=None, pad_ratio: float = 0.0) -> Image.Image:
    side = mark.size[0]
    if pad_ratio:
        inset = int(side * pad_ratio)
        src = mark.crop((inset, inset, side - inset, side - inset))
    else:
        src = mark
    img = src.resize((size, size), Image.Resampling.LANCZOS)
    if bg is None:
        return img
    base = Image.new('RGBA', (size, size), bg)
    base.alpha_composite(img)
    return base


def write_ico(path: Path, images: list[Image.Image]) -> None:
    """PNG圧縮エントリ付きのICOを書き出す。"""
    pngs = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, format='PNG', optimize=True)
        pngs.append(buf.getvalue())

    header = struct.pack('<HHH', 0, 1, len(images))
    offset = 6 + 16 * len(images)
    directory = b''
    data = b''
    for im, blob in zip(images, pngs):
        size = im.size[0]
        directory += struct.pack(
            '<BBBBHHII',
            size if size < 256 else 0,
            size if size < 256 else 0,
            0,
            0,
            1,
            32,
            len(blob),
            offset,
        )
        offset += len(blob)
        data += blob
    path.write_bytes(header + directory + data)


def main() -> None:
    logo = Image.open(LOGO).convert('RGBA')
    mark = extract_mark(logo)

    icon16 = resize_mark(mark, 16, pad_ratio=0.04)
    icon32 = resize_mark(mark, 32, pad_ratio=0.02)
    icon48 = resize_mark(mark, 48)
    apple = resize_mark(mark, 180, bg=(244, 240, 232, 255))

    icon16.save(PUBLIC / 'favicon-16x16.png', optimize=True)
    icon32.save(PUBLIC / 'favicon-32x32.png', optimize=True)
    apple.save(PUBLIC / 'apple-touch-icon.png', optimize=True)
    write_ico(PUBLIC / 'favicon.ico', [icon16, icon32, icon48])

    print('generated:')
    for name in ('favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png'):
        path = PUBLIC / name
        im = Image.open(path)
        print(f'  {name}: {im.size[0]}x{im.size[1]} ({path.stat().st_size} bytes)')


if __name__ == '__main__':
    main()
