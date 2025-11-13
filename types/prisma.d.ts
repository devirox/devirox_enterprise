declare module '@prisma/client' {
  export type Role =
    | 'SUPER_ADMIN'
    | 'FINANCE_STAFF'
    | 'MARKETPLACE_SELLER'
    | 'REALTOR'
    | 'CUSTOMER'

  export interface User {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    role: Role
    isApproved: boolean
    hashedPassword: string | null
    createdAt: Date
    updatedAt: Date
  }

  export interface Product {
    id: string
    title: string
    description: string | null
    price: unknown
    sellerId: string
    createdAt: Date
  }

  export interface Ad {
    id: string
    productId: string
    active: boolean
    createdAt: Date
  }

  export interface Listing {
    id: string
    title: string
    description: string | null
    price: unknown
    realtorId: string
    type: string
    createdAt: Date
  }

  export interface Savings {
    id: string
    userId: string
    balance: unknown
    createdAt: Date
  }

  export interface Loan {
    id: string
    userId: string
    amount: unknown
    interestRate: number
    status: string
    createdAt: Date
  }

  export interface VerificationToken {
    identifier: string
    token: string
    expires: Date
  }

  export interface Account {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export interface Session {
    id: string
    sessionToken: string
    userId: string
    expires: Date
  }

  export interface ImageAsset {
    id: string
    title: string | null
    publicId: string
    url: string
    folder: string | null
    isActive: boolean
    createdAt: Date
  }

  export class PrismaClient {
    user: {
      findMany(args?: any): Promise<User[]>
      findUnique(args: any): Promise<User | null>
      findFirst(args: any): Promise<User | null>
      update(args: any): Promise<User>
      create(args: any): Promise<User>
      delete(args: any): Promise<User>
      upsert(args: any): Promise<User>
    }
    product: {
      findMany(args?: any): Promise<Product[]>
      findUnique(args: any): Promise<Product | null>
      update(args: any): Promise<Product>
      delete(args: any): Promise<Product>
      create(args: any): Promise<Product>
    }
    ad: {
      findMany(args?: any): Promise<Ad[]>
      create(args: any): Promise<Ad>
      update(args: any): Promise<Ad>
    }
    listing: {
      findMany(args?: any): Promise<Listing[]>
      findUnique(args: any): Promise<Listing | null>
      update(args: any): Promise<Listing>
      delete(args: any): Promise<Listing>
      create(args: any): Promise<Listing>
    }
    savings: {
      findMany(args?: any): Promise<Savings[]>
      create(args: any): Promise<Savings>
      deleteMany(args: any): Promise<{ count: number }>
    }
    loan: {
      findMany(args?: any): Promise<Loan[]>
      create(args: any): Promise<Loan>
      update(args: any): Promise<Loan>
    }
    verificationToken: {
      findUnique(args: any): Promise<VerificationToken | null>
      create(args: any): Promise<VerificationToken>
      delete(args: any): Promise<VerificationToken | null>
      deleteMany(args: any): Promise<{ count: number }>
    }
    account: {
      findUnique(args: any): Promise<Account | null>
      findFirst(args: any): Promise<Account | null>
      create(args: any): Promise<Account>
      update(args: any): Promise<Account>
      delete(args: any): Promise<Account>
      deleteMany(args: any): Promise<{ count: number }>
      upsert(args: any): Promise<Account>
    }
    session: {
      findUnique(args: any): Promise<Session | null>
      create(args: any): Promise<Session>
      update(args: any): Promise<Session>
      delete(args: any): Promise<Session>
      deleteMany(args: any): Promise<{ count: number }>
    }
    imageAsset: {
      findMany(args?: any): Promise<ImageAsset[]>
      create(args: any): Promise<ImageAsset>
    }
    $connect(): Promise<void>
    $disconnect(): Promise<void>
  }
}
