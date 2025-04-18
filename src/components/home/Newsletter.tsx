
import React, { useState } from 'react';
import { Check, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success state after a few seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="bg-brand-primary py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-accent/20 text-brand-accent mb-6">
            <Mail className="h-6 w-6" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Fique por dentro das novidades
          </h2>
          
          <p className="text-gray-300 mb-8 text-lg">
            Assine nossa newsletter e receba ofertas exclusivas, lançamentos e dicas personalizadas diretamente na sua caixa de entrada.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-grow">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled={isSubmitting || isSuccess}
              />
              {error && (
                <p className="text-sm text-red-400 mt-1 text-left">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="h-12 bg-brand-accent hover:bg-blue-600 transition-colors"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Inscrito!
                </span>
              ) : (
                "Inscrever-se"
              )}
            </Button>
          </form>
          
          <p className="text-gray-400 text-sm mt-4">
            Nós respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
