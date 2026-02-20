import { supabase } from './supabase';
import { UserRole } from './profileService';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  orcid?: string;
}

export async function createNewUser(request: CreateUserRequest) {
  console.log('Creating new user:', request);

  try {
    // Use RPC function to create user securely
    const { data, error } = await supabase.rpc('create_user_as_admin', {
      p_email: request.email,
      p_password: request.password,
      p_name: request.name,
      p_role: request.role,
      p_orcid: request.orcid || null
    });

    if (error) {
      console.error('User creation error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    const result = data?.[0];
    if (!result?.success) {
      throw new Error(result?.message || 'Failed to create user');
    }

    console.log('User created successfully:', result.user_id);

    return {
      success: true,
      userId: result.user_id,
      message: result.message
    };

  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    // Get current admin user ID
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Admin authentication required');
    }
    const adminId = user.id;

    // Fetch mentors created by this admin
    const { data: mentors, error: mentorError } = await supabase
      .from('mentor')
      .select(`
        id,
        created_by,
        profiles!inner(name, email, role, created_at)
      `)
      .eq('created_by', adminId);

    console.log('👨‍🏫 Mentors query result:', { mentors, mentorError, adminId });

    // Fetch researchers created by this admin  
    const { data: researchers, error: researcherError } = await supabase
      .from('researcher')
      .select(`
        id,
        created_by,
        profiles!inner(name, email, role, created_at)
      `)
      .eq('created_by', adminId);

    console.log('🔬 Researchers query result:', { researchers, researcherError, adminId });

    if (mentorError || researcherError) {
      console.error('Failed to fetch users:', mentorError || researcherError);
      throw new Error('Failed to fetch users');
    }

    // Combine and sort users
    const allUsers = [
      ...(mentors || []).map(m => ({ 
        ...m.profiles[0], 
        created_by: m.created_by
      })),
      ...(researchers || []).map(r => ({ 
        ...r.profiles[0], 
        created_by: r.created_by
      }))
    ].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return allUsers;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

export async function getAdminStats() {
  try {
    console.log('🔍 Starting getAdminStats...');
    
    // Get current admin user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 Auth user:', { user, authError });
    
    if (authError || !user) {
      console.error('❌ Admin authentication failed:', authError);
      throw new Error('Admin authentication required');
    }
    const adminId = user.id;
    console.log('✅ Admin ID:', adminId);

    // Get counts of users created by this admin
    console.log('🔍 Checking mentor table structure...');
    const { data: mentorSample, error: mentorSampleError } = await supabase
      .from('mentor')
      .select('*')
      .limit(1);
    
    console.log('👨‍🏫 Mentor sample data:', { mentorSample, mentorSampleError });
    console.log('🔍 Checking researcher table structure...');
    const { data: researcherSample, error: researcherSampleError } = await supabase
      .from('researcher')
      .select('*')
      .limit(1);

    console.log('� Researcher sample data:', { researcherSample, researcherSampleError });

    const { count: mentorCount, error: mentorError } = await supabase
      .from('mentor')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', adminId);
    
    console.log('�‍🏫 Mentor query result:', { mentorCount, mentorError, adminId });
    
    const { count: researcherCount, error: researcherError } = await supabase
      .from('researcher')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', adminId);

    console.log('🔬 Researcher query result:', { researcherCount, researcherError, adminId });

    if (mentorError || researcherError) {
      console.error('❌ Failed to get admin stats:', mentorError || researcherError);
      throw new Error('Failed to fetch admin statistics');
    }

    // Get recently created users by this admin (top 5)
    const { data: recentMentors, error: recentMentorError } = await supabase
      .from('mentor')
      .select(`
        id,
        profiles!inner(name, email, created_at)
      `)
      .eq('created_by', adminId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('📅 Recent mentors:', { recentMentors, recentMentorError });

    const { data: recentResearchers, error: recentResearcherError } = await supabase
      .from('researcher')
      .select(`
        id,
        profiles!inner(name, email, created_at)
      `)
      .eq('created_by', adminId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('📅 Recent researchers:', { recentResearchers, recentResearcherError });

    if (recentMentorError || recentResearcherError) {
      console.error('❌ Failed to get recent users:', recentMentorError || recentResearcherError);
      throw new Error('Failed to fetch recent users');
    }

    // Combine and sort recent users
    const recentUsers = [...(recentMentors || []), ...(recentResearchers || [])]
      .map((user: any) => ({
        id: user.id,
        name: user.profiles?.[0]?.name || '',
        email: user.profiles?.[0]?.email || '',
        created_at: user.profiles?.[0]?.created_at
      }))
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    console.log('🔄 Combined recent users:', recentUsers);

    const stats = {
      mentorCount: mentorCount || 0,
      researcherCount: researcherCount || 0,
      totalUsers: (mentorCount || 0) + (researcherCount || 0),
      recentUsers
    };

    console.log('📊 Final stats:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to fetch admin stats:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    // Use RPC function to delete user securely
    const { data, error } = await supabase.rpc('delete_user_as_admin', {
      p_user_id: userId
    });

    if (error) {
      console.error('User deletion error:', error);
      throw error;
    }

    const result = data?.[0];
    if (!result?.success) {
      throw new Error(result?.message || 'Failed to delete user');
    }

    return { success: true };
  } catch (error) {
    console.error('User deletion failed:', error);
    throw error;
  }
}
