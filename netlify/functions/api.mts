import { getStore } from '@netlify/blobs';
import type { Config } from '@netlify/functions';
import { handleApi, type RecetarioStore } from '../lib/recetario-core';

// Guarda todo el recetario (recetas y enlaces de clientas) en Netlify Blobs,
// el almacenamiento propio de Netlify. Así tú y tu clienta ven los mismos datos.
const KEY = 'recetario';

export default async (req: Request) => {
  const blobs = getStore({ name: 'recetario', consistency: 'strong' });
  const store: RecetarioStore = {
    load: async () => (await blobs.get(KEY, { type: 'json' })) ?? null,
    save: async (data) => {
      await blobs.setJSON(KEY, data);
    },
  };
  return handleApi(req, store);
};

export const config: Config = {
  path: '/api/*',
};
