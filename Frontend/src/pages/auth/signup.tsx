import { useState } from 'react';
import { z } from 'zod';
import type {ChangeEvent, FormEvent} from 'react';
import { userSignupSchema } from '../../schema/user';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router';

type SignupFormData = z.infer<typeof userSignupSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<SignupFormData>>({
    role: 'user'
  });
  const [skills, setSkills] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToValidate = {
        ...formData,
        skills: skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      const validatedData = userSignupSchema.parse(formDataToValidate);
      authService.signup(validatedData)
      navigate('/auth/signin/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setErrors(errorMap);
      }
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'volunteer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="e.g., First Aid, CPR, Search & Rescue"
              />
            </div>
          </div>
        );
      case 'first_responder':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Unit"
              />
            </div>
          </div>
        );
      case 'government':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Position"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white mb-6">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Full Name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
              <input
                type="tel"
                name="phone"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="volunteer">Volunteer</option>
                <option value="first_responder">First Responder</option>
                <option value="government">Government</option>
              </select>
            </div>

            {renderRoleSpecificFields && renderRoleSpecificFields()}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 font-medium text-lg transition-all duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;