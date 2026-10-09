'use client';
import { useEffect, useState } from 'react';
import { diagnosisRequest } from '@/lib/diagnosis/local';
import { clientDiagnosisConfig, isDiagnosisConfig, type DiagnosisConfig } from '@/lib/diagnosis/client-config';
export function useDiagnosisConfig() {
  const [config, setConfig] = useState({
    enabled: false, sharing: false, metrics: false, confirmed: false,
    localOnly: process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true',
    previewSharing: false,
  });
  useEffect(() => {
    let active = true;
    void diagnosisRequest<DiagnosisConfig>('/config').then((next) => {
      if (active && isDiagnosisConfig(next)) setConfig({ ...clientDiagnosisConfig(next, location.origin,
        process.env.NEXT_PUBLIC_DIAGNOSIS_LOCAL_BETA === 'true',
        process.env.NEXT_PUBLIC_DIAGNOSIS_ENABLED === 'true'), confirmed: true });
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  return config;
}
