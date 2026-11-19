# Happy Birthday – Đào Thu Trang 🎂

Trang web SPA 3 trang chúc mừng sinh nhật Đào Thu Trang (24/11).

## Mở xem nhanh (local)

Double-click file `index.html` để mở bằng trình duyệt. Không cần cài đặt gì thêm.

> **Lưu ý:** Trình duyệt Chrome/Edge có thể chặn load ảnh local do CORS.
> Giải pháp: dùng VS Code + Live Server extension, hoặc chạy lệnh:
> ```
> npx serve .
> ```

## Cấu trúc thư mục

```
assets/images/milestones/   ← 10 ảnh kỷ niệm (1.jpg … 10.jpg)
assets/images/hero/         ← hero.png (ảnh trung tâm finale)
assets/audio/               ← file nhạc nền
assets/fonts/               ← font Lauren (nếu có)
css/base.css                ← reset & utilities
css/styles.css              ← theme & components
js/stars.js                 ← canvas sao + cursor trail + fireworks/meteors
js/landing.js               ← page 1
js/timeline.js              ← page 2
js/wishes.js                ← page 3
js/main.js                  ← router & magic bar
index.html                  ← entry point
```

## Deploy lên Netlify

1. Tạo repo GitHub, push toàn bộ thư mục này lên.
2. Vào [netlify.com](https://netlify.com) → New site from Git → chọn repo.
3. Build command: *(để trống)*  
   Publish directory: `.`  (hoặc `/`)
4. Click Deploy → nhận URL công khai.
