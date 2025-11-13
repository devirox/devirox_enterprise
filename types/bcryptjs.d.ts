declare module 'bcryptjs' {
  export function hash(s: string, saltOrRounds?: number | string): Promise<string> | string
  export function hashSync(s: string, saltOrRounds?: number | string): string
  export function compare(s: string, hash: string): Promise<boolean> | boolean
  export function compareSync(s: string, hash: string): boolean
  const _default: {
    hash: typeof hash
    hashSync: typeof hashSync
    compare: typeof compare
    compareSync: typeof compareSync
  }
  export default _default
}
