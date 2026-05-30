from __future__ import annotations

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
REPORT_PATH = ROOT / "handoff" / "vine-legacy-asset-import.md"

ASSETS = [
    {
        "key": "heroPrimary",
        "title": "호텔형 침대 대표컷",
        "url": "https://vinefurniture.kr/data/file/gallery/c8bd62658a83d31a41f85714cbc09178_ozV2glBU_8beb87547ed9b67097d712b8b5bcfbc297eec111.jpg",
        "output": "images/vine/hero/hero-primary-bed.jpg",
        "notes": "기존 사이트 갤러리 원본 이미지 사용",
    },
    {
        "key": "heroSecondary",
        "title": "거실 소파 대표컷",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/slide1.png",
        "output": "images/vine/hero/hero-secondary-sofa.jpg",
        "notes": "기존 사이트 메인 비주얼 1번 슬라이드 사용",
    },
    {
        "key": "storeView",
        "title": "매장 내부 전경",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/img4.png",
        "output": "images/vine/store/store-interior-main.jpg",
        "notes": "기존 인사말 페이지 대표 이미지 사용",
    },
    {
        "key": "logoPrimary",
        "title": "바인퍼니처 로고",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/logo.png",
        "output": "images/vine/brand/logo-primary.png",
        "notes": "기존 사이트 헤더 로고 사용",
    },
    {
        "key": "galleryBed01",
        "title": "호텔형 침대 쇼룸컷",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/img1.png",
        "output": "images/vine/gallery/gallery-bed-01.jpg",
        "notes": "기존 홈 카드 1번 이미지 사용",
    },
    {
        "key": "gallerySofa01",
        "title": "프리미엄 소파 쇼룸컷",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/slide1.png",
        "output": "images/vine/gallery/gallery-sofa-01.jpg",
        "notes": "기존 메인 슬라이드 소파 이미지 사용",
    },
    {
        "key": "galleryTable01",
        "title": "원목 식탁 연출컷",
        "url": "https://vinefurniture.kr/data/file/gallery/c8bd62658a83d31a41f85714cbc09178_FAe3gqU9_d51d29fa944daa31122552d4aa547a566bc2beef.jpg",
        "output": "images/vine/gallery/gallery-table-01.jpg",
        "notes": "기존 갤러리 원본 식탁 이미지 사용",
    },
    {
        "key": "galleryStore01",
        "title": "매장 분위기 컷",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/img3.png",
        "output": "images/vine/gallery/gallery-store-01.jpg",
        "notes": "기존 홈 카드 3번 이미지 사용",
    },
    {
        "key": "galleryStorage01",
        "title": "수납 가구 구성컷",
        "url": "https://vinefurniture.kr/theme/TYPE08/img/img5.png",
        "output": "images/vine/gallery/gallery-storage-01.jpg",
        "notes": "기존 홈 카드 4번 이미지 사용",
    },
    {
        "key": "galleryInstagramBed01",
        "title": "침실 스타일링 컷",
        "url": "https://vinefurniture.kr/data/file/gallery/c8bd62658a83d31a41f85714cbc09178_ozV2glBU_8beb87547ed9b67097d712b8b5bcfbc297eec111.jpg",
        "output": "images/vine/gallery/gallery-instagram-bed-01.jpg",
        "notes": "기존 갤러리 원본 침실 이미지 재사용",
    },
    {
        "key": "galleryInstagramSofa01",
        "title": "거실 스타일링 컷",
        "url": "https://vinefurniture.kr/data/file/gallery/c8bd62658a83d31a41f85714cbc09178_15MnNBjA_1c4c9e55fdab62655938433e8bbe4c4369101668.jpg",
        "output": "images/vine/gallery/gallery-instagram-sofa-01.jpg",
        "notes": "기존 갤러리 원본 쇼룸/소파 이미지 사용",
    },
    {
        "key": "galleryStoreInterior01",
        "title": "매장 전경 대표컷",
        "url": "https://vinefurniture.kr/data/file/gallery/c8bd62658a83d31a41f85714cbc09178_15MnNBjA_1c4c9e55fdab62655938433e8bbe4c4369101668.jpg",
        "output": "images/vine/gallery/gallery-store-interior-01.jpg",
        "notes": "기존 갤러리 원본 매장 전경 이미지 재사용",
    },
]


def fetch_bytes(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=30) as response:
        return response.read()


def save_asset(raw: bytes, destination: Path) -> tuple[int, int]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    suffix = destination.suffix.lower()

    if suffix in {".jpg", ".jpeg", ".png", ".webp"}:
        image = Image.open(BytesIO(raw))
        width, height = image.size

        if suffix in {".jpg", ".jpeg"}:
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(destination, format="JPEG", quality=92, optimize=True)
        elif suffix == ".png":
            image.save(destination, format="PNG", optimize=True)
        elif suffix == ".webp":
            if image.mode not in {"RGB", "RGBA", "L"}:
                image = image.convert("RGB")
            image.save(destination, format="WEBP", quality=92, method=6)
        else:
            destination.write_bytes(raw)
        return width, height

    destination.write_bytes(raw)
    return (0, 0)


def main() -> None:
    lines = [
        "# Vine legacy asset import",
        "",
        "기존 `vinefurniture.kr` 공개 자산을 수집해 새 사이트의 실제 슬롯 경로에 배치한 기록입니다.",
        "",
        "| Key | Output | Source URL | Notes | Size |",
        "| --- | --- | --- | --- | --- |",
    ]

    for asset in ASSETS:
        raw = fetch_bytes(asset["url"])
        destination = PUBLIC_DIR / asset["output"]
        width, height = save_asset(raw, destination)
        lines.append(
            f"| {asset['key']} | `{asset['output']}` | {asset['url']} | {asset['notes']} | {width}x{height} |"
        )
        print(f"Imported {asset['key']} -> {destination}")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote report -> {REPORT_PATH}")


if __name__ == "__main__":
    main()
