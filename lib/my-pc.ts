// "マイPC": the reader's GPU / memory / Windows version, saved only in their
// browser (localStorage), compared with a game's minimum requirements.
//
// What is exact and what is an estimate:
// - Windows version, memory, VRAM and hardware ray tracing are compared
//   against the published requirement and can decide "×".
// - GPU speed is compared with an editorial tier (`tier` below), a coarse
//   ranking of well-known cards. It can only lower the result to "△" and is
//   always labelled as an estimate on the page.

export type Gpu = {
  id: string;
  name: string;
  vramGb: number;
  /** Upper bound for an older combined choice whose exact model is unknown. */
  vramMaxGb?: number;
  /** Hardware ray tracing (RTX / RX 6000+ / Arc). */
  rt: boolean;
  /** Editorial performance tier, higher is faster. */
  tier: number;
};

const g = (
  id: string,
  name: string,
  vramGb: number,
  rt: boolean,
  tier: number,
): Gpu => ({ id, name, vramGb, rt, tier });

export const gpus: Gpu[] = [
  g('igpu', '内蔵GPU（Intel UHD・Iris Xe・Radeon内蔵など）', 0, false, 1),
  g('gtx-650-ti', 'GeForce GTX 650 Ti', 1, false, 1),
  g('gtx-780', 'GeForce GTX 780', 3, false, 3),
  g('gtx-960', 'GeForce GTX 960', 2, false, 2),
  g('gtx-970', 'GeForce GTX 970', 4, false, 3),
  g('gtx-1050-ti', 'GeForce GTX 1050 Ti', 4, false, 3),
  g('gtx-1060-3gb', 'GeForce GTX 1060 3GB', 3, false, 4),
  g('gtx-1060-6gb', 'GeForce GTX 1060 6GB', 6, false, 4),
  g('gtx-1070', 'GeForce GTX 1070', 8, false, 5),
  g('gtx-1080', 'GeForce GTX 1080', 8, false, 6),
  g('gtx-1080-ti', 'GeForce GTX 1080 Ti', 11, false, 7),
  g('gtx-1630', 'GeForce GTX 1630', 4, false, 2),
  g('gtx-1650', 'GeForce GTX 1650', 4, false, 3),
  g('gtx-1650-super', 'GeForce GTX 1650 SUPER', 4, false, 4),
  g('gtx-1660', 'GeForce GTX 1660', 6, false, 5),
  g('gtx-1660-super', 'GeForce GTX 1660 SUPER / Ti', 6, false, 5),
  g('rtx-2060', 'GeForce RTX 2060', 6, true, 6),
  g('rtx-2060-super', 'GeForce RTX 2060 SUPER', 8, true, 6),
  g('rtx-2070', 'GeForce RTX 2070 / 2070 SUPER', 8, true, 7),
  g('rtx-2080', 'GeForce RTX 2080 / 2080 SUPER', 8, true, 8),
  g('rtx-2080-ti', 'GeForce RTX 2080 Ti', 11, true, 8),
  { ...g('rtx-3050', 'GeForce RTX 3050（容量未選択）', 6, true, 5), vramMaxGb: 8 },
  g('rtx-3050-6gb', 'GeForce RTX 3050（6GB）', 6, true, 5),
  g('rtx-3050-8gb', 'GeForce RTX 3050（8GB）', 8, true, 5),
  { ...g('rtx-3060', 'GeForce RTX 3060（容量未選択）', 8, true, 7), vramMaxGb: 12 },
  g('rtx-3060-8gb', 'GeForce RTX 3060（8GB）', 8, true, 7),
  g('rtx-3060-12gb', 'GeForce RTX 3060（12GB）', 12, true, 7),
  g('rtx-3060-ti', 'GeForce RTX 3060 Ti', 8, true, 8),
  g('rtx-3070', 'GeForce RTX 3070 / 3070 Ti', 8, true, 9),
  { ...g('rtx-3080', 'GeForce RTX 3080（容量未選択）', 10, true, 10), vramMaxGb: 12 },
  g('rtx-3080-10gb', 'GeForce RTX 3080（10GB）', 10, true, 10),
  g('rtx-3080-12gb', 'GeForce RTX 3080（12GB）', 12, true, 10),
  g('rtx-3090', 'GeForce RTX 3090', 24, true, 11),
  g('rtx-4060', 'GeForce RTX 4060', 8, true, 8),
  { ...g('rtx-4060-ti', 'GeForce RTX 4060 Ti（容量未選択）', 8, true, 9), vramMaxGb: 16 },
  g('rtx-4060-ti-8gb', 'GeForce RTX 4060 Ti（8GB）', 8, true, 9),
  g('rtx-4060-ti-16gb', 'GeForce RTX 4060 Ti（16GB）', 16, true, 9),
  g('rtx-4070', 'GeForce RTX 4070 / 4070 SUPER', 12, true, 10),
  // Preserve the old combined ID: saved selections cannot reveal which model.
  // NVIDIA RTX 4070 family specifications: Ti 12GB, Ti SUPER 16GB.
  { ...g('rtx-4070-ti', 'GeForce RTX 4070 Ti / Ti SUPER（型番未選択）', 12, true, 11), vramMaxGb: 16 },
  g('rtx-4070-ti-12gb', 'GeForce RTX 4070 Ti（12GB）', 12, true, 11),
  g('rtx-4070-ti-super-16gb', 'GeForce RTX 4070 Ti SUPER（16GB）', 16, true, 11),
  g('rtx-4080', 'GeForce RTX 4080 / 4080 SUPER', 16, true, 12),
  g('rtx-4090', 'GeForce RTX 4090', 24, true, 13),
  g('rtx-5050', 'GeForce RTX 5050', 8, true, 7),
  { ...g('rtx-5060', 'GeForce RTX 5060 / 5060 Ti（型番・容量未選択）', 8, true, 9), vramMaxGb: 16 },
  g('rtx-5060-8gb', 'GeForce RTX 5060（8GB）', 8, true, 9),
  g('rtx-5060-ti-8gb', 'GeForce RTX 5060 Ti（8GB）', 8, true, 9),
  g('rtx-5060-ti-16gb', 'GeForce RTX 5060 Ti（16GB）', 16, true, 9),
  g('rtx-5070', 'GeForce RTX 5070', 12, true, 11),
  g('rtx-5070-ti', 'GeForce RTX 5070 Ti', 16, true, 12),
  g('rtx-5080', 'GeForce RTX 5080', 16, true, 12),
  g('rtx-5090', 'GeForce RTX 5090', 32, true, 14),
  g('rx-470', 'Radeon RX 470', 4, false, 3),
  g('rx-480', 'Radeon RX 480', 8, false, 3),
  g('rx-570', 'Radeon RX 570', 4, false, 3),
  g('rx-580', 'Radeon RX 580', 8, false, 4),
  g('rx-590', 'Radeon RX 590', 8, false, 4),
  g('rx-vega-56', 'Radeon RX Vega 56 / 64', 8, false, 6),
  g('rx-5500-xt', 'Radeon RX 5500 XT', 8, false, 4),
  g('rx-5600-xt', 'Radeon RX 5600 XT', 6, false, 6),
  g('rx-5700', 'Radeon RX 5700', 8, false, 6),
  g('rx-5700-xt', 'Radeon RX 5700 XT', 8, false, 7),
  g('rx-6400', 'Radeon RX 6400', 4, true, 2),
  g('rx-6500-xt', 'Radeon RX 6500 XT', 4, true, 3),
  g('rx-6600', 'Radeon RX 6600', 8, true, 6),
  g('rx-6600-xt', 'Radeon RX 6600 XT / 6650 XT', 8, true, 7),
  g('rx-6700-xt', 'Radeon RX 6700 XT / 6750 XT', 12, true, 8),
  g('rx-6800', 'Radeon RX 6800', 16, true, 10),
  g('rx-6800-xt', 'Radeon RX 6800 XT / 6900 XT', 16, true, 11),
  { ...g('rx-7600', 'Radeon RX 7600 / 7600 XT（型番・容量未選択）', 8, true, 7), vramMaxGb: 16 },
  g('rx-7600-8gb', 'Radeon RX 7600（8GB）', 8, true, 7),
  g('rx-7600-xt-16gb', 'Radeon RX 7600 XT（16GB）', 16, true, 7),
  g('rx-7700-xt', 'Radeon RX 7700 XT', 12, true, 9),
  g('rx-7800-xt', 'Radeon RX 7800 XT', 16, true, 10),
  // AMD product specifications: XT 20GB, GRE 16GB. Keep legacy ID ambiguous.
  { ...g('rx-7900-xt', 'Radeon RX 7900 XT / GRE（型番未選択）', 16, true, 12), vramMaxGb: 20 },
  g('rx-7900-xt-20gb', 'Radeon RX 7900 XT（20GB）', 20, true, 12),
  g('rx-7900-gre-16gb', 'Radeon RX 7900 GRE（16GB）', 16, true, 12),
  g('rx-7900-xtx', 'Radeon RX 7900 XTX', 24, true, 13),
  { ...g('rx-9060-xt', 'Radeon RX 9060 XT（型番・容量未選択）', 8, true, 9), vramMaxGb: 16 },
  g('rx-9060-xt-8gb', 'Radeon RX 9060 XT（8GB）', 8, true, 9),
  g('rx-9060-xt-16gb', 'Radeon RX 9060 XT（16GB）', 16, true, 9),
  g('rx-9070', 'Radeon RX 9070 / 9070 XT', 16, true, 12),
  g('arc-a310', 'Intel Arc A310', 4, true, 2),
  g('arc-a380', 'Intel Arc A380', 6, true, 3),
  g('arc-a580', 'Intel Arc A580', 8, true, 6),
  { ...g('arc-a750', 'Intel Arc A750 / A770（型番・容量未選択）', 8, true, 7), vramMaxGb: 16 },
  g('arc-a750-8gb', 'Intel Arc A750（8GB）', 8, true, 7),
  g('arc-a770-8gb', 'Intel Arc A770（8GB）', 8, true, 7),
  g('arc-a770-16gb', 'Intel Arc A770（16GB）', 16, true, 7),
  { ...g('arc-b570', 'Intel Arc B570 / B580（型番・容量未選択）', 10, true, 8), vramMaxGb: 12 },
  g('arc-b570-10gb', 'Intel Arc B570（10GB）', 10, true, 8),
  g('arc-b580-12gb', 'Intel Arc B580（12GB）', 12, true, 8),
];

export const gpuById = (id: string) => gpus.find((gpu) => gpu.id === id);

export type MyPc = { gpu: string; ramGb: number; windows: 10 | 11 };

export const MY_PC_KEY = 'gemnao-my-pc';
export const MY_GAMES_KEY = 'gemnao-my-games';

/** Structured minimum requirement (from the store listing). */
export type MinSpec = {
  /** Reference GPUs named in the minimum requirement (gpus ids). */
  gpu: string[];
  vramGb?: number;
  ramGb: number;
  windows11?: boolean;
  rayTracing?: boolean;
};

export type Fit = {
  result: 'ok' | 'maybe' | 'no';
  reasons: string[];
};

export function checkFit(pc: MyPc, spec: MinSpec): Fit {
  const gpu = gpuById(pc.gpu);
  const no: string[] = [];
  const maybe: string[] = [];
  if (spec.windows11 && pc.windows !== 11) no.push('最低環境がWindows 11です');
  if (pc.ramGb < spec.ramGb)
    no.push(`メモリが最低環境（${spec.ramGb}GB）より少ない`);
  if (spec.rayTracing && gpu && !gpu.rt)
    no.push('レイトレーシング対応GPUが必須です');
  if (spec.vramGb && gpu && gpu.vramGb < spec.vramGb) {
    if ((gpu.vramMaxGb ?? gpu.vramGb) < spec.vramGb)
      no.push(`VRAMが最低環境（${spec.vramGb}GB）より少ない`);
    else
      maybe.push(`VRAM容量で判定が変わります。マイページでGPUの型番を選び直してください（最低${spec.vramGb}GB）`);
  }
  const reference = spec.gpu
    .map(gpuById)
    .filter((item): item is Gpu => Boolean(item));
  if (gpu && reference.length) {
    const minTier = Math.min(...reference.map((item) => item.tier));
    if (gpu.tier < minTier)
      maybe.push(
        `GPUの性能が最低環境の${reference[0].name.replace(/ \/.*$/, '')}を下回る目安`,
      );
  }
  if (no.length) return { result: 'no', reasons: no };
  if (maybe.length) return { result: 'maybe', reasons: maybe };
  return { result: 'ok', reasons: ['最低環境を満たす目安です'] };
}
