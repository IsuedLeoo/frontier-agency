"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function NewServicePage() {
  // Pre‑defined departments (could be fetched from the DB later)
  const [departments, setDepartments] = useState<string[]>([
    "Web Design",
    "SEO Optimization",
    "Content Creation",
    "Email Marketing",
    "Social Media Management",
  ]);

  const [newDept, setNewDept] = useState("");

  const [services, setServices] = useState<{
    name: string;
    description: string;
    department: string;
  }[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    department: "Web Design",
  });

  const addDepartment = () => {
    const trimmed = newDept.trim();
    if (trimmed && !departments.includes(trimmed)) {
      setDepartments([...departments, trimmed]);
      setForm({ ...form, department: trimmed });
    }
    setNewDept("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setServices([...services, { ...form }]);
    // Reset form
    setForm({ name: "", description: "", department: departments[0] || "" });
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Add New Service
        </h1>
        <Link href="/dashboard/services" className="text-xs font-medium uppercase tracking-[0.04em] text-[#888888] hover:text-white">
          ← Back to Services
        </Link>
      </div>

      {/* Service form */}
      <form onSubmit={handleSubmit} className="reveal bg-black p-6 rounded-xl border border-[#333333]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Service Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1" style={{ fontFamily: "var(--font-inter)" }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-white" style={{ fontFamily: "var(--font-inter)" }}>
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="px-4 py-2 bg-[#222222] border border-[#333333] rounded-sm text-white focus:outline-none focus:border-[#C5A55A]"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="New department"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="px-2 py-1 bg-[#222222] border border-[#333333] rounded-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#C5A55A]"
              />
              <button
                type="button"
                onClick={addDepartment}
                className="ml-2 px-2 py-1 bg-[#C5A55A] text-xs rounded-sm hover:bg-[#D4B07A]"
              >
                Add Dept
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#C5A55A] px-4 py-2 rounded-sm font-medium text-white hover:bg-[#D4B07A]"
          >
            <Plus size={16} />
            Save Service
          </button>
        </div>
      </form>

      {/* List of services added in this session */}
      {services.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Newly Added Services (Session only)
          </h2>
          <ul className="space-y-3">
            {services.map((svc, idx) => (
              <li key={idx} className="reveal bg-black p-4 rounded-xl border border-[#333333]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-white">{svc.name}</h3>
                    <p className="text-sm text-[#888888]">{svc.description}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs bg-[#C5A55A] text-white rounded">{svc.department}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

