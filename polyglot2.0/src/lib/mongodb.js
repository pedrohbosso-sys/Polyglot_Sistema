import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Defina MONGODB_URI no arquivo .env.local');

let cache = global.mongoose;
if (!cache) cache = global.mongoose = { conn: null, promise: null };

export async function conectarMongoDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) cache.promise = mongoose.connect(uri).then((m) => m);
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  return cache.conn;
}
