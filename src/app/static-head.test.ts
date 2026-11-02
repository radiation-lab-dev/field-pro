// index.html 의 #root 안 정적 머리 블록(2026-11-02, PR C) — JS 전 첫 화면 · 크롤러가 읽는 h1 · 부제 · 한 줄 소개가
// 앱(App.tsx 의 .hdr, 문구는 i18n.ts)이 그리는 것과 글자 그대로 같아야 한다. 어긋나면 React 가 붙는 순간 글이 바뀌고,
// 검색엔진이 본 제목과 사람이 보는 제목이 달라진다.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STRINGS } from "./i18n.ts";

const ROOT = join(import.meta.dirname, "..", "..");
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const app = readFileSync(join(ROOT, "src", "app", "App.tsx"), "utf8");

test("정적 머리: #root 안에 h1 하나, 부제 · 소개가 i18n 과 같다", () => {
  const m = html.match(/<div id="root">([\s\S]*?)<\/div><\/div>/);
  assert.ok(m, "#root 안 정적 .hdr 블록이 없다");
  const root = m[1];
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "index.html 의 h1 은 하나여야 한다");
  assert.ok(root.includes(`<h1>Radiation Field Pro <span class="sub">— ${STRINGS.sub}</span></h1>`), "h1 · 부제가 i18n sub 와 다르다");
  assert.ok(root.includes(`<p class="en">${STRINGS.intro}</p>`), "소개 문단이 i18n intro 와 다르다");
  assert.ok(root.includes(`<span class="std">ISO 4037-1/-3/-4 · GUM</span>`), "표준 꼬리표가 없다");
});

test("정적 머리: 앱의 h1 구조가 정적 사본과 같은 꼴이다", () => {
  assert.ok(app.includes(`<h1>Radiation Field Pro <span className="sub">— {t("sub")}</span></h1>`), "App.tsx 의 h1 이 바뀌었다 — index.html 정적 사본도 고친다");
  assert.ok(app.includes(`<span className="std">ISO 4037-1/-3/-4 · GUM</span>`));
  assert.ok(app.includes(`<p className="en">{t("intro")}</p>`));
});

test("정적 머리: 검색어 — 실제 기능 이름이 h1 · 소개에 있다", () => {
  const text = `${STRINGS.sub} ${STRINGS.intro}`;
  for (const w of ["X-ray tube spectrum calculator", "ISO 4037", "tube voltage", "HVL1", "ISO 4037-1"]) assert.ok(text.includes(w), w);
});
