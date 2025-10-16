import { useState, useEffect } from 'react';
import { ContactService, ContactMessage } from '../../services';
import { MailIcon, TrashIcon, CheckIcon, ClockIcon, AlertCircleIcon, DownloadIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminContacts = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await ContactService.getMessages({ page: 1, size: 100 });
      setMessages(response.items);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Filter messages based on current filter
    const filteredMessages = getFilteredMessages();
    
    // Transform data for Excel export
    const excelData = filteredMessages.map((message, index) => ({
      'No.': index + 1,
      'Name': message.name,
      'Email': message.email,
      'Phone': message.phone || 'Not provided',
      'Subject': message.subject,
      'Message': message.message,
      'Read Status': message.is_read ? 'Read' : 'Unread',
      'Date Received': new Date(message.created_at).toLocaleString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 5 },  // No.
      { wch: 20 }, // Name
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 30 }, // Subject
      { wch: 50 }, // Message
      { wch: 12 }, // Read Status
      { wch: 20 }  // Date
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Contact Messages');
    
    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0];
    const filename = `izonehub-messages-${filter}-${today}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
  };

  const getFilteredMessages = () => {
    if (filter === 'all') return messages;
    if (filter === 'unread') return messages.filter(msg => !msg.is_read);
    if (filter === 'read') return messages.filter(msg => msg.is_read);
    return messages;
  };

  const markAsRead = async (id: number) => {
    try {
      await ContactService.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await ContactService.deleteMessage(id);
        fetchMessages();
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.is_read) {
      try {
        await markAsRead(message.id);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  if (loading) {
    return <div className="text-center py-8">Loading contact messages...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <p className="text-white/60">
            {unreadCount} unread of {messages.length} total messages
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            title="Export to Excel"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-dark-lighter text-white/70 hover:text-white'
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-primary text-white' 
              : 'bg-dark-lighter text-white/70 hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'read' 
              ? 'bg-primary text-white' 
              : 'bg-dark-lighter text-white/70 hover:text-white'
          }`}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      {/* Messages grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Messages list */}
        <div className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getFilteredMessages().map((message) => (
              <div
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedMessage?.id === message.id
                    ? 'border-primary bg-primary/10'
                    : message.is_read
                    ? 'border-neutral/20 bg-dark-lighter hover:border-neutral/40'
                    : 'border-orange-500/30 bg-orange-500/10 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <MailIcon size={16} className={message.is_read ? 'text-white/60' : 'text-orange-400'} />
                    <span className={`ml-2 font-medium ${message.is_read ? 'text-white/80' : 'text-white'}`}>
                      {message.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.is_read && (
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    )}
                    <span className="text-xs text-white/60">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/70 mb-1">{message.email}</p>
                <p className="font-medium text-white/90 mb-2 line-clamp-1">{message.subject}</p>
                <p className="text-sm text-white/70 line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>
          
          {getFilteredMessages().length === 0 && (
            <div className="text-center py-8 text-white/60">
              No messages found for the selected filter.
            </div>
          )}
        </div>

        {/* Message details */}
        <div className="space-y-4">
          {selectedMessage ? (
            <div className="bg-dark-lighter rounded-lg border border-neutral/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-white/60">
                    <span>From: {selectedMessage.name}</span>
                    <span>({selectedMessage.email})</span>
                    {selectedMessage.phone && (
                      <span>Phone: {selectedMessage.phone}</span>
                    )}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!selectedMessage.is_read && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckIcon size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-neutral/20 pt-4">
                <h4 className="font-medium mb-2">Message:</h4>
                <div className="whitespace-pre-wrap text-white/80">
                  {selectedMessage.message}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <ClockIcon size={14} className="mr-1 text-white/60" />
                      <span className="text-white/60">
                        {new Date(selectedMessage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedMessage.is_read ? (
                      <div className="flex items-center text-sm text-green-400">
                        <CheckIcon size={14} className="mr-1" />
                        Read
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-orange-400">
                        <AlertCircleIcon size={14} className="mr-1" />
                        Unread
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
                  >
                    <MailIcon size={16} className="mr-2" />
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-dark-lighter rounded-lg border border-neutral/20 p-6 text-center text-white/60">
              <MailIcon size={48} className="mx-auto mb-4 text-white/30" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;