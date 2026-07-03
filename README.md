# คลังคำผวนหรรษา 🔀

เว็บรวมคำผวนไทย (Thai Spoonerism) พร้อมระบบค้นหาและกรองตามหมวดหมู่
สร้างด้วย Vue 3 (Composition API) + Tailwind CSS + Vite

🌐 Live: https://champjiwrd.github.io/spoonerism/

## การพัฒนา

```bash
npm install
npm run dev      # เปิด dev server
npm run build    # build ลงโฟลเดอร์ dist
```

## เพิ่มคำผวนใหม่

แก้ไข array `spoonerisms` ใน [src/App.vue](src/App.vue):

```js
{ id: 11, phrase: 'คำผวนใหม่ของคุณ', tags: ['ฮา'] },
```

- แท็กใหม่จะโผล่เป็นปุ่มกรองให้อัตโนมัติ
- กำหนดสีของแท็กใหม่ได้ที่ object `TAG_STYLES` (ถ้าไม่กำหนดจะใช้สีเหลือง amber)

## Deploy

Push ขึ้น branch `main` แล้ว GitHub Actions จะ build + deploy ขึ้น GitHub Pages ให้อัตโนมัติ
(ตั้งค่า repo: Settings → Pages → Source เลือก **GitHub Actions** ครั้งแรกครั้งเดียว)
