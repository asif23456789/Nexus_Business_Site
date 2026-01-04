import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import VideoCallModal from '../../components/video/VideoCallModal';
import UpcomingMeetings from '../../components/calendar/UpcomingMeetings';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [upcomingMeetingsCount, setUpcomingMeetingsCount] = useState(0);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }

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
  }, [user]);

  const handleRequestStatusUpdate = (
    requestId: string,
    status: 'accepted' | 'rejected'
  ) => {
    setCollaborationRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your startup today
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowVideoCallModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Phone size={18} />
            <span>Start Video Call</span>
          </button>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>
              Find Investors
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">
                  Pending Requests
                </p>
                <h3 className="text-xl font-semibold text-primary-900">
                  {pendingRequests.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">
                  Total Connections
                </p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(r => r.status === 'accepted').length}
                </h3>
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
                <p className="text-sm font-medium text-accent-700">
                  Upcoming Meetings
                </p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {upcomingMeetingsCount}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">
                  Profile Views
                </p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <div className="grid grid-cols-1">
        <div className="lg:col-span-4">
          <UpcomingMeetings />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Collaboration Requests
              </h2>
              <Badge variant="primary">
                {pendingRequests.length} pending
              </Badge>
            </CardHeader>

            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">
                    No collaboration requests yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    When investors show interest, requests will appear here
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended Investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Recommended Investors
              </h2>
              <Link
                to="/investors"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </CardHeader>

            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCallModal}
        onClose={() => setShowVideoCallModal(false)}
        availableUsers={investors.map(inv => ({ id: inv.id, name: inv.name, role: 'investor' as const, avatarUrl: inv.avatarUrl }))}
      />
    </div>
  );
};

export default EntrepreneurDashboard;