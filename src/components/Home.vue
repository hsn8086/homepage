<template>
  <main class="mx-auto max-w-5xl px-4 py-10 md:py-16">
    <!-- Hero -->
    <section class="space-y-5">
      <div
        class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div class="flex items-center gap-4">
          <Avatar class="h-14 w-14 md:h-20 md:w-20">
            <AvatarImage src="/avatar.jpg" :alt="profile.name" />
            <AvatarFallback>{{
              profile.name.slice(0, 2).toUpperCase()
            }}</AvatarFallback>
          </Avatar>

          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">Hi, 我是</p>
            <h1 class="text-3xl font-semibold tracking-tight md:text-5xl">
              {{ profile.name }}
            </h1>
            <div
              ref="taglineWrapEl"
              class="relative inline-block max-w-2xl"
              @mouseenter="onTaglineMouseEnter"
              @mouseleave="onTaglineMouseLeave"
              @contextmenu.prevent="openTaglineMenu('context')"
            >
              <Transition name="fade" mode="out-in">
                <p
                  :key="currentTagline"
                  class="text-base text-muted-foreground md:text-lg"
                >
                  {{ currentTagline }}
                </p>
              </Transition>

              <div
                v-if="taglineMenuOpen"
                class="absolute left-0 top-full z-20 mt-2 w-72 rounded-md border bg-background p-2"
                role="menu"
                aria-label="tagline selector"
              >
                <div class="flex items-center justify-between gap-2 pb-2">
                  <p class="text-xs text-muted-foreground pl-1">
                    <span v-if="taglinePinned">已固定</span>
                    <span v-else>随机轮播</span>
                  </p>
                  <div class="flex items-center gap-2">
                    <Button
                      v-if="taglinePinned"
                      type="button"
                      variant="ghost"
                      @click="unpinTagline"
                    >
                      取消固定
                    </Button>
                    <Button
                      v-else
                      type="button"
                      variant="ghost"
                      @click="pinCurrentTagline"
                    >
                      固定当前
                    </Button>
                  </div>
                </div>

                <div class="max-h-56 overflow-auto">
                  <button
                    v-for="t in profile.taglines"
                    :key="t"
                    type="button"
                    class="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
                    :class="t === taglinePinned ? 'bg-muted' : ''"
                    @click="pinTagline(t)"
                  >
                    {{ t }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button as-child>
            <a :href="profile.links.github" target="_blank" rel="noreferrer"
              >GitHub</a
            >
          </Button>
          <Button variant="outline" as-child>
            <a :href="profile.links.blog" target="_blank" rel="noreferrer"
              >Blog</a
            >
          </Button>
          <Button variant="outline" as-child>
            <a :href="`mailto:${profile.email}`">Email</a>
          </Button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge v-for="s in profile.highlights" :key="s" variant="secondary">{{
          s
        }}</Badge>
      </div>
    </section>

    <Separator class="my-10" />

    <!-- About -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">来看看 AI 是如何描述我的吧</h2>

      <blockquote
        class="mt-4 rounded-md border-l-4 border-primary/50 bg-primary/5 p-4 italic text-muted-foreground"
      >
        {{ profile.about }}
      </blockquote>
    </section>

    <Separator class="my-10" />

    <!-- Awards / Achievements -->
    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <h2 class="text-xl font-semibold">奖项与成就</h2>
        <p class="text-sm text-muted-foreground">hsn太菜</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="a in achievements" :key="a.title + a.year" class="h-full">
          <CardHeader class="space-y-2">
            <div
              class="h-40 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="a.coverPic"
                :src="a.coverPic"
                :alt="a.title"
                class="max-h-full max-w-full object-contain"
                loading="lazy"
                decoding="async"
                width="640"
                height="360"
              />
              <div
                v-else
                class="text-lg font-semibold tracking-widest text-muted-foreground"
              >
                {{ a.coverText }}
              </div>
            </div>
            <div class="flex items-center justify-between gap-2">
              <CardTitle class="text-base">{{ a.title }}</CardTitle>
              <Badge variant="outline">{{ a.year }}</Badge>
            </div>
            <CardDescription>{{ a.subtitle }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <Badge v-for="t in a.tags" :key="t" variant="secondary">{{
                t
              }}</Badge>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button v-if="a.link" size="sm" as-child>
                <a :href="a.link" target="_blank" rel="noreferrer">详情</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-10" />

    <!-- Projects -->
    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <h2 class="text-xl font-semibold">项目画廊</h2>
        <p class="text-sm text-muted-foreground">小玩具说是</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="p in projects" :key="p.title" class="h-full">
          <CardHeader class="space-y-2">
            <a
              v-if="p.cover"
              :href="p.demo || p.repo"
              target="_blank"
              rel="noreferrer"
              class="block"
            >
              <div
                class="h-40 rounded-md border bg-muted/30 p-2 flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="p.cover"
                  :alt="p.title"
                  class="max-h-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                />
              </div>
            </a>
            <div
              v-else
              class="h-40 rounded-md border bg-muted/30 p-2 flex items-center justify-center overflow-hidden"
            >
              <div
                class="text-lg font-semibold tracking-widest text-muted-foreground"
              >
                {{ initials(p.title) }}
              </div>
            </div>

            <CardTitle
              class="flex items-center justify-between gap-3 text-base"
            >
              <span>{{ p.title }}</span>
              <Badge v-if="p.status" variant="outline">{{ p.status }}</Badge>
            </CardTitle>
            <CardDescription>{{ p.desc }}</CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Badge v-for="t in p.tags" :key="t" variant="secondary">{{
                t
              }}</Badge>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button v-if="p.demo" size="sm" as-child>
                <a :href="p.demo" target="_blank" rel="noreferrer">打开</a>
              </Button>
              <Button v-if="p.repo" size="sm" variant="secondary" as-child>
                <a :href="p.repo" target="_blank" rel="noreferrer">源码</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-10" />

    <!-- Contact -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">联系</h2>
      <Card>
        <CardContent
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">欢迎联系哦!</p>
            <p class="font-medium">{{ profile.email }}</p>
          </div>
          <div class="flex gap-2">
            <Button as-child>
              <a :href="`mailto:${profile.email}`">发邮件</a>
            </Button>
            <Button variant="outline" as-child>
              <a :href="profile.links.telegram" target="_blank" rel="noreferrer"
                >TG</a
              >
            </Button>
          </div>
        </CardContent>
      </Card>

      <p class="pt-4 text-xs text-muted-foreground">
        © {{ new Date().getFullYear() }} {{ profile.name }} · Built with Vue +
        shadcn-vue · Nya?
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profile = {
  name: "HSN",
  taglines: [
    "吃饭喵",
    "Accepted!",
    "Time Limit Exceeded.",
    "Wrong Answer.",
    "Runtime Error.",
    "Memory Limit Exceeded.",
    "Compile Error.",
    "凡是hsn都是hsn!",
    "不...不懂啊",
    "是想长头发但是还在敲代码的hsn! ",
    "🍥",
    "?!",
    "orz",
    "喵喵喵",
    "hsn太菜",
    "吃!",
    "I'm ACMer.",
    "I'm Transgender.",
    "哈!",
    "Because light attracts bugs.",
    "Hello, World!",
    "Ciallo～(∠・ω<)⌒☆",
    "(雾",
    "(x",
    "(bushi",
    "(?",
    "呜呜呜",
  ],
  about:
    "你好! 我是 hsn，喜欢写代码也喜欢折腾新东西：一边做算法竞赛相关的学习与训练（ACMer），一边用 Python 等工具把想法快速落地。日常偏爱 Linux 环境，偶尔也会踩坑当“Bug Maker”。性格上有点宅，喜欢猫猫，也在做更像自己的自己。",
  email: "hsn@zh314.xyz",
  telegram: "hsn8086",
  highlights: [
    "ACMer",
    "Neko",
    "Transgender",
    "Python",
    "FastAPI",
    "Vue 3",
    "Arch Linux",
  ],
  links: {
    github: "https://github.com/hsn8086",
    blog: "https://www.zh314.xyz",
    telegram: "https://t.me/hsn8086",
  },
};

type Achievement = {
  title: string;
  subtitle: string;
  year: string;
  coverPic?: string;
  coverText: string;
  tags: string[];
  link?: string;
};

function initials(text: string) {
  const value = text.trim();
  if (!value) return "";
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return value.slice(0, 2).toUpperCase();
}

const achievements: Achievement[] = [
  {
    title: "ICPC 邀请赛 · Bronze",
    subtitle: "南昌 - Ciallo World",
    year: "2025",
    coverPic: "/achievements/2025_ICPC_Nanchang.jpg",
    coverText: "ICPC",
    tags: ["ICPC", "竞赛", "团队"],
    link: "https://www.zh314.xyz/2025/05/19/25ICPC%E5%8D%97%E6%98%8C%E9%82%80%E8%AF%B7%E8%B5%9B%E6%B8%B8%E8%AE%B0/",
  },
  {
    title: "GXCPC 邀请赛 · Silver",
    subtitle: "桂林 - 这个队名, 放到校园网上影响不好",
    year: "2025",
    coverPic: "/achievements/2025_GXCPC_Guilin.JPG",
    coverText: "GXCPC",
    tags: ["GXCPC", "竞赛", "团队"],
  },
  {
    title: "ICPC 区域赛 · 爆零 ",
    subtitle: "事已至此, 先吃汉堡吧",
    year: "2025",
    coverPic: "/achievements/2025_ICPC_Shanghai_reg.jpg",
    coverText: "ICPC",
    tags: ["ICPC", "竞赛", "团队"],
  },
];

type Project = {
  title: string;
  desc: string;
  tags: string[];
  status?: string;
  cover?: string;
  demo?: string;
  repo?: string;
};

const projects: Project[] = [
  {
    title: "This Is Editor",
    desc: "一个竞赛代码编辑器。",
    tags: ["编辑器", "竞赛"],
    status: "(不一定)持续更新",
    cover: "/projects/tie.png",
    repo: "https://github.com/hsn8086/this-is-editor",
  },
];

const taglineIndex = ref(0);
const taglinePinned = ref<string | null>(null);
const taglineMenuOpen = ref(false);
const taglineMenuMode = ref<"hover" | "context">("hover");
const taglineWrapEl = ref<HTMLElement | null>(null);

const currentTagline = computed(() => {
  if (taglinePinned.value) return taglinePinned.value;
  const list = profile.taglines;
  if (!list.length) return "";
  return list[taglineIndex.value % list.length];
});

let taglineTimer: number | undefined;
let taglineHoverCloseTimer: number | undefined;

function startTaglineRotation() {
  if (taglineTimer) return;
  if (profile.taglines.length <= 1) return;
  taglineTimer = window.setInterval(() => {
    taglineIndex.value = (taglineIndex.value + 1) % profile.taglines.length;
  }, 3200);
}

function stopTaglineRotation() {
  if (!taglineTimer) return;
  window.clearInterval(taglineTimer);
  taglineTimer = undefined;
}

function openTaglineMenu(mode: "hover" | "context") {
  taglineMenuOpen.value = true;
  taglineMenuMode.value = mode;
}

function closeTaglineMenu() {
  taglineMenuOpen.value = false;
}

function onTaglineMouseEnter() {
  if (taglineHoverCloseTimer) window.clearTimeout(taglineHoverCloseTimer);
  if (taglineMenuOpen.value && taglineMenuMode.value === "context") return;
  openTaglineMenu("hover");
}

function onTaglineMouseLeave() {
  if (taglineMenuMode.value !== "hover") return;
  if (taglineHoverCloseTimer) window.clearTimeout(taglineHoverCloseTimer);
  taglineHoverCloseTimer = window.setTimeout(() => {
    closeTaglineMenu();
  }, 120);
}

function pinTagline(value: string) {
  taglinePinned.value = value;
  closeTaglineMenu();
}

function pinCurrentTagline() {
  const value = currentTagline.value;
  if (!value) return;
  taglinePinned.value = value;
  closeTaglineMenu();
}

function unpinTagline() {
  taglinePinned.value = null;
  closeTaglineMenu();
}

function onGlobalPointerDown(event: PointerEvent) {
  if (!taglineMenuOpen.value) return;
  const root = taglineWrapEl.value;
  if (!root) return;
  const target = event.target as Node | null;
  if (target && root.contains(target)) return;
  closeTaglineMenu();
}

const TAGLINE_PIN_KEY = "homepage:taglinePinned";

onMounted(() => {
  if (profile.taglines.length <= 1) return;
  taglineIndex.value = Math.floor(Math.random() * profile.taglines.length);
  profile.taglines = profile.taglines
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const saved = window.localStorage.getItem(TAGLINE_PIN_KEY);
  if (saved && profile.taglines.includes(saved)) taglinePinned.value = saved;

  if (!taglinePinned.value) startTaglineRotation();
  window.addEventListener("pointerdown", onGlobalPointerDown);
});

watch(taglinePinned, (value) => {
  if (value) {
    stopTaglineRotation();
    window.localStorage.setItem(TAGLINE_PIN_KEY, value);
  } else {
    window.localStorage.removeItem(TAGLINE_PIN_KEY);
    startTaglineRotation();
  }
});

onBeforeUnmount(() => {
  if (taglineHoverCloseTimer) window.clearTimeout(taglineHoverCloseTimer);
  stopTaglineRotation();
  window.removeEventListener("pointerdown", onGlobalPointerDown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
