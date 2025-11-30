// SignalHubPremium.jsx — Clean Enterprise Version (for AuthenticatedLayout only)

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collegesAPI, scholarshipsAPI } from "../services/api";
import {
  Bookmark,
  Award,
  Calendar,
  Activity,
  Plus,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const SignalHubPremium = () => {
  const { user } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);

  const applications = [
    {
      id: 1,
      college: "Stanford University",
      status: "In Progress",
      deadline: "2025-01-15",
      progress: 75,
      color: "#1A535C",
    },
    {
      id: 2,
      college: "MIT",
      status: "Not Started",
      deadline: "2025-01-15",
      progress: 0,
      color: "#DC2626",
    },
    {
      id: 3,
      college: "UC Berkeley",
      status: "Submitted",
      deadline: "2024-11-30",
      progress: 100,
      color: "#1A535C",
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [colleges, scholarships] = await Promise.all([
          collegesAPI.getSavedColleges(),
          scholarshipsAPI.getSavedScholarships(),
        ]);
        setSavedColleges(colleges);
        setSavedScholarships(scholarships);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const stats = {
    savedColleges: savedColleges.length,
    savedScholarships: savedScholarships.length,
    applicationsInProgress: applications.filter(
      (a) => a.status === "In Progress"
    ).length,
    upcomingDeadlines: applications.filter(
      (a) => new Date(a.deadline) > new Date()
    ).length,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Signal Hub</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          { icon: Bookmark, label: "Saved Colleges", value: stats.savedColleges },
          {
            icon: Award,
            label: "Scholarships",
            value: stats.savedScholarships,
          },
          {
            icon: Activity,
            label: "In Progress",
            value: stats.applicationsInProgress,
          },
          {
            icon: Calendar,
            label: "Deadlines",
            value: stats.upcomingDeadlines,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4"
          >
            <item.icon size={28} className="text-[#004C3F]" />
            <div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Tracker */}
      <div className="bg-white p-8 rounded-xl border shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Application Tracker</h2>
          <button className="px-4 py-2 bg-[#004C3F] text-white rounded-lg flex items-center gap-2">
            <Plus size={16} /> Add Application
          </button>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="p-4 bg-gray-50 rounded-xl border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{app.college}</div>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-200">
                  {app.status}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${app.progress}%`,
                    backgroundColor: app.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadlines */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Urgent Deadlines</h2>
        <div className="space-y-4">
          {applications
            .filter((a) => new Date(a.deadline) > new Date())
            .map((app) => (
              <div
                key={app.id}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <div className="font-medium">{app.college}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(app.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SignalHubPremium;
