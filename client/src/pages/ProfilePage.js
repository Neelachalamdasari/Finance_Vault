import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    // Styled loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-[#FDFFD4]/80">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xl">Loading Profile...</span>
            </div>
        );
    }

    // Styled error state
    if (!profile) {
        return (
            <div className="text-center min-h-[60vh] flex flex-col justify-center items-center text-[#FDFFD4]">
                <h2 className="text-2xl font-bold text-red-400">Error</h2>
                <p className="mt-2 text-lg text-[#FDFFD4]/80">Could not load your profile. Please try again later.</p>
            </div>
        );
    }

    // Profile item component for consistent styling
    const ProfileDetail = ({ label, value }) => (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-[#FDFFD4]/20">
            <dt className="text-md font-semibold text-emerald-400">{label}:</dt>
            <dd className="mt-1 text-md text-[#FDFFD4] sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    );

    return (
        <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8 text-[#073737]">
            <h1 className="text-4xl font-extrabold mb-10">Profile</h1>
            
            <div className="bg-[#0a4f4f] shadow-2xl rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <dl>
                        <ProfileDetail label="Name" value={profile.name} />
                        <ProfileDetail label="Email" value={profile.email} />
                        <ProfileDetail label="Role" value={profile.role} />
                        <ProfileDetail label="Status" value={profile.status || 'Active'} />
                        <ProfileDetail label="Company" value={profile.company?.name ?? '—'} />
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
