// Lightweight wrapper that uses bcryptjs (pure JS) to avoid native bindings
// Exports hash and compare helpers used by auth code.
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string, rounds = 10) {
  return bcrypt.hash(password, rounds)
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export default { hashPassword, comparePassword }
