import { readSolutions, type SavedSolution } from './saved-solutions';
import { ACTIVE_CASE_KEY } from './support-record';
export function openIssues(items: SavedSolution[], gameSlug: string) {
  return items
    .filter((i) => i.gameSlug === gameSlug && i.status !== 'resolved')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
// Re-read before selection: a deleted or resolved note must not become active.
export function selectOpenIssue(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  gameSlug: string,
  id: string,
) {
  if (!openIssues(readSolutions(storage), gameSlug).some((i) => i.id === id))
    return false;
  storage.setItem(ACTIVE_CASE_KEY, id);
  return storage.getItem(ACTIVE_CASE_KEY) === id;
}
export const returnCopy = {
  ja: {
    heading: '前回の症状・試したこと',
    empty: '未解決のノートはありません。',
    open: 'この問題の続きから',
    last: '最後に試したこと',
    error:
      'ノートを開けませんでした。削除・解決済みの状態やブラウザの保存設定を確認してください。',
  },
  en: {
    heading: 'Previous symptoms and attempts',
    empty: 'No open issue notes.',
    open: 'Continue this issue',
    last: 'Last recorded attempt',
    error:
      'Could not open this note. Check whether it was deleted or resolved, and your browser storage settings.',
  },
  zh: {
    heading: '之前的症状与尝试',
    empty: '没有未解决的问题笔记。',
    open: '继续处理此问题',
    last: '最近记录的尝试',
    error: '无法打开笔记。请检查是否已删除或解决，以及浏览器存储设置。',
  },
  es: {
    heading: 'Síntomas e intentos anteriores',
    empty: 'No hay notas de problemas pendientes.',
    open: 'Continuar este problema',
    last: 'Último intento registrado',
    error:
      'No se pudo abrir la nota. Comprueba si se eliminó o resolvió y revisa el almacenamiento del navegador.',
  },
};
