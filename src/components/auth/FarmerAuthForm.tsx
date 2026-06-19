import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAadhaarAuth } from '@/hooks/useAadhaarAuth';
import VoiceInput from './VoiceInput';
import OTPInput from './OTPInput';
import VoiceAssistant from '../VoiceAssistant';

interface FarmerAuthFormProps {
  mode: 'login' | 'signup';
  isLoading: boolean;
}

export default function FarmerAuthForm({ mode, isLoading }: FarmerAuthFormProps) {
  const [language, setLanguage] = useState('en');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  
  // Aadhaar form data
  const [aadhaarData, setAadhaarData] = useState({
    name: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    phoneNumber: ''
  });

  const { 
    isLoading: aadhaarLoading, 
    step, 
    currentData, 
    handleLogin: aadhaarLogin, 
    handleSignup: aadhaarSignup,
    handleOTPVerified, 
    handleCancel 
  } = useAadhaarAuth();

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      aadhaarLogin({ aadhaarNumber: aadhaarData.aadhaarNumber });
    } else {
      aadhaarSignup(aadhaarData);
    }
  };

  // Show OTP input if in OTP step
  if (step === 'otp' && currentData?.phoneNumber) {
    return (
      <OTPInput
        phoneNumber={currentData.phoneNumber}
        onVerified={handleOTPVerified}
        onCancel={handleCancel}
        type={mode}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="space-y-2">
        <Label>Language / भाषा / భాష</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Voice Assistant Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowVoiceAssistant(true)}
          className="flex items-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <circle cx="12" cy="19" r="3"/>
          </svg>
          Use Voice Assistant
        </Button>
      </div>

      {/* Aadhaar Form */}
        <form onSubmit={handleAadhaarSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">
              {mode === 'login' ? 'Farmer Login' : 'Farmer Registration'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your Aadhaar number to receive OTP'
                : 'Register with your Aadhaar for instant verification'
              }
            </p>
          </div>

          {mode === 'signup' && (
            <VoiceInput
              id="name"
              label="Full Name"
              value={aadhaarData.name}
              onChange={(value) => setAadhaarData(prev => ({ ...prev, name: value }))}
              placeholder="Enter your full name as per Aadhaar"
              required
              language={language}
            />
          )}

          <VoiceInput
            id="aadhaar"
            label="Aadhaar Number"
            value={aadhaarData.aadhaarNumber}
            onChange={(value) => {
              const numericValue = value.replace(/\D/g, '').slice(0, 12);
              setAadhaarData(prev => ({ ...prev, aadhaarNumber: numericValue }));
            }}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={12}
            required
            className="text-center tracking-wider"
            language={language}
          />

          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="flex gap-2">
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={aadhaarData.dateOfBirth}
                    onChange={(e) => setAadhaarData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // Voice input for date would need special handling
                      // For now, just show a tip
                      alert('Please use the date picker or type manually for date of birth');
                    }}
                    className="shrink-0"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <circle cx="12" cy="19" r="3"/>
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your date of birth as per Aadhaar
                </p>
              </div>

              <VoiceInput
                id="phone"
                label="Mobile Number"
                type="tel"
                value={aadhaarData.phoneNumber}
                onChange={(value) => {
                  const numericValue = value.replace(/\D/g, '').slice(0, 10);
                  setAadhaarData(prev => ({ ...prev, phoneNumber: numericValue }));
                }}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                required
                language={language}
              />
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              isLoading || 
              aadhaarLoading || 
              aadhaarData.aadhaarNumber.length !== 12 ||
              (mode === 'signup' && (!aadhaarData.name || !aadhaarData.dateOfBirth || aadhaarData.phoneNumber.length !== 10))
            }
          >
            {aadhaarLoading 
              ? (mode === 'login' ? 'Sending OTP...' : 'Registering...') 
              : (mode === 'login' ? 'Send OTP' : 'Register & Send OTP')
            }
          </Button>
        </form>

      {/* Voice Assistant */}
      {showVoiceAssistant && (
        <VoiceAssistant
          onAuthSuccess={(data) => {
            // Handle successful voice authentication
            console.log('Voice auth success:', data);
            setShowVoiceAssistant(false);
          }}
          onClose={() => setShowVoiceAssistant(false)}
        />
      )}
    </div>
  );
}