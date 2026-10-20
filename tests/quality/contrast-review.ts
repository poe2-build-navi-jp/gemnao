import { execFileSync } from 'node:child_process';
import type { Page, TestInfo } from '@playwright/test';
import type { Result } from 'axe-core';
import { expect } from './fixtures';

// Review only known causes; a new axe incomplete result must fail for inspection.
export async function reviewContrast(page: Page, incomplete: Result[], info: TestInfo, name: string) {
  const targets: string[] = [];
  const decorative: string[] = [];
  for (const rule of incomplete) {
    expect(rule.id).toBe('color-contrast');
    for (const node of rule.nodes) {
      expect(node.target).toHaveLength(1);
      const selector = String(node.target[0]);
      const reason = node.any.find(check => check.id === 'color-contrast')?.data?.messageKey;
      expect(['nonBmp', 'bgGradient']).toContain(reason);
      const locator = page.locator(selector);
      if (await locator.getAttribute('aria-hidden') === 'true') {
        expect(reason).toBe('nonBmp');
        expect(await locator.textContent()).toBe('→');
        expect(await locator.locator('..').innerText()).toMatch(/^(See all guides|Report an issue or a fix)\s*→$/);
        decorative.push(selector);
      } else targets.push(selector);
    }
  }
  if (!targets.length) {
    await info.attach(`${name}-contrast-review`, {body:JSON.stringify({decorative, results:[]}), contentType:'application/json'});
    return;
  }
  const metrics = await page.evaluate(selectors => selectors.map(selector => {
    const element = document.querySelector(selector)!;
    const style = getComputedStyle(element);
    for (let parent: Element | null = element; parent; parent = parent.parentElement) {
      const s = getComputedStyle(parent);
      if (s.opacity !== '1' || s.filter !== 'none' || s.mixBlendMode !== 'normal')
        throw new Error('Unsupported compositing: ' + selector);
    }
    const rgba = style.color.match(/[\d.]+/g)!.map(Number);
    if (rgba.length > 3 && rgba[3] !== 1) throw new Error('Transparent foreground');
    const range = document.createRange();
    range.selectNodeContents(element);
    return { selector, text: element.textContent, rgb: rgba.slice(0, 3),
      requiredRatio: parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700) ? 3 : 4.5,
      rects: Array.from(range.getClientRects(), r => ({x:r.x + scrollX, y:r.y + scrollY, width:r.width, height:r.height})) };
  }), targets);
  // Hide glyph paint only, retaining layout and the actual gradient/background.
  const sheet = await page.addStyleTag({content: `${targets.join(',')} { -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`});
  const background = info.outputPath(`${name}-contrast-background.png`);
  try { await page.screenshot({path: background, fullPage:true}); }
  finally { await sheet.evaluate(el => el.parentNode?.removeChild(el)); }
  const results: Array<{selector:string; minimumRatio:number; requiredRatio:number}> = JSON.parse(execFileSync('python3', ['tests/quality/contrast-pixels.py', background], {input:JSON.stringify(metrics), encoding:'utf8'}));
  await info.attach(`${name}-contrast-review`, {body:JSON.stringify({decorative, results}, null, 2), contentType:'application/json'});
  for (const result of results) expect(result.minimumRatio, result.selector).toBeGreaterThanOrEqual(result.requiredRatio);
}
