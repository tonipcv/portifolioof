import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Algo deu errado');
      }

      const { url } = await response.json();
      
      // Redireciona para a página de checkout do Stripe
      if (url) {
        router.push(url);
      }

    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Erro ao iniciar o checkout. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processando...' : 'Fazer Checkout'}
      </button>
    </div>
  );
}

export default Checkout; 