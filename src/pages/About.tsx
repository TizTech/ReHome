import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function About() {
  const navigate = useNavigate()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-text mb-4">About ReHome</h1>
          <p className="text-lg text-text-muted">
            A student tenancy takeover marketplace connecting students who need to transfer their accommodation contracts.
          </p>
        </div>
        
        <Card>
          <h2 className="text-2xl font-semibold text-text mb-4">What is ReHome?</h2>
          <p className="text-text mb-4">
            ReHome is a platform designed to help students find replacement tenants for their accommodation contracts. 
            Whether you're studying abroad, moving to a different city, or need to leave your accommodation early, 
            ReHome makes it easy to find someone to take over your tenancy.
          </p>
          <p className="text-text">
            This MVP version is a local demo that runs entirely in your browser. All listings are stored locally 
            on your device and persist across page refreshes using browser storage.
          </p>
        </Card>
        
        <Card>
          <h2 className="text-2xl font-semibold text-text mb-4">How it Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-text">
            <li>Browse available listings for contract takeovers in your city</li>
            <li>Use filters to find listings that match your preferences (price, location, room type, dates)</li>
            <li>Contact the current tenant through their preferred method (email, phone, or Instagram)</li>
            <li>If you're looking to transfer your own contract, create a new listing</li>
          </ol>
        </Card>
        
        <Card>
          <h2 className="text-2xl font-semibold text-text mb-4">Current Status</h2>
          <p className="text-text mb-4">
            <strong>This is a local demo version.</strong> All data stays on your device. No server, no database, no authentication.
          </p>
          <p className="text-text-muted text-sm">
            Future versions will include user authentication, real databases, payment processing, 
            and provider integrations. This MVP is focused on validating the core UX and user flows.
          </p>
        </Card>
        
        <Card>
          <h2 className="text-2xl font-semibold text-text mb-4">Terms</h2>
          <p className="text-text-muted text-sm">
            This is a demonstration application. All listings are for demo purposes only. 
            Please verify all information with the accommodation provider before making any commitments.
          </p>
        </Card>
      </div>
    </div>
  )
}

