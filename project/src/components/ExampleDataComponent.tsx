import React, { useState } from 'react';
import { sampleAlerts } from '../data/sampleAlerts';
import { sampleTrustedContacts } from '../data/sampleContacts';
import { sampleForumPosts } from '../data/sampleForumPosts';
import { sampleFireResponse } from '../data/sampleResponses';
import { addAllSampleData } from '../utils/testData';

export const ExampleDataComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'contacts' | 'forum' | 'response'>('alerts');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddAllData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await addAllSampleData();
      setMessage(result.message || 'Sample data added successfully');
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect p-6 rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sample Data Explorer</h2>
      
      <div className="flex mb-6 space-x-4">
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'alerts' ? 'bg-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          Alerts
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          Trusted Contacts
        </button>
        <button 
          onClick={() => setActiveTab('forum')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'forum' ? 'bg-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          Forum Posts
        </button>
        <button 
          onClick={() => setActiveTab('response')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'response' ? 'bg-primary text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          Emergency Response
        </button>
      </div>
      
      <div className="mb-6">
        {activeTab === 'alerts' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Sample Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleAlerts.map(alert => (
                <div key={alert.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      alert.severity === 'critical' ? 'bg-purple-500' :
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="capitalize font-bold">{alert.type}</span>
                  </div>
                  <p className="text-white/90 mb-2">{alert.description}</p>
                  <p className="text-white/70 text-sm">{alert.location.address}</p>
                  <p className="text-white/70 text-xs mt-2">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'contacts' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Sample Trusted Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleTrustedContacts.map(contact => (
                <div key={contact.id} className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-1">{contact.name}</h4>
                  <p className="text-white/70 text-sm">
                    {contact.type === 'email' ? (
                      <span>Email: {contact.value}</span>
                    ) : (
                      <span>Phone: {contact.value}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'forum' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Sample Forum Posts</h3>
            <div className="space-y-6">
              {sampleForumPosts.map(post => (
                <div key={post.id} className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                  <div className="flex items-center text-white/60 text-sm mb-3">
                    <span>Posted by: {post.isAnonymous ? 'Anonymous' : post.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{post.timestamp.toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.likes} likes</span>
                  </div>
                  <p className="text-white/90 mb-3">{post.content}</p>
                  
                  {post.location && (
                    <p className="text-white/70 text-sm mb-3">
                      Location: {post.location.address}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <h5 className="font-semibold mb-2">Comments ({post.comments.length})</h5>
                    <div className="space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {comment.isAnonymous ? 'Anonymous' : comment.authorName}
                            </span>
                            <span className="text-white/60 text-xs">
                              {comment.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'response' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Sample Emergency Response</h3>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-3">
                Fire Emergency Response
                <span className="ml-2 text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  Alert ID: {sampleFireResponse.alertId}
                </span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold mb-2">Response Teams</h5>
                  <div className="space-y-3">
                    {sampleFireResponse.responseTeams.map(team => (
                      <div key={team.id} className="bg-white/10 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{team.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            team.status === 'on-scene' ? 'bg-green-500' :
                            team.status === 'dispatched' ? 'bg-blue-500' :
                            team.status === 'en-route' ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}>
                            {team.status}
                          </span>
                        </div>
                        <div className="text-white/70 text-sm">
                          {team.eta && <p>ETA: {team.eta}</p>}
                          <p>Contact: {team.contact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Evacuation Status</h5>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="mb-2">
                      Status: {' '}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sampleFireResponse.evacuationStatus.inProgress ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {sampleFireResponse.evacuationStatus.inProgress ? 'In Progress' : 'Completed'}
                      </span>
                    </p>
                    
                    {sampleFireResponse.evacuationStatus.evacuationRoutes.length > 0 && (
                      <div className="mb-2">
                        <p className="text-white/70 text-sm font-semibold">Evacuation Routes:</p>
                        <ul className="list-disc list-inside text-white/80 text-sm">
                          {sampleFireResponse.evacuationStatus.evacuationRoutes.map((route, index) => (
                            <li key={index}>{route}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {sampleFireResponse.evacuationStatus.assemblyPoints.length > 0 && (
                      <div>
                        <p className="text-white/70 text-sm font-semibold">Assembly Points:</p>
                        <ul className="list-disc list-inside text-white/80 text-sm">
                          {sampleFireResponse.evacuationStatus.assemblyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Status Updates</h5>
                <div className="space-y-3">
                  {sampleFireResponse.updates.map((update, index) => (
                    <div key={index} className="bg-white/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{update.updater}</span>
                        <span className="text-white/60 text-xs">
                          {update.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/80">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-lg font-bold mb-3">Add Sample Data to Firebase</h3>
        <p className="text-white/70 mb-4">
          This will add all the sample data to your Firebase database for testing purposes.
        </p>
        <button 
          onClick={handleAddAllData}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Data...' : 'Add All Sample Data'}
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}; 