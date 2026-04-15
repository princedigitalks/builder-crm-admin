import React, { useState, useEffect } from 'react';
import { X, User, Building, Mail, Phone, MapPin, CreditCard, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createBuilder, updateBuilder } from '@/redux/slices/builderSlice';

interface BuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  loading?: boolean;
  initialData?: any;
  plans?: any[];
}

export default function BuilderModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData,
  plans = []
}: BuilderModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    address: '',
    planId: '',
    amountPaid: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Editing mode
      setFormData({
        fullName: initialData.userId?.fullName || '',
        email: initialData.userId?.email || '',
        phone: initialData.userId?.phone || '',
        password: '', // Don't populate password for security
        companyName: initialData.companyName || '',
        address: initialData.address || '',
        planId: initialData.subscriptions?.find((s: any) => s.status === 'active')?.planId || '',
        amountPaid: initialData.subscriptions?.find((s: any) => s.status === 'active')?.amountPaid?.toString() || '',
        isActive: initialData.isActive ?? true
      });
    } else {
      // Creating mode - only set defaults for required fields
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        companyName: '',
        address: '',
        planId: plans.length > 0 ? plans[0]._id : '',
        amountPaid: plans.length > 0 ? plans[0].price?.toString() : '',
        isActive: true
      });
    }
  }, [initialData, plans]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-fill amount when plan changes
    if (field === 'planId' && !initialData) {
      const selectedPlan = plans.find(p => p._id === value);
      if (selectedPlan) {
        setFormData(prev => ({ ...prev, amountPaid: selectedPlan.price.toString() }));
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Phone, email and plan are required
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.planId) newErrors.planId = 'Plan selection is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData: any = {
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        planId: formData.planId,
        amountPaid: parseFloat(formData.amountPaid) || 0
      };

      // Only include optional fields if they have values
      if (formData.fullName.trim()) submitData.fullName = formData.fullName.trim();
      if (formData.password.trim()) submitData.password = formData.password.trim();
      if (formData.companyName.trim()) submitData.companyName = formData.companyName.trim();
      if (formData.address.trim()) submitData.address = formData.address.trim();

      if (initialData) {
        // Update existing builder - include isActive for updates
        submitData.isActive = formData.isActive;
        await dispatch(updateBuilder({
          id: initialData._id,
          builderData: submitData
        })).unwrap();
      } else {
        // Create new builder
        await dispatch(createBuilder(submitData)).unwrap();
      }

      onClose();
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        companyName: '',
        address: '',
        planId: plans.length > 0 ? plans[0]._id : '',
        amountPaid: plans.length > 0 ? plans[0].price?.toString() : '',
        isActive: true
      });
    } catch (error: any) {
      console.error('Error submitting builder:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Building className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {initialData ? 'Edit Builder' : 'Add New Builder'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {initialData ? 'Update builder information and subscription' : 'Create a new builder account with subscription'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User size={16} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                        errors.fullName ? "border-red-300" : "border-slate-200"
                      )}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                        errors.email ? "border-red-300" : "border-slate-200"
                      )}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                        errors.phone ? "border-red-300" : "border-slate-200"
                      )}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {!initialData && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={cn(
                            "w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                            errors.password ? "border-red-300" : "border-slate-200"
                          )}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building size={16} />
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                        errors.companyName ? "border-red-300" : "border-slate-200"
                      )}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none",
                        errors.address ? "border-red-300" : "border-slate-200"
                      )}
                      placeholder="Enter complete address"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard size={16} />
                  Subscription Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Plan *
                    </label>
                    <select
                      value={formData.planId}
                      onChange={(e) => handleInputChange('planId', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                        errors.planId ? "border-red-300" : "border-slate-200"
                      )}
                    >
                      <option value="">Select a plan</option>
                      {plans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.planName} (₹{plan.price}/{plan.duration === 'Annually' ? 'year' : plan.duration.toLowerCase()})
                        </option>
                      ))}
                    </select>
                    {errors.planId && (
                      <p className="text-xs text-red-600 mt-1">{errors.planId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.amountPaid}
                      onChange={(e) => handleInputChange('amountPaid', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter amount paid"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {initialData && (
                  <div className="mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Account Active</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Builder' : 'Create Builder')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}