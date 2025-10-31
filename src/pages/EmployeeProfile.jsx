import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMyProfile,
  updateMyProfile,
  updateProfilePicture,
  addSkill,
  deleteSkill,
  addCertification,
  deleteCertification
} from '../api/employeeApi';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiAward,
  FiTool,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiCamera
} from 'react-icons/fi';

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [workStats, setWorkStats] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    bio: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    emergency_name: ''
  });

  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);

  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    proficiency_level: 'intermediate',
    years_of_experience: ''
  });

  const [certForm, setCertForm] = useState({
    certification_name: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    certificate_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      const data = response.data;
      
      setProfile(data.profile);
      setSkills(data.skills || []);
      setCertifications(data.certifications || []);
      setWorkStats(data.workStats || {});
      
      setProfileForm({
        full_name: data.profile.full_name || '',
        phone: data.profile.phone || '',
        bio: data.profile.bio || '',
        date_of_birth: data.profile.date_of_birth || '',
        address: data.profile.address || '',
        emergency_contact: data.profile.emergency_contact || '',
        emergency_name: data.profile.emergency_name || ''
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load profile';
      showNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMyProfile(profileForm);
      showNotification('Profile updated successfully!', 'success');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateProfilePicture(reader.result);
          showNotification('Profile picture updated successfully!', 'success');
          fetchProfile();
        } catch (error) {
          showNotification('Failed to upload profile picture', 'error');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showNotification('Failed to upload profile picture', 'error');
    }
  };

  const handleAddSkill = async () => {
    try {
      await addSkill(skillForm);
      showNotification('Skill added successfully!', 'success');
      setShowSkillForm(false);
      setSkillForm({ skill_name: '', proficiency_level: 'intermediate', years_of_experience: '' });
      fetchProfile();
    } catch (error) {
      showNotification('Failed to add skill', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await deleteSkill(id);
      showNotification('Skill deleted successfully!', 'success');
      fetchProfile();
    } catch (error) {
      showNotification('Failed to delete skill', 'error');
    }
  };

  const handleAddCertification = async () => {
    try {
      await addCertification(certForm);
      showNotification('Certification added successfully!', 'success');
      setShowCertForm(false);
      setCertForm({
        certification_name: '',
        issuing_organization: '',
        issue_date: '',
        expiry_date: '',
        certificate_url: ''
      });
      fetchProfile();
    } catch (error) {
      showNotification('Failed to add certification', 'error');
    }
  };

  const handleDeleteCertification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      await deleteCertification(id);
      showNotification('Certification deleted successfully!', 'success');
      fetchProfile();
    } catch (error) {
      showNotification('Failed to delete certification', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'beginner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-sky-100 mt-1">Manage your personal information</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <FiX />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-slide-in`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profile?.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <label
                    htmlFor="profile-picture-upload"
                    className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full shadow-lg hover:bg-sky-600 transition cursor-pointer"
                  >
                    <FiCamera size={18} />
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">{profile?.full_name}</h2>
                <p className="text-sky-600 font-medium">{profile?.role}</p>
                <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-sky-50 rounded-lg p-4 text-center">
                  <FiCheckCircle className="mx-auto text-sky-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">{workStats?.completed_services || 0}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <FiClock className="mx-auto text-green-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-gray-800">{parseFloat(workStats?.total_hours_worked || 0).toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Total Hours</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMail className="text-sky-600" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiPhone className="text-sky-600" />
                    <span className="text-sm">{profile?.phone}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiMapPin className="text-sky-600" />
                    <span className="text-sm">{profile?.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-600">
                  <FiCalendar className="text-sky-600" />
                  <span className="text-sm">Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiUser className="text-sky-600" />
                  Personal Information
                </h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <FiSave size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        fetchProfile();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profile?.full_name || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profile?.phone || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                      value={profileForm.date_of_birth}
                      onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileForm.emergency_contact}
                      onChange={(e) => setProfileForm({ ...profileForm, emergency_contact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profile?.emergency_contact || '-'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profile?.address || '-'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {editing ? (
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800">{profile?.bio || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiTool className="text-sky-600" />
                  Skills & Expertise
                </h3>
                <button
                  onClick={() => setShowSkillForm(!showSkillForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  <FiPlus size={16} />
                  Add Skill
                </button>
              </div>

              {showSkillForm && (
                <div className="mb-4 p-4 bg-sky-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Skill name"
                      value={skillForm.skill_name}
                      onChange={(e) => setSkillForm({ ...skillForm, skill_name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    <select
                      value={skillForm.proficiency_level}
                      onChange={(e) => setSkillForm({ ...skillForm, proficiency_level: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Years"
                      value={skillForm.years_of_experience}
                      onChange={(e) => setSkillForm({ ...skillForm, years_of_experience: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Save Skill
                    </button>
                    <button
                      onClick={() => setShowSkillForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.length === 0 ? (
                  <p className="text-gray-500 col-span-2 text-center py-4">No skills added yet</p>
                ) : (
                  skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{skill.skill_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getProficiencyColor(skill.proficiency_level)}`}>
                            {skill.proficiency_level}
                          </span>
                          {skill.years_of_experience && (
                            <span className="text-xs text-gray-600">{skill.years_of_experience} years</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiAward className="text-sky-600" />
                  Certifications
                </h3>
                <button
                  onClick={() => setShowCertForm(!showCertForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  <FiPlus size={16} />
                  Add Certification
                </button>
              </div>

              {showCertForm && (
                <div className="mb-4 p-4 bg-sky-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Certification name"
                      value={certForm.certification_name}
                      onChange={(e) => setCertForm({ ...certForm, certification_name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="text"
                      placeholder="Issuing organization"
                      value={certForm.issuing_organization}
                      onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="date"
                      placeholder="Issue date"
                      value={certForm.issue_date}
                      onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                      type="date"
                      placeholder="Expiry date"
                      value={certForm.expiry_date}
                      onChange={(e) => setCertForm({ ...certForm, expiry_date: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddCertification}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Save Certification
                    </button>
                    <button
                      onClick={() => setShowCertForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {certifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No certifications added yet</p>
                ) : (
                  certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{cert.certification_name}</p>
                        <p className="text-sm text-gray-600 mt-1">{cert.issuing_organization}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {cert.issue_date && (
                            <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                          )}
                          {cert.expiry_date && (
                            <span>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="text-red-500 hover:text-red-700 transition ml-4"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
