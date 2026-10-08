import { classifyQaAccessSecret } from './secret-format.mjs';
// No provider imports, network requests, file writes or credential derivation.
process.stdout.write(classifyQaAccessSecret(process.env.GEMNAO_QA_ACCESS_PASSPHRASE) + '\n');
