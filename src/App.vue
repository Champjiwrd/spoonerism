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

    <!-- ═══════════ รายการคำผวน ═══════════ -->
    <TransitionGroup
      v-if="filteredList.length > 0"
      tag="ul"
      name="list"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="(item, index) in filteredList"
        :key="item.id"
        class="card-pop group relative rounded-2xl border-2 border-indigo-200 bg-white p-5 shadow-[5px_5px_0_rgba(99,102,241,0.15)] transition-all duration-200 hover:-translate-y-1 hover:-rotate-1 hover:border-indigo-400 hover:shadow-[7px_7px_0_rgba(99,102,241,0.3)]"
        :style="{ animationDelay: `${Math.min(index * 45, 400)}ms` }"
      >
        <span
          class="absolute -top-3 -left-2 rounded-full bg-amber-300 px-2.5 py-0.5 font-body text-xs font-bold text-amber-900 shadow-sm"
        >
          #{{ item.id }}
        </span>
        <p class="mt-2 font-body text-xl font-semibold leading-relaxed text-ink sm:text-2xl">
          {{ item.phrase }}
        </p>
        <div class="mt-4 flex flex-wrap gap-1.5">
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
    </TransitionGroup>

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
