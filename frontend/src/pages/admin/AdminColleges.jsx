import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { colleges } from '../../data/mockData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminColleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCollege, setEditingCollege] = useState(null);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
            <p className="text-gray-500">Manage college listings and IPEDS data</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white">
                <Plus size={18} className="mr-2" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New College</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>College Name</Label>
                    <Input placeholder="e.g., Stanford University" className="mt-1" />
                  </div>
                  <div>
                    <Label>Short Name</Label>
                    <Input placeholder="e.g., Stanford" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="e.g., Stanford, CA" className="mt-1" />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input placeholder="e.g., California" className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Input placeholder="Public/Private" className="mt-1" />
                  </div>
                  <div>
                    <Label>Enrollment</Label>
                    <Input type="number" placeholder="45000" className="mt-1" />
                  </div>
                  <div>
                    <Label>Acceptance Rate</Label>
                    <Input type="number" placeholder="15" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="College description..." className="mt-1" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white">Save College</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Colleges table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Direct Admission</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColleges.map((college) => (
                <TableRow key={college.id}>
                  <TableCell className="font-medium">{college.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={college.image}
                        alt={college.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{college.name}</p>
                        <p className="text-sm text-gray-500">#{college.ranking} Rank</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      college.type === 'Public' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {college.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {college.directAdmission ? (
                      <CheckCircle className="inline text-green-500" size={20} />
                    ) : (
                      <XCircle className="inline text-gray-300" size={20} />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-[#f5a623] text-white px-2 py-1 rounded text-sm font-bold">
                      {college.rating}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye size={16} className="text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingCollege(college)}>
                        <Edit size={16} className="text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-[#1a5d3a] text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminColleges;
