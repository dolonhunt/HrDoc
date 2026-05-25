export interface Employee {
  id: string
  name: string
  designation: string
  department: string
  joining_date: string
  basic: number
  house_rent: number
  conveyance: number
  medical: number
  food_mobile: number
  cash: number
  gross: number
  tax: number
  net: number
  bank_account: string
  bank_name: string
  nid: string
  mobile: string
  email: string
  status: 'active' | 'inactive'
  ref_code: string
  createdAt?: string
}

export interface CompanyConfig {
  name: string
  address: string
  phone: string
  email: string
  proprietor_name: string
  proprietor_designation: string
  brand_color: string
  logo_path: string
}

export const DEFAULT_COMPANY: CompanyConfig = {
  name: 'Beyond Headlines',
  address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.',
  phone: '',
  email: '',
  proprietor_name: 'Saqib Ahmed',
  proprietor_designation: 'Proprietor',
  brand_color: '#FF2109',
  logo_path: '/Logo-main.png',
}
