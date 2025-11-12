declare module 'bcryptjs' {
  export function hash(s: string, saltOrRounds?: number | string): Promise<string> | string
  export function compare(s: string, hash: string): Promise<boolean> | boolean
  export default { hash, compare }
}
