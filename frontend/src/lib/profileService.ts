import { supabase } from './supabase';

export type UserRole = 'academia' | 'research';

export const roleTableMap: Record<UserRole, string> = {
  academia: 'academia',
  research: 'research',
};

export async function getAuthUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function fetchBaseProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('name, email, role, pfp, mode')
    .eq('id', userId)
    .single();
}

export async function fetchRoleProfile(
  userId: string,
  role: UserRole
) {
  const table = roleTableMap[role];
  return supabase
    .from(table)
    .select('*')
    .eq('id', userId)
    .single();
}

export async function saveRoleProfile(
  userId: string,
  role: UserRole,
  data: Record<string, any>
) {
  const table = roleTableMap[role];
  
  console.log(`Saving to table: ${table}`);
  console.log('User ID:', userId);
  console.log('Data to save:', data);

  // Filter out undefined/null values and ensure we have data to save
  const filteredData = Object.keys(data).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null && key !== 'id') {
      acc[key] = data[key];
    }
    return acc;
  }, {} as Record<string, any>);

  console.log('Filtered data:', filteredData);

  if (Object.keys(filteredData).length === 0) {
    console.log('No data to save, skipping');
    return { data: null, error: null };
  }

  const payload = {
    id: userId,
    ...filteredData,
  };

  console.log('Final payload:', payload);

  const result = await supabase
    .from(table)
    .upsert(payload)
    .select();

  console.log('Upsert result:', result);
  
  if (result.error) {
    console.error('Supabase error:', result.error);
    throw result.error;
  }

  return result;
}

export async function updateBaseProfile(userId: string, data: { name?: string; email?: string; role?: UserRole; pfp?: string; mode?: 'light' | 'dark' }) {
  console.log('Updating base profile for user:', userId);
  console.log('Base profile data:', data);

  // Filter out undefined values
  const filteredData: Partial<typeof data> = {};
  const possibleKeys: Array<keyof typeof data> = ['name', 'email', 'role', 'pfp', 'mode'];
  possibleKeys.forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      filteredData[key] = value;
    }
  });

  console.log('Filtered base data:', filteredData);

  if (Object.keys(filteredData).length === 0) {
    console.log('No base profile data to update');
    return { data: null, error: null };
  }

  // Update profiles table
  const profileResult = await supabase
    .from('profiles')
    .update(filteredData)
    .eq('id', userId)
    .select();

  console.log('Profile update result:', profileResult);

  if (profileResult.error) {
    console.error('Profile update error:', profileResult.error);
    throw profileResult.error;
  }

  // If email is being updated, also update Supabase auth
  if (filteredData.email) {
    console.log('Updating auth email to:', filteredData.email);
    const authResult = await supabase.auth.updateUser({ email: filteredData.email });
    console.log('Auth update result:', authResult);
    
    if (authResult.error) {
      console.error('Auth update error:', authResult.error);
      throw authResult.error;
    }
    
    return { profile: profileResult, auth: authResult };
  }

  return profileResult;
}

export async function updateUserMode(userId: string, mode: 'light' | 'dark') {
  console.log('Updating user mode to:', mode);
  
  const result = await supabase
    .from('profiles')
    .update({ 
      mode: mode,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select();

  console.log('Mode update result:', result);

  if (result.error) {
    console.error('Mode update error:', result.error);
    throw result.error;
  }

  return result;
}

/* ================= PROFILE PICTURE STORAGE ================= */

export async function uploadProfilePicture(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload file to Supabase storage
  const { error } = await supabase.storage
    .from('pfp')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('pfp')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteProfilePicture(userId: string) {
  // List files for the user
  const { data: files } = await supabase.storage
    .from('pfp')
    .list('', {
      search: userId
    });

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${file.name}`);
    const { error } = await supabase.storage
      .from('pfp')
      .remove(filePaths);
    
    if (error) throw error;
  }
}

export function getProfilePictureUrl(userId: string) {
  // Try to get URL for common image formats
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  for (const ext of extensions) {
    const { data: { publicUrl } } = supabase.storage
      .from('pfp')
      .getPublicUrl(`${userId}.${ext}`);
    
    // Return the first URL that exists
    if (publicUrl) {
      return publicUrl;
    }
  }
  
  return null;
}