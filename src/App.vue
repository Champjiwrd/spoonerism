<script setup>
import { ref, computed } from 'vue'

/* ============================================================
 * 📚 ข้อมูลคำผวน — เพิ่มคำใหม่ที่นี่ได้เลย
 * แต่ละรายการ: { id, phrase, tags: [...] }
 * ============================================================ */
const spoonerisms = ref([
  { id: 1, phrase: 'เห็ดล้างไม่สี', tags: ['18+'] },
  { id: 2, phrase: 'เห็ดรสผี', tags: ['18+'] },
  { id: 3, phrase: 'เห็ดคนร้อยอี๋', tags: ['18+'] },
  { id: 4, phrase: 'เห็ดคนในเกาะสะหมี', tags: ['18+'] },
  { id: 5, phrase: 'เห็ดตกสะกี๋', tags: ['18+'] },
  { id: 6, phrase: 'เห็ดคนแคระทั้งจี๋', tags: ['18+'] },
  { id: 7, phrase: 'เห็ดท็อปซีครี๋', tags: ['18+'] },
  { id: 8, phrase: 'เห็ดในอินเตอร์หนี', tags: ['18+'] },
  { id: 9, phrase: 'ไข้ที่ชล', tags: ['รัก'] },
  { id: 10, phrase: 'ไข้เธอไม่ดาด', tags: ['รัก'] },
  { id: 11, phrase: 'อวยคม', tags: ['18+'] },
  { id: 12, phrase: 'ยักษ์ไม่ให้เพชร', tags: ['18+'] },
  { id: 13, phrase: 'หวยอาหมี', tags: ['18+'] },
  { id: 14, phrase: 'เก็ตแล้วหยอด', tags: ['18+'] },
  { id: 15, phrase: 'ผีเลียหัว', tags: ['18+'] },
  { id: 16, phrase: 'ยาบนโชเฟ็ด', tags: ['18+'] },
  { id: 17, phrase: 'เบอร์ว่ารักแถบ', tags: ['รัก'] },
  { id: 18, phrase: 'เออรักแถบ', tags: ['รัก'] },
  { id: 19, phrase: 'เทาเป็นของเรอ', tags: ['รัก'] },
  { id: 20, phrase: 'ลายูเนิ้ฟ', tags: ['รัก'] },
  { id: 21, phrase: 'รันไม่เว้นวรรค', tags: ['รัก'] },
  { id: 22, phrase: 'ไหล่โดนจอ', tags: [] },
  { id: 23, phrase: 'คนร่องหวย', tags: ['18+'] },
  { id: 24, phrase: 'หวยสุดสี', tags: ['18+'] },
  { id: 25, phrase: 'คีย์แทงหวย', tags: ['18+'] },
  { id: 26, phrase: 'หมีจับหวย', tags: ['18+'] },
  { id: 27, phrase: 'หมีเล่นหวย', tags: ['18+'] },
  { id: 28, phrase: 'ครูหวังรวย', tags: ['18+'] },
  { id: 29, phrase: 'ครูสั้นจ๋วย', tags: ['18+'] },
  { id: 30, phrase: 'ผีคลำหัว', tags: ['18+'] },
  { id: 31, phrase: 'ยำทั้งเล็ด', tags: ['18+'] },
  { id: 32, phrase: 'ยำประเจ็ด', tags: ['18+'] },
  { id: 33, phrase: 'ยำทุกเว็ด', tags: ['18+'] },
  { id: 34, phrase: 'ลิ้นจี่ที่หอ', tags: ['18+'] },
])

/* ============================================================
 * 🎨 สีของแต่ละแท็ก — เพิ่มแท็กใหม่ที่นี่ (ถ้าไม่กำหนดจะใช้สีเหลือง)
 * ============================================================ */
const TAG_STYLES = {
  '18+': {
    badge: 'bg-red-100 text-red-600 ring-red-300',
    button: 'bg-red-500 text-white ring-red-600 shadow-red-200',
    emoji: '🔞',
  },
  รัก: {
    badge: 'bg-rose-100 text-rose-500 ring-rose-300',
    button: 'bg-rose-400 text-white ring-rose-500 shadow-rose-200',
    emoji: '💖',
  },
}

const DEFAULT_TAG_STYLE = {
  badge: 'bg-amber-100 text-amber-700 ring-amber-300',
  button: 'bg-amber-400 text-amber-950 ring-amber-500 shadow-amber-200',
  emoji: '🏷️',
}

const tagStyle = (tag) => TAG_STYLES[tag] ?? DEFAULT_TAG_STYLE

/* ============================================================
 * 🔍 สถานะการค้นหาและกรอง
 * ============================================================ */
const ALL_TAG = 'ทั้งหมด'
const searchQuery = ref('')
const activeTag = ref(ALL_TAG)

// รวมแท็กทั้งหมดที่มีอยู่ (ไม่ซ้ำ) ไว้ทำปุ่มกรอง
const allTags = computed(() => {
  const tags = new Set()
  spoonerisms.value.forEach((item) => item.tags.forEach((t) => tags.add(t)))
  return [ALL_TAG, ...tags]
})

// นับจำนวนคำในแต่ละแท็ก โชว์บนปุ่ม
const tagCount = (tag) =>
  tag === ALL_TAG
    ? spoonerisms.value.length
    : spoonerisms.value.filter((item) => item.tags.includes(tag)).length

// รายการที่ผ่านทั้งแท็กและคำค้นหา
const filteredList = computed(() => {
  const query = searchQuery.value.trim()
  return spoonerisms.value.filter((item) => {
    const matchTag = activeTag.value === ALL_TAG || item.tags.includes(activeTag.value)
    const matchSearch = query === '' || item.phrase.includes(query)
    return matchTag && matchSearch
  })
})

/* ============================================================
 * 🔤 จัดกลุ่มตามตัวอักษร ก-ฮ
 * คำที่ขึ้นต้นด้วยสระหน้า (เ แ โ ใ ไ) จะจัดตามพยัญชนะต้นแบบพจนานุกรม
 * เช่น "เห็ด..." อยู่หมวด ห, "ไข้..." อยู่หมวด ข
 * ============================================================ */
const collator = new Intl.Collator('th')

const firstConsonant = (phrase) => {
  for (const ch of phrase) {
    if (ch >= 'ก' && ch <= 'ฮ') return ch
  }
  return phrase[0] ?? ''
}

// แปลง filteredList เป็น [{ letter: 'ข', items: [...] }, ...] เรียง ก-ฮ
const groupedList = computed(() => {
  const groups = new Map()
  for (const item of filteredList.value) {
    const letter = firstConsonant(item.phrase)
    if (!groups.has(letter)) groups.set(letter, [])
    groups.get(letter).push(item)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((a, b) => collator.compare(a.phrase, b.phrase)),
    }))
})

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-5xl px-4 pb-20 pt-10 sm:px-6">
    <!-- ═══════════ ส่วนหัว ═══════════ -->
    <header class="mb-10 text-center">
      <span
        class="mb-1 inline-block -rotate-6 rounded-full bg-violet-500 px-3 py-1 font-body text-sm font-bold text-white shadow-[3px_3px_0_rgba(49,44,81,0.25)] sm:text-base"
      >
        ผวนไปผวนมา 🔀
      </span>
      <h1
        class="font-display text-4xl leading-relaxed text-indigo-600 drop-shadow-[3px_3px_0_rgba(251,191,36,0.55)] sm:text-6xl"
      >
        คลังคำผวนหรรษา
      </h1>
      <p class="mt-2 font-body text-base font-medium text-ink/70 sm:text-lg">
        รวมคำผวนไทยสุดฮา ค้นหาง่าย แยกหมวดชัดเจน 🎉
      </p>
    </header>

    <!-- ═══════════ ช่องค้นหา ═══════════ -->
    <div class="relative mx-auto mb-6 max-w-xl">
      <span class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาคำผวน..."
        class="w-full rounded-full border-2 border-indigo-300 bg-white py-3.5 pl-14 pr-12 font-body text-lg font-medium text-ink shadow-[4px_4px_0_rgba(99,102,241,0.2)] outline-none transition placeholder:text-indigo-300 focus:border-indigo-500 focus:shadow-[4px_4px_0_rgba(99,102,241,0.4)]"
      />
      <button
        v-if="searchQuery"
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm font-bold text-indigo-500 transition hover:bg-indigo-200"
        aria-label="ล้างคำค้นหา"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>

    <!-- ═══════════ ปุ่มกรองแท็ก ═══════════ -->
    <nav class="mb-10 flex flex-wrap items-center justify-center gap-2.5" aria-label="กรองตามหมวดหมู่">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="rounded-full px-4 py-1.5 font-body text-base font-bold ring-2 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
        :class="
          activeTag === tag
            ? tag === ALL_TAG
              ? 'bg-indigo-600 text-white ring-indigo-700 shadow-[3px_3px_0_rgba(49,44,81,0.2)]'
              : [tagStyle(tag).button, 'shadow-[3px_3px_0_rgba(49,44,81,0.2)]']
            : 'bg-white text-ink/60 ring-indigo-200 hover:ring-indigo-400'
        "
        @click="activeTag = tag"
      >
        <span v-if="tag !== ALL_TAG" class="mr-1">{{ tagStyle(tag).emoji }}</span>
        {{ tag }}
        <span class="ml-1 text-sm opacity-70">({{ tagCount(tag) }})</span>
      </button>
    </nav>

    <!-- ═══════════ รายการคำผวน (เรียง ก-ฮ) ═══════════ -->
    <div v-if="filteredList.length > 0" class="mx-auto max-w-2xl space-y-10">
      <section
        v-for="(group, groupIndex) in groupedList"
        :key="group.letter"
        class="card-pop"
        :style="{ animationDelay: `${Math.min(groupIndex * 80, 400)}ms` }"
      >
        <!-- หัวหมวดตัวอักษร -->
        <div class="mb-4 flex items-center gap-3">
          <span
            class="flex h-12 w-12 shrink-0 -rotate-3 items-center justify-center rounded-2xl bg-indigo-600 pb-1 font-display text-2xl text-white shadow-[3px_3px_0_rgba(251,191,36,0.7)]"
          >
            {{ group.letter }}
          </span>
          <span class="h-0.5 flex-1 rounded-full bg-indigo-200"></span>
          <span class="font-body text-sm font-bold text-ink/40">{{ group.items.length }} คำ</span>
        </div>
        <!-- รายการคำในหมวด -->
        <ul class="space-y-3">
          <li
            v-for="item in group.items"
            :key="item.id"
            class="group flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border-2 border-indigo-200 bg-white px-5 py-3.5 shadow-[4px_4px_0_rgba(99,102,241,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-[6px_6px_0_rgba(99,102,241,0.3)]"
          >
            <p class="font-body text-lg font-semibold leading-relaxed text-ink sm:text-xl">
              {{ item.phrase }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="rounded-full px-2.5 py-0.5 font-body text-xs font-bold ring-1"
                :class="tagStyle(tag).badge"
              >
                {{ tagStyle(tag).emoji }} {{ tag }}
              </span>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <!-- ═══════════ กรณีไม่พบผลลัพธ์ ═══════════ -->
    <div
      v-else
      class="card-pop mx-auto max-w-md rounded-3xl border-2 border-dashed border-indigo-300 bg-white/70 px-6 py-14 text-center"
    >
      <p class="text-5xl">🙈</p>
      <p class="mt-4 font-body text-xl font-bold text-indigo-500">ไม่พบคำผวนที่คุณค้นหา</p>
      <p class="mt-1 font-body text-base text-ink/60">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะ</p>
      <button
        class="mt-6 rounded-full bg-indigo-600 px-6 py-2 font-body font-bold text-white shadow-[3px_3px_0_rgba(49,44,81,0.25)] transition hover:-translate-y-0.5"
        @click="((searchQuery = ''), (activeTag = ALL_TAG))"
      >
        ดูทั้งหมดอีกครั้ง
      </button>
    </div>

    <!-- ═══════════ ส่วนท้าย ═══════════ -->
    <footer class="mt-14 text-center font-body text-sm text-ink/50">
      แสดง {{ filteredList.length }} จาก {{ spoonerisms.length }} คำผวน · ทำด้วย 💜 และเสียงหัวเราะ
    </footer>
  </div>
</template>
