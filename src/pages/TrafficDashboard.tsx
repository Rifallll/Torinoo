"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, MapPin, BarChart2, Bell, Search, User, Plus, TrendingUp, Clock, AlertTriangle, Car, Activity } from 'lucide-react';
import MapComponent from '@/components/MapComponent';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TrafficDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trafficIncidents = [
    { customer: "Main Street", assignedTo: "Sensor 1", location: "123 Main St, Anytown", time: "10:00 AM - 11:00 AM", status: "Resolved", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
    { customer: "Oak Avenue", assignedTo: "Sensor 2", location: "456 Oak Ave, Somewhere", time: "11:30 AM - 12:30 PM", status: "Ongoing", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
    { customer: "Pine Road", assignedTo: "Sensor 3", location: "789 Pine Rd, Nowhere", time: "1:00 PM - 2:00 PM", status: "Pending", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
  ];

  const sensorStatuses = [
    { name: "Sensor 1", role: "Intersection", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
    { name: "Sensor 2", role: "Highway", status: "Warning", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
    { name: "Sensor 3", role: "Residential", status: "Offline", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
    { name: "Sensor 4", role: "Bridge", status: "Active", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" },
  ];

  const mapMarkers = [
    { lat: 51.505, lng: -0.09, popupText: "Sensor 1: Active", color: "green" },
    { lat: 51.51, lng: -0.1, popupText: "Sensor 2: Warning", color: "orange" },
    { lat: 51.52, lng: -0.08, popupText: "Sensor 3: Offline", color: "red" },
    { lat: 51.50, lng: -0.12, popupText: "Sensor 4: Active", color: "green" },
  ];

  const handleLocateAll = () => {
    // MapComponent handles fitting bounds when markers prop changes
    // No explicit action needed here beyond updating markers if they were dynamic
    console.log("Locating all sensors...");
  };

  const handleRefreshLocations = () => {
    // In a real app, this would fetch new location data
    console.log("Refreshing sensor locations...");
    // Potentially update mapMarkers state here if locations change
  };

  const handleAddIncident = () => {
    console.log("Opening add traffic incident form...");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`sidebar bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between px-4">
          <h1 className="text-xl font-bold text-gray-800">Traffic Monitor</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>

        <nav className="px-2 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-md bg-gray-100">
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/sensors" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <Users className="h-5 w-5 mr-3" />
            Sensors
          </Link>
          <Link to="/incidents" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-3" />
            Incidents
          </Link>
          <Link to="/reports" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <BarChart2 className="h-5 w-5 mr-3" />
            Reports
          </Link>
        </nav>

        <div className="px-4 py-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Sensor Status</h3>
          <div className="space-y-2">
            {sensorStatuses.map((sensor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    sensor.status === "Active" ? "bg-green-500" :
                    sensor.status === "Warning" ? "bg-yellow-500" : "bg-gray-300"
                  } mr-2`}></div>
                  <span className="text-sm font-medium text-gray-700">{sensor.name}</span>
                </div>
                <span className="text-xs text-gray-500">{sensor.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <h2 className="ml-4 text-xl font-semibold text-gray-700">Traffic Dashboard</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input type="text" placeholder="Search..." className="pl-10 pr-4 py-2" />
                </div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <span className="text-sm font-medium text-gray-700">Admin</span>
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin Avatar" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
                <Car className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-600 font-medium">-3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Sensors</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">+2</span> new sensors
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">Sensor Locations</CardTitle>
                  <div className="flex space-x-2">
                    <Button onClick={handleLocateAll}>Locate All</Button>
                    <Button variant="ghost" size="icon" onClick={handleRefreshLocations}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <MapComponent markers={mapMarkers} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">Traffic Incidents</CardTitle>
                  <Button onClick={handleAddIncident}>Add Incident</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Sensor ID</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trafficIncidents.map((incident, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full mr-4" src={incident.avatar} alt="" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{incident.customer}</div>
                                  <div className="text-sm text-gray-500">{incident.location}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-900">{incident.assignedTo}</div>
                              <div className="text-sm text-gray-500">Traffic Sensor</div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {incident.location.split(', ')[1]}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {incident.time}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  incident.status === "Resolved"
                                    ? "bg-green-100 text-green-600 hover:bg-green-100"
                                    : incident.status === "Ongoing"
                                    ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-600 hover:bg-red-100"
                                }
                              >
                                {incident.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" className="text-indigo-600 hover:text-indigo-900 p-0 h-auto">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Traffic Flow Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Based on historical data and real-time sensor input, here's the predicted traffic flow for the next hour:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Main Street (08:00-09:00)</span>
                      <Badge variant="outline" className="bg-green-100 text-green-600">Low Congestion</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Oak Avenue (08:00-09:00)</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-600">Moderate Congestion</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Pine Road (08:00-09:00)</span>
                      <Badge variant="outline" className="bg-red-100 text-red-600">High Congestion</Badge>
                    </div>
                  </div>
                  <Button className="mt-4 w-full">View Detailed Forecast</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <Plus className="h-6 w-6 text-indigo-600 mb-2" />
                      <span className="text-sm font-medium text-indigo-600">Add Incident</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <Users className="h-6 w-6 text-green-600 mb-2" />
                      <span className="text-sm font-medium text-green-600">Manage Sensors</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <MapPin className="h-6 w-6 text-yellow-600 mb-2" />
                      <span className="text-sm font-medium text-yellow-600">View Map</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
                      <BarChart2 className="h-6 w-6 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-purple-600">Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <MadeWithDyad />
        </main>
      </div>
    </div>
  );
};

export default TrafficDashboard;