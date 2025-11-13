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

  export class PrismaClient {
    user: {
      findMany(args?: any): Promise<User[]>
      findUnique(args: any): Promise<User | null>
      update(args: any): Promise<User>
      create(args: any): Promise<User>
    }
    product: {
      findMany(args?: any): Promise<Product[]>
      findUnique(args: any): Promise<Product | null>
      update(args: any): Promise<Product>
      delete(args: any): Promise<Product>
      create(args: any): Promise<Product>
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
    }
    loan: {
      findMany(args?: any): Promise<Loan[]>
      create(args: any): Promise<Loan>
      update(args: any): Promise<Loan>
    }
    verificationToken: {
      findUnique(args: any): Promise<VerificationToken | null>
      create(args: any): Promise<VerificationToken>
      deleteMany(args: any): Promise<{ count: number }>
    }
  }
}
