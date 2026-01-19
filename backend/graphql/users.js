import supabase from '../supabase.js';

const mapSupabaseUser = (user) => ({
  id: user.id,
  email: user.email,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

export const userTypeDefs = `
  type AuthUser {
    id: ID!
    email: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    user: AuthUser!
    accessToken: String
    refreshToken: String
  }
`;

export const userMutationFields = `
  updateUser(
    email: String!
    currentPassword: String!
    newPassword: String
  ): AuthUser!
`;

export const createUserResolvers = () => ({
  updateUser: (args, context) => updateUser(args, context),
});

/**
 * Update the user's password
 */
const updateUser = async ({ email, currentPassword, newPassword }, context) => {
  const db = context?.db;
  if (!currentPassword) {
    throw new Error('Current password is required');
  }
  if (!newPassword) {
    throw new Error('New password is required');
  }

  const verifyResult = await db.query(
    `
      SELECT id, encrypted_password = crypt($1, encrypted_password) AS valid
      FROM auth.users
      WHERE email = $2
    `,
    [currentPassword, email]
  );

  if (verifyResult.rowCount === 0 || !verifyResult.rows[0]?.valid) {
    throw new Error('Invalid current password');
  }

  const userId = verifyResult.rows[0].id;

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Update failed');
  }

  const { error: signOutError } = await supabase.auth.admin.signOut(userId);
  if (signOutError) {
    throw new Error(signOutError.message);
  }

  return mapSupabaseUser(data.user);
};
