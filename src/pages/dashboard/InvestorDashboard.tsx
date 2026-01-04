import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Calendar, Phone, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import VideoCallModal from '../../components/video/VideoCallModal';
import UpcomingMeetings from '../../components/calendar/UpcomingMeetings';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';

const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [upcomingMeetingsCount, setUpcomingMeetingsCount] = useState(0);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  useEffect(() => {
    // Count upcoming meetings
    const updateMeetingsCount = () => {
      const events = window.calendarEvents || [];
      const confirmed = events.filter(
        event => event.type === 'meeting' && 
        (event.status === 'confirmed' || event.status === 'pending')
      );
      setUpcomingMeetingsCount(confirmed.length);
    };

    updateMeetingsCount();

    // Listen for calendar updates
    window.addEventListener('calendarEventsUpdated', updateMeetingsCount);
    return () => window.removeEventListener('calendarEventsUpdated', updateMeetingsCount);
  }, []);

  if (!user) return null;

  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch =
      searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(entrepreneur.industry);

    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowVideoCallModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Phone size={18} />
            <span>Start Video Call</span>
          </button>
          <Link to="/documents">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <FileText size={18} />
              <span>Documents</span>
            </button>
          </Link>
          <Link to="/entrepreneurs">
            <Button leftIcon={<PlusCircle size={18} />}>
              View All Startups
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>

            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <button key={industry} onClick={() => toggleIndustry(industry)}>
                  <Badge
                    variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                    className="cursor-pointer"
                  >
                    {industry}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {upcomingMeetingsCount}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <div className="lg:col-span-4">
        <UpcomingMeetings />
      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>

          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCallModal}
        onClose={() => setShowVideoCallModal(false)}
        availableUsers={entrepreneurs.map(ent => ({ id: ent.id, name: ent.name, role: 'entrepreneur' as const, avatarUrl: ent.avatarUrl }))}
      />
    </div>
  );
};

export default InvestorDashboard;