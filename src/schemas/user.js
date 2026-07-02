import z from 'zod';

export const createUserSchema = z.object({
  name: z
    .string('O nome é obrigatório.')
    .trim()
    .min(1, { message: 'Nome deve conter no mínimo 1 caractere.' }),
  last_name: z
    .string('O sobrenome é obrigatório.')
    .trim()
    .min(1, { message: 'Sobrenome deve conter no mínimo 1 caractere.' }),
  email: z
    .string('O email é obrigatório.')
    .trim()
    .email('Formato de e-mail inválido, tente novamente.')
    .min(1, { message: 'Email deve conter no mínimo 1 caractere.' }),
  password: z
    .string('A senha é obrigatória.')
    .trim()
    .min(6, { message: 'Senha deve conter no mínimo 6 caracteres.' }),
});

export const updateUserSchema = createUserSchema.partial();

export const loginUserSchema = z.object({
  email: z
    .string('O email é obrigatório.')
    .trim()
    .email('Formato de e-mail inválido, tente novamente.')
    .min(1, { message: 'Email deve conter no mínimo 1 caractere.' }),
  password: z
    .string('A senha é obrigatória.')
    .trim()
    .min(6, { message: 'Senha deve conter no mínimo 6 caracteres.' }),
});
