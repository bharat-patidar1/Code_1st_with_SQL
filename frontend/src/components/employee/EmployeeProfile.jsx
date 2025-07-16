


// src/constants/colorPalette.js
const colorPalette = {
    // Background Gradients
    background: {
      from: "from-gray-50",
      to: "to-blue-50/30",
    },
  
    // Card & Surface Colors
    surfaces: {
      card: "bg-white/95 backdrop-blur-sm",
      cardBorder: "border-gray-200/80",
      section: "bg-gray-50/60",
      emptyState: "bg-white/90",
    },
  
    // Status Indicators
    status: {
      approved: {
        bg: "bg-emerald-100/90",
        text: "text-emerald-800",
        border: "border-emerald-200",
        icon: "text-emerald-600",
      },
      rejected: {
        bg: "bg-rose-100/90",
        text: "text-rose-800",
        border: "border-rose-200",
        icon: "text-rose-600",
      },
      pending: {
        bg: "bg-amber-100/90",
        text: "text-amber-800",
        border: "border-amber-200",
        icon: "text-amber-600",
      },
      draft: {
        bg: "bg-gray-100/90",
        text: "text-gray-800",
        border: "border-gray-200",
        icon: "text-gray-600",
      },
    },
  
    // Skill Type Badges
    skillTypes: {
      technical: {
        bg: "bg-blue-100/90",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: "text-blue-600",
      },
      soft: {
        bg: "bg-emerald-100/90",
        text: "text-emerald-800",
        border: "border-emerald-200",
        icon: "text-emerald-600",
      },
      language: {
        bg: "bg-violet-100/90",
        text: "text-violet-800",
        border: "border-violet-200",
        icon: "text-violet-600",
      },
    },
  
    // Text Colors
    typography: {
      primary: "text-gray-900",
      secondary: "text-gray-600/95",
      tertiary: "text-gray-500/90",
      accent: "text-blue-600/90",
      inverted: "text-white",
    },
  
    // Interactive Elements
    interactive: {
      button: {
        primary: "bg-blue-600 hover:bg-blue-700",
        secondary: "bg-white border border-gray-300 hover:bg-gray-50",
        outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
        text: "text-white",
      },
      delete: {
        default: "text-gray-400 hover:text-rose-500",
        bgHover: "hover:bg-rose-50/50",
      },
    },
  
    // Special Effects
    effects: {
      backdrop: "backdrop-blur-sm",
      shadow: "shadow-sm",
      hoverShadow: "shadow-md",
      cardShadow: "shadow-lg",
      transition: "transition-all duration-200",
    },
  };
  
  
  
  
  import { useState, useRef } from 'react';
  import { Camera, Plus, X, Mail, Phone, Award, User, BookOpen, Briefcase } from 'lucide-react';
  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Badge } from '../ui/badge';
  import { Textarea } from '../ui/textarea';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
  import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
  import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import EmployeeNavbar from './EmployeeNavbar';
  
  
  const EmployeeProfile = () => {
    const [profile, setProfile] = useState({
      name: '',
      bio: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      certifications: [],
      skills: [],
      profilePhoto: ''
    });
  
    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState('');
    const [skillType, setSkillType] = useState('technical');
    const fileInputRef = useRef(null);
  
    const handlePhotoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile({
            ...profile,
            profilePhoto: reader.result
          });
        };
        reader.readAsDataURL(file);
      }
    };
  
    const addSkill = () => {
      if (newSkill.trim() && !profile.skills.some(s => s.name === newSkill.trim())) {
        setProfile({
          ...profile,
          skills: [...profile.skills, { name: newSkill.trim(), type: skillType }]
        });
        setNewSkill('');
      }
    };
  
    const addCertification = () => {
      if (newCertification.trim() && !profile.certifications.includes(newCertification.trim())) {
        setProfile({
          ...profile,
          certifications: [...profile.certifications, newCertification.trim()]
        });
        setNewCertification('');
      }
    };
  
    const removeSkill = (skillToRemove) => {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill.name !== skillToRemove)
      });
    };
  
    const removeCertification = (certToRemove) => {
      setProfile({
        ...profile,
        certifications: profile.certifications.filter(cert => cert !== certToRemove)
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Profile submitted:', profile);
      // Add API call here in a real application
    };
  
    const getSkillBadgeColor = (type) => {
      switch (type) {
        case 'technical':
          return `${colorPalette.leaveTypes.paid.bg} ${colorPalette.leaveTypes.paid.text} ${colorPalette.leaveTypes.paid.border}`;
        case 'soft':
          return `${colorPalette.leaveTypes.casual.bg} ${colorPalette.leaveTypes.casual.text} ${colorPalette.leaveTypes.casual.border}`;
        case 'language':
          return `${colorPalette.leaveTypes.sick.bg} ${colorPalette.leaveTypes.sick.text} ${colorPalette.leaveTypes.sick.border}`;
        default:
          return `${colorPalette.leaveTypes.unpaid.bg} ${colorPalette.leaveTypes.unpaid.text} ${colorPalette.leaveTypes.unpaid.border}`;
      }
    };
  
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20'>
            <EmployeeNavbar />
      <div className={`min-h-screen p-6 bg-gradient-to-b mt-4 ${colorPalette.background.from} ${colorPalette.background.to}`}>
        <Card className={`max-w-4xl mx-auto ${colorPalette.effects.shadow} ${colorPalette.surfaces.card} ${colorPalette.surfaces.cardBorder}`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${colorPalette.typography.primary}`}>
              Employee Profile
            </CardTitle>
            <CardDescription className={`text-md ${colorPalette.typography.secondary}`}>
              Complete your professional information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-2 border-slate-200">
                    {profile.profilePhotoUrl ? (
                      <AvatarImage src={profile.profilePhotoUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-slate-100">
                        <User size={48} className="text-slate-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={`absolute bottom-0 right-0 p-2 rounded-full ${colorPalette.interactive.button.primary} hover:${colorPalette.interactive.button.hover} ${colorPalette.effects.hoverShadow} transition-colors`}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Plus size={16} className={colorPalette.interactive.button.text} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload photo</p>
                    </TooltipContent>
                  </Tooltip>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
  
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium ${colorPalette.typography.secondary} mb-1`}>
                    Full Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="John Doe"
                    required
                    className={`border ${colorPalette.surfaces.cardBorder}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${colorPalette.typography.secondary} mb-1`}>
                    Position
                  </label>
                  <Input
                    value={profile.position}
                    onChange={(e) => setProfile({...profile, position: e.target.value})}
                    placeholder="Software Engineer"
                    className={`border ${colorPalette.surfaces.cardBorder}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${colorPalette.typography.secondary} mb-1`}>
                    Department
                  </label>
                  <Input
                    value={profile.department}
                    onChange={(e) => setProfile({...profile, department: e.target.value})}
                    placeholder="Engineering"
                    className={`border ${colorPalette.surfaces.cardBorder}`}
                  />
                </div>
              </div>
  
              {/* Bio Section */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${colorPalette.typography.secondary} mb-1`}>
                  Professional Summary
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Describe your professional background and skills..."
                  rows={4}
                  className={`border ${colorPalette.surfaces.cardBorder}`}
                />
              </div>
  
              {/* Contact Information Section */}
              <div className="mb-8">
                <h2 className={`text-lg font-semibold ${colorPalette.typography.primary} mb-4 border-b pb-2 ${colorPalette.surfaces.cardBorder}`}>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className={colorPalette.typography.accent} size={18} />
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="Email address"
                      className={`border ${colorPalette.surfaces.cardBorder}`}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className={colorPalette.typography.accent} size={18} />
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="Phone number"
                      className={`border ${colorPalette.surfaces.cardBorder}`}
                    />
                  </div>
                </div>
              </div>
  
              {/* Skills Section */}
              <div className="mb-8">
                <h2 className={`text-lg font-semibold ${colorPalette.typography.primary} mb-4 border-b pb-2 ${colorPalette.surfaces.cardBorder}`}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill) => (
                    <Badge 
                      key={skill.name} 
                      className={`flex items-center gap-1 ${getSkillBadgeColor(skill.type)} ${colorPalette.effects.shadow}`}
                      variant="outline"
                    >
                      {skill.name}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill.name)}
                        className={`${colorPalette.interactive.delete.default} hover:${colorPalette.interactive.delete.hover}`}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    className={`border ${colorPalette.surfaces.cardBorder}`}
                  />
                  <select
                    value={skillType}
                    onChange={(e) => setSkillType(e.target.value)}
                    className={`border rounded-md px-3 ${colorPalette.surfaces.cardBorder} ${colorPalette.typography.secondary}`}
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skill</option>
                    <option value="language">Language</option>
                  </select>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addSkill} 
                    className={`${colorPalette.interactive.button.outline} hover:${colorPalette.interactive.button.hover} ${colorPalette.effects.hoverShadow}`}
                  >
                    Add
                  </Button>
                </div>
              </div>
  
              {/* Certifications Section */}
              <div className="mb-8">
                <h2 className={`text-lg font-semibold ${colorPalette.typography.primary} mb-4 border-b pb-2 ${colorPalette.surfaces.cardBorder}`}>
                  Certifications
                </h2>
                <div className="space-y-2 mb-3">
                  {profile.certifications.map((cert) => (
                    <div key={cert} className={`flex items-center justify-between p-3 rounded-md ${colorPalette.leaveTypes.unpaid.bg} ${colorPalette.leaveTypes.unpaid.border} border`}>
                      <div className="flex items-center gap-2">
                        <Award className={colorPalette.typography.accent} size={16} />
                        <span className={colorPalette.leaveTypes.unpaid.text}>{cert}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeCertification(cert)}
                        className={`${colorPalette.interactive.delete.default} hover:${colorPalette.interactive.delete.hover}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification"
                    onKeyDown={(e) => e.key === 'Enter' && addCertification()}
                    className={`border ${colorPalette.surfaces.cardBorder}`}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addCertification} 
                    className={`${colorPalette.interactive.button.outline} hover:${colorPalette.interactive.button.hover} ${colorPalette.effects.hoverShadow}`}
                  >
                    Add
                  </Button>
                </div>
              </div>
  
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className={`${colorPalette.interactive.button.primary} hover:${colorPalette.interactive.button.hover} ${colorPalette.effects.hoverShadow} transition-colors`}
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  };
  
  export default EmployeeProfile;