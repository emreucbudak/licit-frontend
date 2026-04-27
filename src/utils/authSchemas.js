import { z } from 'zod'

import { passwordMeetsMinimumRules } from './passwordRules'

export const passwordSchema = z
  .string()
  .refine((value) => value.trim().length > 0, 'Sifre gerekli')
  .refine(passwordMeetsMinimumRules, 'Sifre kurallari karsilanmali')

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Ad gerekli'),
  lastName: z.string().trim().min(1, 'Soyad gerekli'),
  email: z.string().trim().min(1, 'E-posta gerekli').email('Gecerli e-posta gir'),
  password: passwordSchema,
})

export const createNewPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Sifre onayi gerekli'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Sifreler eslesmeli',
    path: ['confirmPassword'],
  })
